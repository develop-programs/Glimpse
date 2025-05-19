import React, { useState, useRef, useCallback, useEffect } from "react";
import { useAtom } from "jotai";
import Controls from "@/components/room/Controls.tsx"
import { useNavigate, useParams } from "react-router";
import {
    micAtom,
    cameraAtom,
    screenShareAtom,
    chatAtom,
    recordingAtom,
    participantsAtom
} from "@/data/room";
import { roomPeerService } from "@/services/room-peer";
import GridView from "@/components/room/views/GridView";
import SpotlightView from "@/components/room/views/SpotlightView";
import SidebarView from "@/components/room/views/SidebarView";
import ViewSelector, { ViewType } from "@/components/room/ViewSelector";
import AnimatedViewContainer from "@/components/room/AnimatedViewContainer";
import Debug from "@/components/room/Debug";
import { ChatProvider, useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { useJoinRoom, useLeaveRoom, useRoom } from "@/services/query-hooks";

// Define interface for remote peer
interface RemotePeer {
    id: string;
    stream: MediaStream | null;
    name?: string;
}

function RoomContent() {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { isJoined, isConnected: chatConnected, messages, users, sendMessage, typingUsers, setIsTyping } = useChat();

    const [mic, setMic] = useAtom(micAtom);
    const [camera, setCamera] = useAtom(cameraAtom);
    const [screenShare, setScreenShare] = useAtom(screenShareAtom);
    const [chat, setChat] = useAtom(chatAtom);
    const [recording, setRecording] = useAtom(recordingAtom);
    const [participants, setParticipants] = useAtom(participantsAtom);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // State for managing peer connections
    const [remotePeers, setRemotePeers] = useState<RemotePeer[]>([]);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    // View state
    const [currentView, setCurrentView] = useState<ViewType>("grid");
    const [spotlightPeerId, setSpotlightPeerId] = useState<string | undefined>(undefined);

    // Debugging state
    const [mediaError, setMediaError] = useState<string | null>(null);

    // Message input state
    const [messageInput, setMessageInput] = useState<string>("");
    const [isTyping, setIsInputTyping] = useState<boolean>(false);

    // Join the room when component mounts
    const joinRoomMutation = useJoinRoom();
    const leaveRoomMutation = useLeaveRoom();
    const { data: roomData, isLoading: isRoomLoading } = useRoom(roomId || '');

    useEffect(() => {
        if (roomId && user && !isJoined) {
            joinRoomMutation.mutate(roomId);
        }

        return () => {
            if (roomId && isJoined) {
                leaveRoomMutation.mutate(roomId);
            }
        };
    }, [roomId, user, isJoined]);

    // Initialize peer service
    useEffect(() => {
        if (roomId && user) {
            roomPeerService.init({
                roomId,
                userId: user.id,
                onIceCandidate: () => {
                    // This is handled internally by roomPeerService
                },
                onConnectionStateChange: (state) => {
                    console.log("Peer connection state changed:", state);
                    setIsConnected(state === 'connected');
                },
                onTrack: (event) => {
                    console.log("Received remote track:", event);
                    if (event.streams && event.streams[0]) {
                        const remoteStream = event.streams[0];
                        // Find the peerId from the target
                        const peerId = (event.target as any)._peerId;

                        if (peerId) {
                            setRemotePeers(prevPeers => {
                                // Check if this peer already exists
                                const existingPeerIndex = prevPeers.findIndex(p => p.id === peerId);

                                if (existingPeerIndex >= 0) {
                                    // Update existing peer
                                    const updatedPeers = [...prevPeers];
                                    updatedPeers[existingPeerIndex] = {
                                        ...updatedPeers[existingPeerIndex],
                                        stream: remoteStream
                                    };
                                    return updatedPeers;
                                } else {
                                    // Add new peer
                                    const user = users.find(u => u.id === peerId);
                                    return [
                                        ...prevPeers,
                                        {
                                            id: peerId,
                                            stream: remoteStream,
                                            name: user?.username || `User ${prevPeers.length + 1}`
                                        }
                                    ];
                                }
                            });
                        }
                    }
                }
            });

            // Join the room via peer service too
            roomPeerService.joinRoom(roomId, user.id);
        }

        return () => {
            roomPeerService.cleanup();
        };
    }, [roomId, user, users]);

    // Handle media stream with better error reporting and retry logic
    const initializeMediaStream = useCallback(async () => {
        if (!navigator || !navigator.mediaDevices) {
            console.error("MediaDevices API not available");
            setMediaError("MediaDevices API not available in your browser");
            return;
        }

        try {
            // Clear any existing stream first - but be careful with track stopping
            if (stream) {
                stream.getTracks().forEach(track => {
                    try {
                        track.stop();
                        console.log(`Stopped track: ${track.kind}, ID: ${track.id}`);
                    } catch (stopError) {
                        console.warn(`Failed to stop track ${track.kind}:`, stopError);
                    }
                });
            }

            // Check if we're requesting any media
            if (!camera && !mic) {
                console.warn("No media requested (both camera and mic are off)");
                setStream(null);
                if (videoRef.current) {
                    videoRef.current.srcObject = null;
                }
                return;
            }

            // Prepare constraints with explicit requirements for better browser compatibility
            const constraints = {
                video: camera ? {
                    width: { ideal: 1280, min: 640 },
                    height: { ideal: 720, min: 480 },
                    facingMode: "user",
                    frameRate: { ideal: 30, min: 15 }
                } : false,
                audio: mic ? {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 48000
                } : false
            };

            console.log("Requesting media with constraints:", JSON.stringify(constraints));

            // Request media access with timeout to avoid hanging indefinitely
            const timeoutPromise = new Promise<MediaStream>((_, reject) => {
                setTimeout(() => reject(new Error("Media access request timed out")), 15000);
            });

            const mediaStream = await Promise.race([
                navigator.mediaDevices.getUserMedia(constraints),
                timeoutPromise
            ]);

            // Log detailed stream information to help debug
            console.log("Media stream obtained:", {
                hasAudio: mediaStream.getAudioTracks().length > 0,
                hasVideo: mediaStream.getVideoTracks().length > 0,
                tracks: mediaStream.getTracks().map(t => ({
                    kind: t.kind,
                    enabled: t.enabled,
                    readyState: t.readyState,
                    id: t.id,
                    settings: t.getSettings() // Log actual settings used
                }))
            });

            // Make sure video tracks are enabled if camera is on
            if (camera && mediaStream.getVideoTracks().length > 0) {
                mediaStream.getVideoTracks().forEach(track => {
                    track.enabled = true;
                    console.log(`Video track enabled: ${track.id}`, track.getSettings());
                });
            } else if (camera && mediaStream.getVideoTracks().length === 0) {
                console.warn("Camera is enabled but no video tracks were obtained");
                setMediaError("Could not access camera - please check your device permissions");
            }

            // Make sure audio tracks are enabled if mic is on
            if (mic && mediaStream.getAudioTracks().length > 0) {
                mediaStream.getAudioTracks().forEach(track => {
                    track.enabled = true;
                    console.log(`Audio track enabled: ${track.id}`, track.getSettings());
                });
            } else if (mic && mediaStream.getAudioTracks().length === 0) {
                console.warn("Microphone is enabled but no audio tracks were obtained");
                setMediaError("Could not access microphone - please check your device permissions");
            }

            // Store the new stream
            setStream(mediaStream);
            setMediaError(null);

            // Apply stream to video element with proper error handling
            if (videoRef.current) {
                try {
                    // Set to null first to ensure the object change is detected
                    videoRef.current.srcObject = null;
                    // Add proper event listeners before setting srcObject
                    videoRef.current.onloadedmetadata = () => {
                        console.log("Video metadata loaded successfully");
                    };

                    // Short timeout to ensure DOM updates
                    setTimeout(() => {
                        if (videoRef.current) {
                            // Set srcObject and make sure it's applied
                            videoRef.current.srcObject = mediaStream;
                            console.log("Set video element's srcObject to new media stream");

                            // Try to start playing immediately
                            videoRef.current.play()
                                .then(() => console.log("Video playback started successfully"))
                                .catch(playError => {
                                    console.warn("Autoplay prevented, may require user interaction", playError);
                                    setMediaError("Video autoplay blocked - please click to play");

                                    // Add a click handler to the document to try playing on interaction
                                    const playOnInteraction = () => {
                                        if (videoRef.current) {
                                            videoRef.current.play()
                                                .then(() => {
                                                    console.log("Video played after user interaction");
                                                    setMediaError(null);
                                                    document.removeEventListener('click', playOnInteraction);
                                                })
                                                .catch(err => console.error("Still can't play video:", err));
                                        }
                                    };
                                    document.addEventListener('click', playOnInteraction, { once: true });
                                });
                        }
                    }, 100);
                } catch (streamError) {
                    console.error("Error setting video source:", streamError);
                    setMediaError("Failed to display video stream in UI");
                }
            } else {
                console.warn("videoRef.current is null - cannot set srcObject");
            }

            // Share the stream with peer connections
            if (roomId && user && mediaStream) {
                roomPeerService.addStream(mediaStream);
            }
        } catch (error) {
            console.error("Error accessing media devices:", error);
            let errorMessage = "Failed to access camera/microphone";

            if (error instanceof Error) {
                // Provide more detailed error messages
                if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                    errorMessage = "Camera/microphone access denied. Please check your permissions and reload the page.";
                } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                    errorMessage = "No camera/microphone found. Please connect a device and reload.";
                } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
                    errorMessage = "Camera/microphone is already in use by another application. Please close other video apps.";
                } else if (error.name === 'OverconstrainedError') {
                    errorMessage = "Your camera doesn't support the required resolution. Try using a different device.";
                } else if (error.message === "Media access request timed out") {
                    errorMessage = "Media access request timed out. Your browser might be blocking access.";
                }
            }

            setMediaError(errorMessage);

            // If camera fails, try with just audio
            if (camera) {
                console.log("Attempting fallback to audio-only");
                setCamera(false);
                try {
                    const audioOnlyStream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            echoCancellation: true,
                            noiseSuppression: true
                        },
                        video: false
                    });
                    setStream(audioOnlyStream);
                    if (videoRef.current) {
                        videoRef.current.srcObject = audioOnlyStream;
                    }
                    setMediaError("Camera access failed - using audio only");

                    // Share the audio-only stream with peer connections
                    if (roomId && user) {
                        roomPeerService.addStream(audioOnlyStream);
                    }
                } catch (audioError) {
                    console.error("Even audio-only failed:", audioError);
                }
            }
        }
    }, [camera, mic, stream, roomId, user]);

    // Add a custom debug function to diagnose media issues
    const debugMediaStream = (label: string, mediaStream: MediaStream | null) => {
        if (!mediaStream) {
            console.log(`[DEBUG ${label}] No media stream available`);
            return;
        }

        const videoTracks = mediaStream.getVideoTracks();
        const audioTracks = mediaStream.getAudioTracks();

        console.log(`[DEBUG ${label}] Stream info:`, {
            id: mediaStream.id,
            active: mediaStream.active,
            videoTracks: videoTracks.length,
            audioTracks: audioTracks.length,
            videoDetails: videoTracks.map(t => ({
                id: t.id,
                kind: t.kind,
                label: t.label,
                enabled: t.enabled,
                muted: t.muted,
                readyState: t.readyState,
                settings: t.getSettings()
            })),
            audioDetails: audioTracks.map(t => ({
                id: t.id,
                kind: t.kind,
                label: t.label,
                enabled: t.enabled,
                muted: t.muted,
                readyState: t.readyState
            }))
        });
    };

    useEffect(() => {
        initializeMediaStream();

        return () => {
            if (stream) {
                console.log("Cleaning up media stream");
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [camera, mic, initializeMediaStream]);

    // Add enhanced debugging effects
    useEffect(() => {
        if (stream) {
            debugMediaStream("Current Stream", stream);

            // Add track ended event listeners
            stream.getTracks().forEach(track => {
                track.onended = () => {
                    console.log(`Track ${track.kind} (${track.id}) ended unexpectedly`);
                    // If camera is on but video track ended, we might need to reinitialize
                    if (track.kind === 'video' && camera) {
                        console.log("Video track ended while camera should be on - reinitializing");
                        setTimeout(initializeMediaStream, 500);
                    }
                };

                track.onmute = () => console.log(`Track ${track.kind} (${track.id}) muted`);
                track.onunmute = () => console.log(`Track ${track.kind} (${track.id}) unmuted`);
            });
        }
    }, [stream, camera, initializeMediaStream]);

    // Add a function to test WebRTC connectivity
    const testConnection = useCallback(async () => {
        try {
            const testPC1 = new RTCPeerConnection();
            const testPC2 = new RTCPeerConnection();

            testPC1.onicecandidate = e => e.candidate && testPC2.addIceCandidate(e.candidate);
            testPC2.onicecandidate = e => e.candidate && testPC1.addIceCandidate(e.candidate);

            // Create a test data channel
            const dc1 = testPC1.createDataChannel('test');
            let connectionSuccessful = false;

            dc1.onopen = () => {
                console.log("✅ WebRTC connectivity test: SUCCESS");
                connectionSuccessful = true;
                dc1.close();
                testPC1.close();
                testPC2.close();
            };

            testPC2.ondatachannel = (e) => {
                const dc2 = e.channel;
                dc2.onopen = () => {
                    dc2.send('test');
                };
            };

            const offer = await testPC1.createOffer();
            await testPC1.setLocalDescription(offer);
            await testPC2.setRemoteDescription(offer);

            const answer = await testPC2.createAnswer();
            await testPC2.setLocalDescription(answer);
            await testPC1.setRemoteDescription(answer);

            // Set a timeout to check if connection was established
            setTimeout(() => {
                if (!connectionSuccessful) {
                    console.error("❌ WebRTC connectivity test: FAILED");
                    // Update the error message if WebRTC connectivity is blocked
                    setMediaError(prev =>
                        prev ? `${prev}. WebRTC connectivity may be blocked by network/firewall.` :
                            "WebRTC connectivity appears to be blocked by your network or firewall."
                    );
                    testPC1.close();
                    testPC2.close();
                }
            }, 5000);
        } catch (error) {
            console.error("Error in WebRTC connectivity test:", error);
        }
    }, []);

    // Call the test once when component mounts
    useEffect(() => {
        testConnection();
    }, [testConnection]);

    function toggleMic() {
        setMic(!mic);
        if (stream) {
            const audioTracks = stream.getAudioTracks();
            console.log("Toggling mic:", { newState: !mic, trackCount: audioTracks.length });

            audioTracks.forEach(track => {
                track.enabled = !mic;
                console.log(`Audio track ${track.id} enabled: ${track.enabled}`);
            });
        }
    }

    function toggleCamera() {
        const newCameraState = !camera;
        setCamera(newCameraState);
        console.log(`Toggling camera: ${newCameraState ? 'ON' : 'OFF'}`);

        if (stream) {
            // Get existing video tracks
            const videoTracks = stream.getVideoTracks();
            console.log("Current video tracks:", {
                newState: newCameraState,
                trackCount: videoTracks.length,
                tracks: videoTracks.map(t => ({
                    id: t.id,
                    enabled: t.enabled,
                    readyState: t.readyState
                }))
            });

            if (videoTracks.length > 0) {
                // If turning camera off, just disable tracks
                if (!newCameraState) {
                    videoTracks.forEach(track => {
                        track.enabled = false;
                        console.log(`Video track ${track.id} disabled`);
                    });
                } else {
                    // If turning camera on, enable existing tracks
                    let hasActiveTracks = false;
                    videoTracks.forEach(track => {
                        if (track.readyState === 'live') {
                            track.enabled = true;
                            hasActiveTracks = true;
                            console.log(`Video track ${track.id} enabled`);
                        } else {
                            console.log(`Video track ${track.id} is not live (${track.readyState})`);
                        }
                    });

                    // If no active tracks, need to reinitialize
                    if (!hasActiveTracks) {
                        console.log("No active video tracks found, reinitializing media");
                        initializeMediaStream();
                    }
                }
            } else if (newCameraState) {
                // If turning camera on and no video tracks, reinitialize
                console.log("No video tracks found, reinitializing media");
                initializeMediaStream();
            }
        } else if (newCameraState) {
            // If no stream and turning on camera, initialize
            console.log("No stream exists, initializing new media stream");
            initializeMediaStream();
        }
    }

    function toggleScreenShare() {
        const newScreenShareState = !screenShare;
        setScreenShare(newScreenShareState);

        if (!newScreenShareState) {
            // Turning off screen share
            console.log("Stopping screen share");

            if (stream) {
                // First stop any screen share tracks
                const videoTracks = stream.getVideoTracks();
                videoTracks.forEach(track => {
                    track.stop();
                    console.log(`Stopped video track: ${track.id}`);
                });

                // Return to camera if it was enabled
                if (camera) {
                    console.log("Returning to camera after screen share");
                    // Use our improved initializeMediaStream which handles audio properly
                    initializeMediaStream();
                } else {
                    // Just keep audio, disable video
                    // If there are audio tracks, create a new stream with just those
                    const audioTracks = stream.getAudioTracks();
                    if (audioTracks.length > 0 && mic) {
                        const audioOnlyStream = new MediaStream(audioTracks);
                        setStream(audioOnlyStream);
                        if (videoRef.current) {
                            videoRef.current.srcObject = audioOnlyStream;
                        }

                        // Update peer connections with audio-only stream
                        roomPeerService.addStream(audioOnlyStream);
                    } else {
                        // No audio or mic is off, so just clear the stream
                        setStream(null);
                        if (videoRef.current) {
                            videoRef.current.srcObject = null;
                        }
                    }
                }
            }
        } else {
            // Start screen share
            console.log("Starting screen share");

            if (!navigator.mediaDevices?.getDisplayMedia) {
                console.error("Screen sharing not supported in this browser");
                setMediaError("Screen sharing is not supported in your browser");
                setScreenShare(false);
                return;
            }

            navigator.mediaDevices.getDisplayMedia({
                video: camera,
                audio: mic // Don't capture audio from screen to avoid echo
            })
                .then(handleScreenShareSuccess)
                .catch(handleScreenShareError);
        }
    }

    // Extract screen share success handler to a separate function
    const handleScreenShareSuccess = (screenStream: MediaStream) => {
        console.log("Screen share stream obtained");

        // Set up screen share end handler
        setupScreenShareEndHandler(screenStream);

        // Handle audio for the screen share
        addAudioToScreenShare(screenStream);

        // Stop existing video tracks
        stopExistingVideoTracks();

        // Update UI with new stream
        updateStreamInUI(screenStream);

        // Update peer connections with screen share stream
        roomPeerService.addStream(screenStream);
    };

    // Handle when user stops screen sharing via browser UI
    const setupScreenShareEndHandler = (screenStream: MediaStream) => {
        const videoTrack = screenStream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.onended = () => {
                console.log("Screen sharing ended by user");
                setScreenShare(false);

                // Use the more robust media initialization function
                if (camera || mic) {
                    initializeMediaStream();
                }
            };
        }
    };

    // Add microphone audio to screen share if needed
    const addAudioToScreenShare = (screenStream: MediaStream) => {
        // Reuse existing audio tracks if we have them
        const existingAudioTracks = stream?.getAudioTracks() || [];

        if (existingAudioTracks.length > 0 && mic) {
            existingAudioTracks.forEach(track => {
                screenStream.addTrack(track);
                console.log("Added existing audio track to screen share:", track.id);
            });
        } else if (mic) {
            // If we want mic but don't have audio tracks, get new ones
            navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                .then(audioStream => {
                    const audioTrack = audioStream.getAudioTracks()[0];
                    if (audioTrack) {
                        screenStream.addTrack(audioTrack);
                        console.log("Added new audio track to screen share:", audioTrack.id);
                    }
                })
                .catch(err => console.error("Could not add audio to screen share:", err));
        }
    };

    // Stop existing video tracks before switching to screen share
    const stopExistingVideoTracks = () => {
        if (stream) {
            stream.getVideoTracks().forEach(track => {
                track.stop();
                console.log(`Stopped video track: ${track.id}`);
            });
        }
    };

    // Update the UI with the new screen share stream
    const updateStreamInUI = (newStream: MediaStream) => {
        setStream(newStream);
        if (videoRef.current) {
            videoRef.current.srcObject = newStream;
        }

        console.log("Screen share stream set with tracks:",
            newStream.getTracks().map(t => ({
                kind: t.kind,
                enabled: t.enabled,
                label: t.label
            }))
        );
    };

    // Handle errors in screen sharing
    const handleScreenShareError = (error: Error) => {
        console.error("Error accessing screen share:", error);

        let errorMessage = "Failed to start screen sharing";
        if (error.name === 'NotAllowedError') {
            errorMessage = "Screen sharing permission denied";
        } else if (error.message) {
            errorMessage = `Failed to start screen sharing: ${error.message}`;
        }

        setMediaError(errorMessage);
        setScreenShare(false);
    };

    function toggleChat() {
        setChat(!chat);
    }

    function toggleRecording() {
        setRecording(!recording);
    }

    function toggleParticipants() {
        setParticipants(!participants);
    }

    function toggleLeave() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        roomPeerService.cleanup();

        if (roomId && isJoined) {
            leaveRoomMutation.mutate(roomId);
        }

        navigate("/");
    }

    const handleSpotlightChange = (peerId?: string) => {
        setSpotlightPeerId(peerId);
    };

    const renderView = () => {
        switch (currentView) {
            case "grid":
                return (
                    <GridView
                        localStream={stream}
                        remotePeers={remotePeers}
                        isConnected={isConnected}
                        onSelectSpotlight={handleSpotlightChange}
                        spotlightPeerId={spotlightPeerId}
                    />
                );
            case "spotlight":
                return (
                    <SpotlightView
                        localStream={stream}
                        remotePeers={remotePeers}
                        isConnected={isConnected}
                        spotlightPeerId={spotlightPeerId}
                        onChangeSpotlight={handleSpotlightChange}
                    />
                );
            case "sidebar":
                return (
                    <SidebarView
                        localStream={stream}
                        remotePeers={remotePeers}
                        isConnected={isConnected}
                        primaryPeerId={spotlightPeerId}
                        onChangePrimary={handleSpotlightChange}
                    />
                );
            default:
                return (
                    <GridView
                        localStream={stream}
                        remotePeers={remotePeers}
                        isConnected={isConnected}
                    />
                );
        }
    };

    const viewContent = renderView();

    // Add error overlay for media access problems
    const renderErrorOverlay = () => {
        if (!mediaError) return null;

        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
                <div className="bg-gray-800 max-w-md p-6 rounded-xl shadow-2xl text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <h3 className="text-xl font-bold text-white mb-2">Media Access Error</h3>
                    <p className="text-gray-300 mb-6">{mediaError}</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => initializeMediaStream()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => {
                                setCamera(false);
                                setMic(false);
                                setMediaError(null);
                                // Try with just audio
                                navigator.mediaDevices.getUserMedia({ audio: true })
                                    .then(stream => {
                                        setStream(stream);
                                        console.log("Audio-only fallback initialized");
                                        roomPeerService.addStream(stream);
                                    })
                                    .catch(err => console.error("Even audio failed:", err));
                            }}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Join with Audio Only
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Handle message input changes and sending
    const handleMessageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageInput(e.target.value);

        // Handle typing status
        if (!isTyping && e.target.value.length > 0) {
            setIsInputTyping(true);
            setIsTyping(true);
        } else if (isTyping && e.target.value.length === 0) {
            setIsInputTyping(false);
            setIsTyping(false);
        }
    };

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            sendMessage(messageInput);
            setMessageInput("");
            setIsInputTyping(false);
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    // Format chat message timestamp
    const formatMessageTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Get active typing users string
    const getTypingText = () => {
        const typingUsernames = Array.from(typingUsers.values());

        if (typingUsernames.length === 0) return null;

        if (typingUsernames.length === 1) {
            return `${typingUsernames[0]} is typing...`;
        } else if (typingUsernames.length === 2) {
            return `${typingUsernames[0]} and ${typingUsernames[1]} are typing...`;
        } else {
            return `${typingUsernames.length} people are typing...`;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-900">
            {/* Add direct video element for debugging - make it conditionally rendered */}
            {process.env.NODE_ENV !== 'production' && (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="fixed top-0 right-0 w-64 h-48 z-50 bg-black border-2 border-red-500"
                    controls
                    onLoadedMetadata={() => console.log("Debug video: metadata loaded")}
                    onPlay={() => console.log("Debug video: playback started")}
                />
            )}

            <ViewSelector currentView={currentView} onChange={setCurrentView} />

            <div className="flex-1 relative overflow-hidden p-2 sm:p-6 md:p-8 lg:p-10">
                <AnimatedViewContainer currentView={currentView}>
                    {viewContent}
                </AnimatedViewContainer>
            </div>

            <Controls
                meetingId={roomId}
                ToggleParticipants={toggleParticipants}
                Leave={toggleLeave}
                ToggleCamera={toggleCamera}
                ToggleChat={toggleChat}
                ToggleMic={toggleMic}
                ToggleRecording={toggleRecording}
                ToggleScreenShare={toggleScreenShare}
            />

            {/* Add debug component */}
            {process.env.NODE_ENV !== 'production' && (
                <Debug
                    stream={stream}
                    remotePeers={remotePeers}
                    isConnected={isConnected}
                />
            )}

            {/* Render error overlay */}
            {renderErrorOverlay()}

            {/* Chat Side Panel with improved UI */}
            <div
                className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-30"
                style={{ transform: chat ? 'translateX(0)' : 'translateX(100%)' }}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900">
                    <h2 className="text-lg font-bold text-white">Chat</h2>
                    <button
                        onClick={toggleChat}
                        className="text-white hover:bg-gray-700 p-2 rounded-full transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col h-[calc(100%-64px)]">
                    <div className="flex-1 p-4 overflow-y-auto">
                        <div className="flex flex-col space-y-4">
                            {messages.length === 0 && (
                                <div className="flex justify-center my-4">
                                    <div className="text-xs text-gray-400 bg-gray-700/50 rounded-full px-3 py-1">No messages yet</div>
                                </div>
                            )}

                            {messages.map((message, index) => {
                                const isOwnMessage = user && message.sender.id === user.id;
                                const isSystem = message.messageType === 'system';

                                // Group messages by date - later could add date separators

                                if (isSystem) {
                                    return (
                                        <div key={message.id} className="flex justify-center my-4">
                                            <div className="text-xs text-gray-400 bg-gray-700/50 rounded-full px-3 py-1">
                                                {message.content}
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        key={message.id}
                                        className={`${isOwnMessage ? 'bg-blue-600 self-end rounded-lg rounded-tr-none' : 'bg-gray-700 self-start rounded-lg rounded-tl-none'} p-3 max-w-[80%] text-sm text-white`}
                                    >
                                        <p>{message.content}</p>
                                        <span className={`text-xs ${isOwnMessage ? 'text-blue-200' : 'text-gray-400'} mt-1 block`}>
                                            {isOwnMessage ? 'You' : message.sender.username} • {formatMessageTime(message.timestamp)}
                                        </span>
                                    </div>
                                );
                            })}

                            {typingUsers.size > 0 && (
                                <div className="text-xs text-gray-400 italic">
                                    {getTypingText()}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-700 bg-gray-900">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="flex-1 bg-gray-700 text-white border-none rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={messageInput}
                                onChange={handleMessageInputChange}
                                onKeyPress={handleKeyPress}
                            />
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
                                onClick={handleSendMessage}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Participants Side Panel with improved UI */}
            <div
                className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-30"
                style={{ transform: participants ? 'translateX(0)' : 'translateX(100%)' }}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900">
                    <h2 className="text-lg font-bold text-white">Participants ({users.length})</h2>
                    <button
                        onClick={toggleParticipants}
                        className="text-white hover:bg-gray-700 p-2 rounded-full transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                <div className="p-4 overflow-y-auto">
                    <ul className="space-y-2">
                        {user && (
                            <li className="py-3 px-4 bg-gray-700/40 rounded-lg flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-medium text-white">{user.username} (You)</div>
                                        <div className="text-xs text-gray-300 flex items-center gap-1">
                                            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            <span>{isConnected ? 'Connected' : 'Connecting...'}</span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )}

                        {users
                            .filter(u => user && u.id !== user.id)
                            .map(participant => (
                                <li
                                    key={participant.id}
                                    className="py-3 px-4 bg-gray-700/40 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-700 transition-colors"
                                    onClick={() => setSpotlightPeerId(
                                        participant.id === spotlightPeerId ? undefined : participant.id
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                            {participant.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">{participant.username}</div>
                                            <div className="text-xs text-gray-300 flex items-center gap-1">
                                                <div className={`h-2 w-2 rounded-full ${participant.isActive ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                                <span>{participant.isActive ? 'Active' : 'Inactive'}</span>
                                            </div>
                                            {participant.id === spotlightPeerId && (
                                                <div className="text-yellow-400 text-xs">
                                                    Spotlighted
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}

                        {users.length === 0 && (
                            <li className="py-6 text-center text-gray-400 border border-gray-700 border-dashed rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 opacity-50" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                </svg>
                                <p className="mt-2 text-xs">Share the meeting link to invite others</p>
                                <p className="mt-1">No other participants yet</p>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}

// Wrapper component that provides the ChatContext
export default function Room() {
    const { roomId } = useParams<{ roomId: string }>();

    if (!roomId) {
        return <div>Invalid room ID</div>;
    }

    return (
        <ChatProvider roomId={roomId}>
            <RoomContent />
        </ChatProvider>
    );
}
