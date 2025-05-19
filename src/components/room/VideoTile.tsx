import React from "react";

interface VideoTileProps {
    stream: MediaStream | null;
    isLocal?: boolean;
    userName?: string;
    isConnected?: boolean;
    className?: string;
    onClick?: () => void;
    isSpotlighted?: boolean;
}

export default function VideoTile({
    stream,
    isLocal = false,
    userName = "User",
    isConnected = false,
    className = "",
    onClick,
    isSpotlighted = false,
}: VideoTileProps) {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = React.useState(true);
    const [isVideoLoaded, setIsVideoLoaded] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);
    const [videoError, setVideoError] = React.useState<string | null>(null);

    React.useEffect(() => {
        console.log("VideoTile: Stream changed", { 
            hasStream: !!stream,
            streamId: stream?.id,
            tracks: stream?.getTracks().map(t => ({ kind: t.kind, enabled: t.enabled, readyState: t.readyState }))
        });
        
        if (videoRef.current && stream) {
            try {
                // Important: Set to null first to force reload when the stream changes
                videoRef.current.srcObject = null;
                
                // Need a small delay to ensure the change is detected
                setTimeout(() => {
                    if (videoRef.current) {
                        // Apply the new stream
                        videoRef.current.srcObject = stream;
                        
                        // Check if there are active video tracks
                        const hasVideoTracks = stream.getVideoTracks().some(track => 
                            track.readyState === 'live' && track.enabled
                        );
                        
                        if (!hasVideoTracks) {
                            console.warn("Stream has no active video tracks");
                        }
                        
                        // Explicitly request play when srcObject is set
                        videoRef.current.play().catch(e => {
                            console.error("Error playing video:", e);
                            setVideoError("Autoplay failed - user interaction required");
                        });
                        
                        setVideoError(null);
                    }
                }, 200); // Increased delay to ensure DOM updates
                
            } catch (error) {
                console.error("Error setting video source:", error);
                setVideoError("Failed to display video");
            }
        } else {
            // Reset loaded state when stream changes/removed
            setIsVideoLoaded(false);
        }
        
        // Return cleanup function
        return () => {
            if (videoRef.current) {
                // Clear video source when component unmounts or stream changes
                videoRef.current.srcObject = null;
                console.log("Cleared video srcObject during cleanup");
            }
        };
    }, [stream]);

    const handleVideoLoaded = () => {
        console.log("Video loaded successfully for", isLocal ? "local user" : userName);
        setIsVideoLoaded(true);
    };

    const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        console.error("Video error:", e);
        setVideoError("Could not play video");
        setIsVideoLoaded(false);
    };

    const handleMuteToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMuted(!isMuted);
    };

    // Handle play attempt when video is clicked
    const handleVideoClick = (e: React.MouseEvent) => {
        // If there's a video error, try to play the video when the user clicks
        if (videoError && videoRef.current && stream) {
            e.stopPropagation(); // Don't trigger onClick from props
            videoRef.current.play()
                .then(() => {
                    setVideoError(null);
                    setIsVideoLoaded(true);
                })
                .catch(err => {
                    console.error("Failed to play video after click:", err);
                });
        } else if (onClick) {
            onClick();
        }
    };

    return (
        <div 
            className={`relative rounded-xl overflow-hidden transition-all duration-300 bg-gray-800 ${className} ${
                onClick || videoError ? 'cursor-pointer transform hover:scale-[1.02]' : ''
            } ${isSpotlighted ? 'ring-4 ring-blue-500' : ''}`}
            onClick={handleVideoClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Loading state */}
            {stream && !isVideoLoaded && !videoError && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-white text-sm">Loading video...</p>
                    </div>
                </div>
            )}
            
            {/* Error state */}
            {videoError && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 z-10">
                    <div className="text-center p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 mx-auto mb-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-white">{videoError}</p>
                        <p className="text-red-300 text-sm mt-1">Try refreshing the page</p>
                    </div>
                </div>
            )}
            
            {/* Add a manual play button for autoplay blocked scenarios */}
            {videoError && videoError.includes("Autoplay failed") && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                    <button 
                        className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
                        onClick={handleVideoClick}
                    >
                        Click to Play Video
                    </button>
                </div>
            )}

            {/* No stream placeholder */}
            {!stream && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center z-10">
                    <div className="text-center p-4">
                        <div className="bg-gray-700 rounded-full p-6 mx-auto mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-gray-400">{isLocal ? "Camera off" : `${userName} (No video)`}</p>
                    </div>
                </div>
            )}

            {/* The actual video element */}
            <video
                ref={videoRef}
                className={`w-full h-full object-cover ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
                autoPlay
                playsInline
                muted={isLocal || isMuted}
                onLoadedData={handleVideoLoaded}
                onError={handleVideoError}
            />

            {/* Gradient overlay at bottom for better text contrast */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent z-20"></div>

            {/* User information */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 z-30">
                <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-white font-medium text-sm px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm">
                    {isLocal ? 'You' : userName}
                </span>
            </div>

            {/* Hover controls */}
            <div className={`absolute right-3 bottom-3 transition-opacity duration-200 z-30 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                <button 
                    onClick={handleMuteToggle}
                    className="bg-gray-800/80 hover:bg-gray-700 p-2 rounded-full backdrop-blur-sm"
                >
                    {isMuted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Spotlight indicator */}
            {isSpotlighted && (
                <div className="absolute top-3 right-3 bg-blue-500 text-white p-1 rounded-full z-30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </div>
            )}
        </div>
    );
}
