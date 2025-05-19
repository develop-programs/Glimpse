import React from "react";
import { useAtom } from "jotai";
import Controls from "@/components/room/Controls.tsx"
import { useNavigate, useParams } from "react-router";
import {
    micAtom,
    cameraAtom,
    screenShareAtom,
    chatAtom,
    recordingAtom,
    participantsAtom,
    roomConnectionStatusAtom,
    roomErrorAtom,
    chatMessagesAtom,
    roomParticipantsAtom
} from "@/data/room";
import { peerService } from "@/services/peer";
import { socket, socketService } from "@/services/socket-native";
import GridView from "@/components/room/views/GridView";
import SpotlightView from "@/components/room/views/SpotlightView";
import SidebarView from "@/components/room/views/SidebarView";
import ViewSelector, { ViewType } from "@/components/room/ViewSelector";
import AnimatedViewContainer from "@/components/room/AnimatedViewContainer";
import Debug from "@/components/room/Debug";
import api from "@/services/api";

/**
 * Interface for socket message data
 * @todo Add proper typing to WebSocket messages in a future update
 */
interface SocketMessageData {
    userId?: string;
    roomId?: string;
    users?: Array<{id: string; name?: string}>;
    messages?: Array<{id: string; sender: string; senderName?: string; content: string; timestamp: string}>;
    message?: {id: string; sender: string; senderName?: string; content: string; timestamp: string};
    code?: string;
}

/**
 * Interface for socket error data
 * @todo Add proper typing to WebSocket error messages in a future update
 */
interface SocketErrorData {
    message: string;
    code?: string;
}

// Note: These interfaces are for documentation purposes only
// TODO: In a future update, implement proper TypeScript typing for WebSocket messages
// and fix the any type warnings

/**
 * Interface representing a remote peer connection with associated media stream
 */
// Add pragmas to disable specific TypeScript checks for now
// @ts-ignore-next-line
interface RemotePeer {
    id: string;
    stream: MediaStream | null;
    name?: string;
}

/**
 * Room Component
 * 
 * This component handles the video conferencing room functionality including:
 * - WebRTC peer connections management
 * - Media stream access (camera and microphone)
 * - Screen sharing capabilities
 * - Chat functionality
 * - Room layout views (grid, spotlight, sidebar)
 * - Error handling for media access and connectivity issues
 */
export default function Room() {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const [mic, setMic] = useAtom(micAtom);
    const [camera, setCamera] = useAtom(cameraAtom);
    const [screenShare, setScreenShare] = useAtom(screenShareAtom);
    const [chat, setChat] = useAtom(chatAtom);
    const [recording, setRecording] = useAtom(recordingAtom);
    const [participants, setParticipants] = useAtom(participantsAtom);
    const [stream, setStream] = React.useState<MediaStream | null>(null);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [chatMessage, setChatMessage] = React.useState("");
    
    // Room connection state
    const [, setConnectionStatus] = useAtom(roomConnectionStatusAtom);
    const [, setRoomError] = useAtom(roomErrorAtom);
    const [chatMessages, setChatMessages] = useAtom(chatMessagesAtom);
    const [, setRoomParticipants] = useAtom(roomParticipantsAtom);

    // New state for managing peer connections
    const [remotePeers, setRemotePeers] = React.useState<RemotePeer[]>([]);
    const [isConnected, setIsConnected] = React.useState<boolean>(false);
    // View state
    const [currentView, setCurrentView] = React.useState<ViewType>("grid");
    const [spotlightPeerId, setSpotlightPeerId] = React.useState<string | undefined>(undefined);

    // Add debugging
    const [mediaError, setMediaError] = React.useState<string | null>(null);
    
    // Store event handlers to be able to remove them
    const eventHandlersRef = React.useRef<{[key: string]: (data: any) => void}>({});

    const initializePeerConnection = React.useCallback(() => {
        if (!stream || !roomId) return;

        // Get user info
        const userId = localStorage.getItem('userId') || 'user-' + Date.now();
        const displayName = localStorage.getItem('displayName') || 'Guest User';
        const isGuest = !localStorage.getItem('auth_token');
        
        console.log(`Initializing peer connection as ${isGuest ? 'guest' : 'authenticated'} user:`, {
            userId,
            displayName,
            roomId
        });

        // Initialize WebRTC peer connection service with all required callbacks
        peerService.init({
            roomId,
            peerId: userId,
            onConnectionStateChange: (state) => {
                console.log("Peer connection state changed:", state);
                setIsConnected(state === 'connected');
            },
            onTrack: (event) => {
                console.log("Received remote track:", event);
                if (event.streams && event.streams[0]) {
                    const remoteStream = event.streams[0];
                    // Get peerId in a TypeScript-safe way
                    let peerId = `remote-peer-${Date.now()}`;
                    
                    // Try to get the target peer ID from the parent connection
                    if (event.target && typeof event.target === 'object') {
                        const target = event.target as RTCPeerConnection;
                        const peerEntries = Array.from(peerService.getAllPeers());
                        const entry = peerEntries.find(entry => entry.connection === target);
                        if (entry) {
                            peerId = entry.id;
                        }
                    }
                    
                    setRemotePeers(prevPeers => {
                        // Check if we already have this peer
                        const existingPeerIndex = prevPeers.findIndex(p => p.id === peerId);
                        
                        if (existingPeerIndex >= 0) {
                            // Update existing peer
                            const updatedPeers = [...prevPeers];
                            updatedPeers[existingPeerIndex] = {
                                ...updatedPeers[existingPeerIndex],
                                stream: remoteStream,
                            };
                            return updatedPeers;
                        }
                        
                        // Add new peer
                        return [
                            ...prevPeers,
                            {
                                id: peerId,
                                stream: remoteStream,
                                name: `User ${prevPeers.length + 1}`
                            }
                        ];
                    });
                }
            }
        });

        // Add local stream to peer connections
        peerService.addStream(stream);
        
        // Join the room
        peerService.joinRoom(roomId, localStorage.getItem('userId') || 'user-' + Date.now());
    }, [roomId, stream]);

    // Handle media stream with better error reporting and retry logic
    const initializeMediaStream = React.useCallback(async () => {
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
                videoTracks: mediaStream.getVideoTracks().map(t => ({
                    id: t.id,
                    label: t.label,
                    enabled: t.enabled,
                    muted: t.muted
                })),
                audioTracks: mediaStream.getAudioTracks().map(t => ({
                    id: t.id,
                    label: t.label,
                    enabled: t.enabled,
                    muted: t.muted
                }))
            });

            // Enable/disable individual tracks based on user settings
            mediaStream.getVideoTracks().forEach(track => {
                track.enabled = camera;
                console.log(`Video track enabled: ${track.enabled}`, track.getSettings());
            });

            mediaStream.getAudioTracks().forEach(track => {
                track.enabled = mic;
                console.log(`Audio track enabled: ${track.enabled}`, track.getSettings());
            });

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
                            videoRef.current.srcObject = mediaStream;
                            console.log("Video source set successfully");
                        }
                    }, 50);
                } catch (videoError) {
                    console.error("Error setting video source:", videoError);
                    const errorMessage = videoError instanceof Error 
                        ? videoError.message 
                        : "Unknown error displaying video";
                    setMediaError(`Error displaying video: ${errorMessage}`);
                }
            }

            // If camera and mic are both working, update the peer connection
            if (
                (camera && mediaStream.getVideoTracks().length > 0) ||
                (mic && mediaStream.getAudioTracks().length > 0)
            ) {
                console.log("Media obtained successfully, updating peer connections");
                // Add this stream to any peer connections
                if (peerService) {
                    peerService.addStream(mediaStream);
                }
            } else {
                console.warn("Media obtained but tracks don't match requested constraints");
                if (camera && mediaStream.getVideoTracks().length === 0) {
                    setMediaError("Could not access camera - please check your device permissions");
                } else if (mic && mediaStream.getAudioTracks().length === 0) {
                    setMediaError("Could not access microphone - please check your device permissions");
                }
            }
        } catch (error) {
            console.error("Error accessing media devices:", error);
            
            let errorMessage = "Error accessing media devices";
            if (error instanceof Error) {
                errorMessage = error.message;
                
                // Check specific error types
                if (error.name === 'NotAllowedError') {
                    setMediaError("Camera and/or microphone access was denied. Please check your browser permissions.");
                    return;
                } else if (error.name === 'NotReadableError' || error.name === 'AbortError') {
                    setMediaError("Could not access your camera/microphone. It might be in use by another application.");
                    return;
                } else if (error.name === 'NotFoundError') {
                    setMediaError("No camera or microphone found. Please connect a device and try again.");
                    return;
                }
            }
            
            setMediaError(`Error accessing media devices: ${errorMessage}`);
        }
    }, [camera, mic, stream]);

    // Debug utility function
    const debugMediaStream = (label: string, mediaStream: MediaStream) => {
        const videoTracks = mediaStream.getVideoTracks();
        const audioTracks = mediaStream.getAudioTracks();

        console.group(`Debug ${label} (tracks: V=${videoTracks.length}, A=${audioTracks.length})`);
        console.log("Video tracks:", videoTracks.map(t => ({
            id: t.id,
            kind: t.kind,
            label: t.label,
            enabled: t.enabled,
            muted: t.muted,
            readyState: t.readyState,
            settings: t.getSettings()
        })));
        console.log("Audio tracks:", audioTracks.map(t => ({
            id: t.id,
            kind: t.kind,
            label: t.label,
            enabled: t.enabled,
            muted: t.muted,
            readyState: t.readyState
        })));
        console.groupEnd();
    };

    // Set up WebSocket event handlers for room communication
    React.useEffect(() => {
        if (!roomId) {
            navigate('/');
            return;
        }

        // Connect to WebSocket server if not already connected
        if (!socketService.isConnected()) {
            console.log('Connecting to WebSocket server for room:', roomId);
            socketService.connect();
        } else {
            console.log('WebSocket connection already established');
        }

        // Check if we're in guest mode or authenticated
        const token = localStorage.getItem('auth_token');
        const isGuestMode = !token;
        
        if (isGuestMode) {
            console.log('Joining as guest user');
            // Ensure we have a user ID for the peer connection
            if (!localStorage.getItem('userId')) {
                const guestId = 'guest-' + Math.random().toString(36).substring(2, 15);
                localStorage.setItem('userId', guestId);
            }
            
            // For guest mode, we'll skip server authentication and just initialize peer connections directly
            setConnectionStatus('connected'); // Set connection status as connected for guest mode
            initializeMediaStream();
        } else {
            // For authenticated users, proceed with normal flow
            socketService.emit('authenticate', { token });
        }

        // Set up handlers for room events
        const authenticatedHandler = (data: any) => {
            console.log('Socket authenticated:', data);
            if (data.userId) {
                localStorage.setItem('userId', data.userId);
            }
            
            // Join the room once authenticated
            socketService.emit('join_room', { roomId });
        };

        const roomJoinedHandler = (data: any) => {
            console.log('Room joined:', data);
            setConnectionStatus('connected');
            setMediaError(null); // Clear any previous errors
            
            // Update room participants
            if (data.users) {
                setRoomParticipants(data.users.map((u: any) => u.id));
            }
            
            // Load existing messages
            if (data.messages) {
                setChatMessages(data.messages.map((m: any) => ({
                    id: m.id,
                    sender: m.senderName || m.sender,
                    content: m.content,
                    timestamp: new Date(m.timestamp)
                })));
            }
        };

        const userJoinedHandler = (data: any) => {
            console.log('User joined:', data);
            
            // Add user to participants list
            setRoomParticipants(prev => [...prev, data.userId]);
            
            // Add system message to chat
            if (data.message) {
                setChatMessages(prev => [...prev, {
                    id: data.message.id,
                    sender: 'System',
                    content: data.message.content,
                    timestamp: new Date(data.message.timestamp)
                }]);
            }
        };

        const userLeftHandler = (data: any) => {
            console.log('User left:', data);
            
            // Remove user from participants list
            setRoomParticipants(prev => prev.filter(id => id !== data.userId));
            
            // Add system message to chat
            if (data.message) {
                setChatMessages(prev => [...prev, {
                    id: data.message.id,
                    sender: 'System',
                    content: data.message.content,
                    timestamp: new Date(data.message.timestamp)
                }]);
            }
            
            // Remove peer connection for this user
            if (data.userId) {
                peerService.removePeer(data.userId);
                setRemotePeers(prev => prev.filter(peer => peer.id !== data.userId));
            }
        };

        const newMessageHandler = (data: any) => {
            console.log('New message:', data);
            
            // Add message to chat
            if (data.message) {
                setChatMessages(prev => [...prev, {
                    id: data.message.id,
                    sender: data.message.senderName || data.message.sender,
                    content: data.message.content,
                    timestamp: new Date(data.message.timestamp)
                }]);
            }
        };

        const errorHandler = (error: any) => {
            console.error('Socket error:', error);
            setRoomError(error.message || 'Connection error');
            
            // Display error message to user
            const errorMessage = error.message || 'Connection error occurred';
            setMediaError(`Room connection error: ${errorMessage}. Please try again.`);
            
            // Handle specific error types
            if (error.code === 'ROOM_NOT_FOUND') {
                setMediaError('This room no longer exists. Please create a new room.');
                // Auto-redirect after a delay
                setTimeout(() => navigate('/'), 5000);
            } else if (error.code === 'ROOM_FULL') {
                setMediaError('This room is at maximum capacity. Please try again later.');
            } else if (error.code === 'ACCESS_DENIED') {
                setMediaError('You do not have permission to join this room.');
                // Auto-redirect after a delay
                setTimeout(() => navigate('/'), 3000);
            }
        };

        const roomUsersHandler = (data: any) => {
            console.log('Room users:', data);
            if (data.users) {
                setRoomParticipants(data.users.map((u: any) => u.id));
            }
        };

        const webRTCSignalHandler = (data: any) => {
            console.log('WebRTC signal received:', data);
            // This is handled by the peerService
        };

        // Store handlers for cleanup
        eventHandlersRef.current = {
            authenticated: authenticatedHandler,
            room_joined: roomJoinedHandler,
            user_joined: userJoinedHandler,
            user_left: userLeftHandler,
            new_message: newMessageHandler,
            error: errorHandler,
            room_users: roomUsersHandler,
            webrtc_signal: webRTCSignalHandler
        };

        // Register event handlers
        socket.on('authenticated', authenticatedHandler);
        socket.on('room_joined', roomJoinedHandler);
        socket.on('user_joined', userJoinedHandler);
        socket.on('user_left', userLeftHandler);
        socket.on('new_message', newMessageHandler);
        socket.on('error', errorHandler);
        socket.on('room_users', roomUsersHandler);
        socket.on('webrtc_signal', webRTCSignalHandler);

        return () => {
            // Clean up WebSocket event handlers with proper reference to the functions
            Object.entries(eventHandlersRef.current).forEach(([event, handler]) => {
                socket.off(event, handler);
            });
            
            // Leave the room
            if (socketService.isConnected()) {
                socketService.emit('leave_room', { roomId });
            }
        };
    }, [roomId, navigate, setConnectionStatus, setRoomError, setChatMessages, setRoomParticipants]);

    // Add reconnection handling for network interruptions
    React.useEffect(() => {
        // Network status monitoring
        const handleOnline = () => {
            console.log("Network connection restored - attempting to reconnect");
            
            // Reconnect WebSocket
            if (!socketService.isConnected()) {
                socketService.connect();
                
                // Re-authenticate after reconnection
                const token = localStorage.getItem('auth_token');
                if (token) {
                    socketService.emit('authenticate', { token });
                }
                
                // Re-join room after reconnection
                if (roomId) {
                    socketService.emit('join_room', { roomId });
                }
            }
            
            // Reinitialize media if needed
            if (camera || mic) {
                initializeMediaStream();
            }
        };
        
        const handleOffline = () => {
            console.log("Network connection lost");
            setMediaError("Network connection lost. Waiting to reconnect...");
        };
        
        // Register network event listeners
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [roomId, camera, mic, initializeMediaStream]);

    // Test connectivity periodically
    React.useEffect(() => {
        let pingInterval: number | undefined;
        
        if (socketService.isConnected()) {
            // Set up periodic ping to keep connection alive and detect disconnections
            pingInterval = window.setInterval(() => {
                socketService.emit('ping', { timestamp: Date.now() });
            }, 30000); // 30 seconds
        }
        
        return () => {
            if (pingInterval) {
                window.clearInterval(pingInterval);
            }
        };
    }, [isConnected]);

    // Initialize media stream when component loads or camera/mic settings change
    React.useEffect(() => {
        initializeMediaStream();

        return () => {
            if (stream) {
                console.log("Cleaning up media stream");
                stream.getTracks().forEach(track => track.stop());
            }
            peerService.cleanup();
        };
    }, [camera, mic, initializeMediaStream]);

    // Initialize peer connection when stream is ready
    React.useEffect(() => {
        if (stream) {
            initializePeerConnection();
        }
    }, [stream, initializePeerConnection]);

    // Add enhanced debugging effects
    React.useEffect(() => {
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
    const testConnection = React.useCallback(async () => {
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
    React.useEffect(() => {
        testConnection();
    }, [testConnection]);

    function toggleMic() {
        const newMicState = !mic;
        setMic(newMicState);

        if (stream) {
            stream.getAudioTracks().forEach(track => {
                track.enabled = newMicState;
                console.log(`Audio track ${track.id} enabled: ${track.enabled}`);
            });
        } else if (newMicState) {
            // If user is turning mic on but we don't have a stream yet
            console.log("No stream available - initializing media");
            initializeMediaStream();
        }
    }

    function toggleCamera() {
        const newCameraState = !camera;
        setCamera(newCameraState);

        if (stream) {
            stream.getVideoTracks().forEach(track => {
                track.enabled = newCameraState;
                console.log(`Video track ${track.id} enabled: ${track.enabled}`);
            });
        } else if (newCameraState) {
            // If user is turning camera on but we don't have a stream yet
            console.log("No stream available - initializing media");
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

    const handleScreenShareSuccess = (screenStream: MediaStream) => {
        console.log("Screen share successful", screenStream);
        
        // Add event listener for when user stops screen sharing via the browser UI
        const videoTrack = screenStream.getVideoTracks()[0];
        videoTrack.onended = () => {
            console.log("Screen sharing ended via browser UI");
            setScreenShare(false);
            
            // Return to camera if it was enabled
            if (camera || mic) {
                initializeMediaStream();
            }
        };

        // Add microphone audio to screen share if needed
        addAudioToScreenShare(screenStream);
        
        // Update the stream state
        setStream(screenStream);
        
        // Update the video element with the new stream
        if (videoRef.current) {
            videoRef.current.srcObject = screenStream;
        }
        
        // Update peer connections with the new stream
        peerService.addStream(screenStream);
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
                .catch(err => {
                    console.error("Error getting audio for screen share:", err);
                });
        }
    };

    const handleScreenShareError = (error: Error) => {
        console.error("Error during screen sharing:", error);
        setScreenShare(false);
        
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
        console.log('Toggling chat:', !chat);
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
        peerService.cleanup();
        
        // Leave the room via API
        if (roomId) {
            api.rooms.leave(roomId)
                .then(() => console.log("Left room successfully"))
                .catch(err => console.error("Error leaving room:", err))
                .finally(() => navigate("/"));
        } else {
            navigate("/");
        }
    }

    const handleSpotlightChange = (peerId?: string) => {
        setSpotlightPeerId(peerId);
    };

    const sendChatMessage = () => {
        if (!chatMessage.trim() || !roomId) return;
        
        socketService.emit('chat_message', {
            roomId,
            content: chatMessage.trim()
        });
        
        setChatMessage("");
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
                        roomId={roomId || ''}
                    />
                );
            default:
                return (
                    <GridView
                        localStream={stream}
                        remotePeers={remotePeers}
                        isConnected={isConnected}
                        onSelectSpotlight={handleSpotlightChange}
                        spotlightPeerId={spotlightPeerId}
                    />
                );
        }
    };

    const renderErrorOverlay = () => {
        if (!mediaError) return null;

        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-w-lg w-full p-6 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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
                                    })
                                    .catch(err => console.error("Even audio failed:", err));
                            }}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Join with Audio Only
                        </button>
                        <button
                            onClick={() => {
                                setCamera(false);
                                setMic(false);
                                setMediaError(null);
                            }}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Join without Media
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="relative w-full h-full flex flex-col overflow-hidden bg-black">
            <div className="flex-grow flex items-center justify-center relative">
                <div className="absolute top-4 left-4 z-20">
                    <ViewSelector
                        currentView={currentView}
                        onChange={setCurrentView}
                    />
                </div>

                <AnimatedViewContainer currentView={currentView}>
                    {renderView()}
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
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col h-[calc(100%-64px)]">
                    <div className="flex-grow overflow-y-auto p-4 space-y-4">
                        {chatMessages.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <p>No messages yet.<br />Start the conversation!</p>
                            </div>
                        )}

                        {chatMessages.map(message => (
                            <div key={message.id} className="flex flex-col">
                                <div className="flex items-start gap-2">
                                    <div className="bg-blue-600 h-8 w-8 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                                        {message.sender.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-baseline gap-2">
                                            <p className="font-medium text-white">{message.sender}</p>
                                            <span className="text-xs text-gray-400">
                                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-gray-200">{message.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-gray-700 bg-gray-900">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                className="flex-grow bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Type your message..."
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        sendChatMessage();
                                    }
                                }}
                            />
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2 transition-colors"
                                onClick={sendChatMessage}
                                disabled={!chatMessage.trim()}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Participants Side Panel  */}
            <div
                className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-30"
                style={{ transform: participants ? 'translateX(0)' : 'translateX(100%)' }}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900">
                    <h2 className="text-lg font-bold text-white">Participants ({remotePeers.length + 1})</h2>
                    <button
                        onClick={toggleParticipants}
                        className="text-white hover:bg-gray-700 p-2 rounded-full transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                <div className="overflow-y-auto p-4">
                    <ul className="space-y-3">
                        <li className="py-3 px-4 bg-gray-700/40 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {isConnected ? 'Y' : '?'}
                                </div>
                                <div>
                                    <div className="font-medium text-white">You (Local)</div>
                                    <div className="text-xs text-gray-300 flex items-center gap-1">
                                        <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <span>{isConnected ? 'Connected' : 'Connecting...'}</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                        {remotePeers.map(peer => (
                            <li
                                key={peer.id}
                                className="py-3 px-4 bg-gray-700/40 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-700 transition-colors"
                                onClick={() => setSpotlightPeerId(peer.id === spotlightPeerId ? undefined : peer.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                        {(peer.name || 'User').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-medium text-white">{peer.name || 'Remote User'}</div>
                                        {peer.id === spotlightPeerId && (
                                            <div className="text-yellow-400">
                                                Spotlighted
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                        {remotePeers.length === 0 && (
                            <li className="py-6 text-center text-gray-400 border border-gray-700 border-dashed rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 opacity-50" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                <p className="mt-2 text-xs">Share the meeting link to invite others</p>
                                <p className="mt-1">No other participants yet</p>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}
