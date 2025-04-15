import { atom, useAtom } from "jotai";

interface StreamAtom {
  isVideoActive: boolean;
  isAudioActive: boolean;
  isScreenSharing: boolean;
  isRecording: boolean;
}

export const streamAtom = atom<StreamAtom>({
  isVideoActive: false,
  isAudioActive: false,
  isScreenSharing: false,
  isRecording: false,
});

// Store references to active streams
interface StreamRefs {
  videoStream: MediaStream | null;
  audioStream: MediaStream | null;
  screenStream: MediaStream | null;
  mediaRecorder: MediaRecorder | null;
  recordedChunks: Blob[];
}

const streamRefs: StreamRefs = {
  videoStream: null,
  audioStream: null,
  screenStream: null,
  mediaRecorder: null,
  recordedChunks: [],
};

export const useStreamControls = () => {
  const [streamState, setStreamState] = useAtom(streamAtom);

  // Toggle video
  const toggleVideo = async () => {
    try {
      if (!streamState.isVideoActive) {
        // Start video
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        streamRefs.videoStream = stream;
        setStreamState((prev) => ({ ...prev, isVideoActive: true }));
        return stream;
      } else {
        // Stop video
        if (streamRefs.videoStream) {
          streamRefs.videoStream.getTracks().forEach((track) => track.stop());
          streamRefs.videoStream = null;
        }
        setStreamState((prev) => ({ ...prev, isVideoActive: false }));
        return null;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      return null;
    }
  };

  // Toggle audio
  const toggleAudio = async () => {
    try {
      if (!streamState.isAudioActive) {
        // Start audio
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        streamRefs.audioStream = stream;
        setStreamState((prev) => ({ ...prev, isAudioActive: true }));
        return stream;
      } else {
        // Stop audio
        if (streamRefs.audioStream) {
          streamRefs.audioStream.getTracks().forEach((track) => track.stop());
          streamRefs.audioStream = null;
        }
        setStreamState((prev) => ({ ...prev, isAudioActive: false }));
        return null;
      }
    } catch (error) {
      console.error("Error accessing microphone:", error);
      return null;
    }
  };

  // Toggle screen sharing
  const toggleScreenShare = async () => {
    try {
      if (!streamState.isScreenSharing) {
        // Start screen sharing
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        
        // Add event listener for when user stops sharing via browser controls
        stream.getVideoTracks()[0].addEventListener('ended', () => {
          setStreamState((prev) => ({ ...prev, isScreenSharing: false }));
          streamRefs.screenStream = null;
        });
        
        streamRefs.screenStream = stream;
        setStreamState((prev) => ({ ...prev, isScreenSharing: true }));
        return stream;
      } else {
        // Stop screen sharing
        if (streamRefs.screenStream) {
          streamRefs.screenStream.getTracks().forEach((track) => track.stop());
          streamRefs.screenStream = null;
        }
        setStreamState((prev) => ({ ...prev, isScreenSharing: false }));
        return null;
      }
    } catch (error) {
      console.error("Error sharing screen:", error);
      return null;
    }
  };

  // Toggle recording
  const toggleRecording = () => {
    if (!streamState.isRecording) {
      // Start recording
      try {
        // Create a combined stream from all active sources
        const tracks: MediaStreamTrack[] = [];
        
        if (streamRefs.videoStream) {
          streamRefs.videoStream.getTracks().forEach(track => tracks.push(track));
        }
        
        if (streamRefs.audioStream) {
          streamRefs.audioStream.getTracks().forEach(track => tracks.push(track));
        }
        
        if (streamRefs.screenStream) {
          streamRefs.screenStream.getTracks().forEach(track => tracks.push(track));
        }
        
        if (tracks.length === 0) {
          throw new Error("No active streams to record");
        }
        
        const combinedStream = new MediaStream(tracks);
        
        streamRefs.recordedChunks = [];
        const mediaRecorder = new MediaRecorder(combinedStream);
        
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            streamRefs.recordedChunks.push(e.data);
          }
        };
        
        mediaRecorder.onstop = () => {
          // Create download link when recording stops
          if (streamRefs.recordedChunks.length) {
            const blob = new Blob(streamRefs.recordedChunks, {
              type: "video/webm"
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `recording_${new Date().toISOString()}.webm`;
            a.click();
            URL.revokeObjectURL(url);
          }
        };
        
        mediaRecorder.start();
        streamRefs.mediaRecorder = mediaRecorder;
        setStreamState((prev) => ({ ...prev, isRecording: true }));
      } catch (error) {
        console.error("Error starting recording:", error);
      }
    } else {
      // Stop recording
      if (streamRefs.mediaRecorder && streamRefs.mediaRecorder.state !== "inactive") {
        streamRefs.mediaRecorder.stop();
        streamRefs.mediaRecorder = null;
      }
      setStreamState((prev) => ({ ...prev, isRecording: false }));
    }
  };

  // Get current streams for external use
  const getStreams = () => ({
    videoStream: streamRefs.videoStream,
    audioStream: streamRefs.audioStream,
    screenStream: streamRefs.screenStream,
  });

  return {
    streamState,
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    toggleRecording,
    getStreams,
  };
};
