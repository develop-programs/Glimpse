import { atom, useSetAtom } from "jotai";

const streamAtom = atom({
  isVideo: false,
  isAudio: false,
  isScreenShare: false,
  isScreenShareAudio: false,
});

// Export the atom so it can be used in other components
export { streamAtom };

export function useToggleStreamAudio() {
  const setStream = useSetAtom(streamAtom);
  
  return () => {
    setStream((prev) => ({
      ...prev,
      isAudio: !prev.isAudio,
    }));
  };
}

// Additional toggle functions for other stream properties
export function useToggleStreamVideo() {
  const setStream = useSetAtom(streamAtom);
  
  return () => {
    setStream((prev) => ({
      ...prev,
      isVideo: !prev.isVideo,
    }));
  };
}

export function useToggleScreenShare() {
  const setStream = useSetAtom(streamAtom);
  
  return () => {
    setStream((prev) => ({
      ...prev,
      isScreenShare: !prev.isScreenShare,
    }));
  };
}

export function useToggleScreenShareAudio() {
  const setStream = useSetAtom(streamAtom);
  
  return () => {
    setStream((prev) => ({
      ...prev,
      isScreenShareAudio: !prev.isScreenShareAudio,
    }));
  };
}
