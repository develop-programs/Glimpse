import { atom, useAtom } from 'jotai';
import { useEffect, useRef, useState, useCallback } from 'react';

// Define proper types for the stream state
interface StreamState {
  video: boolean;
  audio: boolean;
}

// Use more descriptive atom name
const streamSettingsAtom = atom<StreamState>({
  video: true,
  audio: true,
});

// SVG Icon components for better readability
const AudioOnIcon = () => (
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
);

const AudioOffIcon = () => (
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
);

const VideoOnIcon = () => (
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
);

const VideoOffIcon = () => (
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
);

const ScreenShareIcon = () => (
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
);

const RecordingIcon = () => (
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
);

const RecordIcon = () => (
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5" />
);

// Use PascalCase for React component names
export default function Room() {
  const [streamState, setStreamState] = useAtom(streamSettingsAtom);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const userMediaStreamRef = useRef<MediaStream | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use useCallback for event handlers to prevent unnecessary re-renders
  const toggleVideo = useCallback(() => {
    setStreamState((prev) => ({ ...prev, video: !prev.video }));
  }, [setStreamState]);

  const toggleAudio = useCallback(() => {
    setStreamState((prev) => ({ ...prev, audio: !prev.audio }));
  }, [setStreamState]);

  const onShareScreen = useCallback(() => {
    if (isScreenSharing) {
      // Return to webcam if we're currently sharing screen
      if (userMediaStreamRef.current && videoRef.current) {
        videoRef.current.srcObject = userMediaStreamRef.current;
        videoRef.current.play().catch(err => console.error('Error playing video:', err));
        setIsScreenSharing(false);
      }
      return;
    }

    setIsLoading(true);
    navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: streamState.audio
    }).then(screenStream => {
      // Store the current user media stream if not already stored
      if (!userMediaStreamRef.current && videoRef.current?.srcObject) {
        userMediaStreamRef.current = videoRef.current.srcObject as MediaStream;
      }

      // Set the screen stream to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = screenStream;
        videoRef.current.play()
          .then(() => setIsScreenSharing(true))
          .catch(err => {
            console.error('Error playing screen share:', err);
            setError('Failed to play screen share');
          })
          .finally(() => setIsLoading(false));
      }

      // Listen for the end of screen sharing
      const screenTrack = screenStream.getVideoTracks()[0];
      screenTrack.onended = () => {
        // Return to webcam when screen sharing ends
        if (userMediaStreamRef.current && videoRef.current) {
          videoRef.current.srcObject = userMediaStreamRef.current;
          videoRef.current.play().catch(err => console.error('Error returning to webcam:', err));
          setIsScreenSharing(false);
        }
      };
    }).catch(error => {
      console.error('Error sharing screen:', error);
      setError('Screen sharing failed. Please try again.');
      setIsLoading(false);
    });
  }, [isScreenSharing, streamState.audio]);

  const onRecord = useCallback(() => {
    if (!videoRef.current?.srcObject) {
      setError('No media stream available to record');
      return;
    }

    if (!isRecording) {
      try {
        const mediaRecorder = new MediaRecorder(videoRef.current.srcObject as MediaStream);
        const recordedChunks: Blob[] = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `recording-${new Date().toISOString()}.webm`;
          document.body.appendChild(a);
          a.click();

          setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, 100);

          setIsRecording(false);
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to start recording:', err);
        setError('Failed to start recording');
      }
    } else {
      mediaRecorderRef.current?.stop();
      mediaRecorderRef.current = null;
    }
  }, [isRecording]);

  // Initialize user media and handle cleanup
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    
    if (videoRef.current && !isScreenSharing) {
      navigator.mediaDevices.getUserMedia(streamState)
        .then(stream => {
          if (!mounted) {
            // If component unmounted, stop tracks before discarding
            stream.getTracks().forEach(track => track.stop());
            return;
          }
          
          userMediaStreamRef.current = stream;
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play()
              .then(() => setError(null))
              .catch(err => {
                console.error('Error playing video:', err);
                setError('Failed to play media stream');
              })
              .finally(() => setIsLoading(false));
          }
        })
        .catch(error => {
          console.error('Error accessing webcam:', error);
          setError('Failed to access camera or microphone. Please check permissions.');
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }

    // Cleanup function to stop all media tracks
    return () => {
      mounted = false;
      // Stop all tracks when component unmounts
      if (userMediaStreamRef.current) {
        userMediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Also stop recording if active
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      
      // Stop screen sharing tracks
      if (videoRef.current?.srcObject && isScreenSharing) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, [streamState, isScreenSharing]);

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900 overflow-hidden">
      <div className="relative flex-grow w-full flex justify-center items-center">
        <div className={`video-container ${isScreenSharing ? 'screen-sharing' : 'webcam'}`}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={`${isScreenSharing ? 'object-contain' : 'object-cover'} h-[calc(100vh-10rem)] max-w-full rounded-lg shadow-lg`}
          ></video>
        </div>
      </div>

      <div className='flex justify-center gap-4 items-center p-4 bg-gray-800 fixed bottom-0 left-0 right-0'>
        <button
          onClick={toggleAudio}
          className={`p-3 rounded-full ${streamState.audio ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'} text-white transition-colors`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {streamState.audio ? <AudioOnIcon /> : <AudioOffIcon />}
          </svg>
        </button>

        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full ${streamState.video ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'} text-white transition-colors`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {streamState.video ? <VideoOnIcon /> : <VideoOffIcon />}
          </svg>
        </button>

        <button
          onClick={onShareScreen}
          className={`p-3 rounded-full ${isScreenSharing ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <ScreenShareIcon />
          </svg>
        </button>

        <button
          onClick={onRecord}
          className={`p-3 rounded-full ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isRecording ? <RecordingIcon /> : <RecordIcon />}
          </svg>
        </button>
      </div>

      {isLoading && <div className="absolute inset-0 flex justify-center items-center bg-gray-900 bg-opacity-75 text-white">Loading...</div>}
      {error && <div className="absolute inset-0 flex justify-center items-center bg-red-500 text-white">{error}</div>}
      
      {/* Recording status indicator */}
      {isRecording && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center">
          <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
          Recording
        </div>
      )}
    </div>
  );
}