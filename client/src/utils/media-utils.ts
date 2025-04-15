/**
 * Utility functions for handling media devices and browser compatibility
 */

/**
 * Checks if the browser supports required media APIs
 */
export const checkMediaSupport = () => {
  const supports = {
    video: !!navigator.mediaDevices?.getUserMedia,
    screen: !!navigator.mediaDevices?.getDisplayMedia,
    recorder: typeof MediaRecorder !== 'undefined',
  };
  
  return {
    ...supports,
    isFullySupported: supports.video && supports.screen && supports.recorder,
  };
};

/**
 * Gets available media devices by type
 * @param kind - The kind of device to get ('videoinput', 'audioinput', 'audiooutput')
 */
export const getMediaDevices = async (kind: MediaDeviceKind) => {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === kind);
  } catch (error) {
    console.error(`Error fetching ${kind} devices:`, error);
    return [];
  }
};

/**
 * Combines multiple MediaStreams into one
 */
export const combineStreams = (...streams: MediaStream[]) => {
  const tracks: MediaStreamTrack[] = [];
  
  streams.forEach(stream => {
    if (stream) {
      stream.getTracks().forEach(track => tracks.push(track));
    }
  });
  
  return new MediaStream(tracks);
};
