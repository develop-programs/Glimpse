import { useRef, useEffect } from 'react';
import useStream from '@/hook/useStream';

interface VideoFeedProps {
  showControls?: boolean;
}

export default function VideoFeed({ showControls = true }: VideoFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    stream,
    isLoading,
    error,
    isVideoEnabled,
    toggleVideo
  } = useStream({ video: true });

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(e => {
        console.error("Error playing video:", e);
      });
    }
  }, [stream]);

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex items-center justify-center p-5">Loading camera...</div>;
    }

    if (error) {
      return (
        <div className="p-5 bg-red-100 rounded-lg text-red-700 text-center">
          {error}
        </div>
      );
    }

    if (!isVideoEnabled) {
      return (
        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg p-5 text-gray-700">
          Camera is turned off
        </div>
      );
    }

    return null;
  };

  return (
    <div className="relative w-full max-w-md">
      {renderContent()}
      
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full rounded-lg ${(!stream || !isVideoEnabled || error) ? 'hidden' : 'block'}`}
        aria-label="Your camera feed"
      />

      {showControls && (
        <button
          onClick={toggleVideo}
          className={`absolute bottom-2.5 right-2.5 px-3 py-2 text-white rounded transition-colors focus:outline-none focus:ring-2 ${
            isVideoEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
          aria-label={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
        >
          {isVideoEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
        </button>
      )}
    </div>
  );
}
