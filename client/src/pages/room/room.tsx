import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Room() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [participants] = useState([
    { id: 1, name: 'You' },
    { id: 2, name: 'Alex Johnson' },
    { id: 3, name: 'Sarah Miller' },
    { id: 4, name: 'David Chen' },
  ]);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const audioAnalyser = useRef<AnalyserNode | null>(null);
  const audioData = useRef<Uint8Array | null>(null);
  const animationFrame = useRef<number | null>(null);

  useEffect(() => {
    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;

          audioContext.current = new AudioContext();
          audioAnalyser.current = audioContext.current.createAnalyser();
          const source = audioContext.current.createMediaStreamSource(stream);
          source.connect(audioAnalyser.current);
          audioAnalyser.current.fftSize = 256;
          const bufferLength = audioAnalyser.current.frequencyBinCount;
          audioData.current = new Uint8Array(bufferLength);

          detectSpeaking();
        }
      } catch (err) {
        console.error('Error accessing media devices:', err);
      }
    };

    initializeCamera();

    return () => {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }

      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }

      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  const detectSpeaking = () => {
    if (!audioAnalyser.current || !audioData.current) return;

    const checkAudio = () => {
      audioAnalyser.current?.getByteFrequencyData(audioData.current!);

      const audioLevel = audioData.current!.reduce((sum, value) => sum + value, 0) / audioData.current!.length;
      setIsSpeaking(audioLevel > 30 && !isMuted);

      animationFrame.current = requestAnimationFrame(checkAudio);
    };

    checkAudio();
  };

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);

    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !newMuteState;
      });
    }
  };

  const toggleVideo = () => {
    const newVideoState = !isVideoOff;
    setIsVideoOff(newVideoState);

    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !newVideoState;
      });
    }
  };

  const toggleScreenShare = () => setIsScreenSharing(!isScreenSharing);
  const toggleChat = () => {
    setShowChat(!showChat);
    if (!showChat) setShowParticipants(false);
  };
  const toggleParticipants = () => {
    setShowParticipants(!showParticipants);
    if (!showParticipants) setShowChat(false);
  };
  const leaveRoom = () => {
    if (window.confirm('Are you sure you want to leave the meeting?')) {
      alert('You have left the meeting');
    }
  };

  const showControls = () => {
    setIsControlsVisible(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);

    controlsTimeout.current = setTimeout(() => {
      setIsControlsVisible(false);
    }, 3000);
  };

  useEffect(() => {
    window.addEventListener('mousemove', showControls);

    return () => {
      window.removeEventListener('mousemove', showControls);
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    };
  }, []);

  return (
    <div
      className="flex flex-col h-screen bg-[#202124] relative overflow-hidden"
      onMouseMove={showControls}
    >
      <AnimatePresence>
        {isControlsVisible && (
          <motion.header
            className="absolute top-0 left-0 right-0 z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="flex items-center justify-between px-6 py-4">
              <motion.div
                className="flex items-center"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h1 className="text-xl font-medium text-white">Team Meeting</h1>
                <span className="ml-4 text-gray-400 text-sm">•</span>
                <span className="ml-4 text-gray-400 text-sm">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </motion.div>
              <motion.div
                className="flex items-center space-x-4"
                initial={{ x: 20 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <motion.button
                  className="p-2 rounded-full hover:bg-[#3c4043] text-gray-300 transition-all"
                  whileHover={{ scale: 1.1, backgroundColor: '#3c4043' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </motion.button>
                <div className="h-6 border-l border-gray-600"></div>
                <motion.div className="flex items-center bg-[#3c4043] rounded-full px-3 py-1.5" whileHover={{ scale: 1.05 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-300">{participants.length}</span>
                </motion.div>
              </motion.div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      <div className={`flex-1 flex ${showChat || showParticipants ? 'mr-[320px]' : ''} transition-all duration-300`}>
        <div className="w-full p-2 md:p-6 flex items-center justify-center">
          <motion.div
            className="grid gap-2 md:gap-4 h-full w-full"
            style={{
              gridTemplateColumns: `repeat(${Math.min(3, Math.ceil(Math.sqrt(participants.length)))}, 1fr)`,
              gridAutoRows: `calc((100vh - ${participants.length > 4 ? '16rem' : '12rem'})/2)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {participants.map((participant) => (
              <motion.div
                key={participant.id}
                className="relative rounded-xl overflow-hidden bg-[#3c4043] shadow-lg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                layout
                whileHover={{ boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}
              >
                {participant.id === 1 ? (
                  <>
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      playsInline
                      className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
                    />
                    <AnimatePresence>
                      {isSpeaking && !isMuted && (
                        <motion.div
                          className="absolute inset-0 border-4 border-blue-500 rounded-xl pointer-events-none"
                          initial={{ opacity: 0, scale: 1.1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <motion.div
                      className="w-20 h-20 rounded-full bg-[#5f6368] flex items-center justify-center text-2xl text-white uppercase"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {participant.name.charAt(0)}
                    </motion.div>
                  </div>
                )}

                <motion.div
                  className="absolute bottom-4 left-4"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="bg-black bg-opacity-50 px-3 py-1 rounded-md text-white flex items-center space-x-2 text-sm backdrop-blur-sm">
                    {participant.id === 1 && isMuted && (
                      <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-red-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: [0, 15, 0] }}
                        transition={{ duration: 0.3 }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </motion.svg>
                    )}
                    <span>
                      {participant.name}
                      {participant.id === 1 ? ' (You)' : ''}
                    </span>
                  </div>
                </motion.div>

                {participant.id === 1 && isVideoOff && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-[#3c4043]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="w-24 h-24 rounded-full bg-[#5f6368] flex items-center justify-center"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                      }}
                    >
                      <span className="text-3xl text-white uppercase">Y</span>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isControlsVisible && (
          <motion.div
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-[#202124] p-2 rounded-full shadow-lg z-10"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <motion.button
              onClick={toggleMute}
              className={`p-3 rounded-full ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-[#3c4043] hover:bg-[#4a4d51]'
                } transition-colors`}
              title={isMuted ? 'Unmute' : 'Mute'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 18.5a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.5m-4 0h8"></path>
                  <path d="M16 9v.5a4 4 0 01-4 4v0a4 4 0 01-4-4V9" />
                  <line x1="2" y1="2" x2="22" y2="22" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 18.5a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.5m-4 0h8"></path>
                  <path d="M16 9v.5a4 4 0 01-4 4v0a4 4 0 01-4-4V9"></path>
                </svg>
              )}
            </motion.button>

            <motion.button
              onClick={toggleVideo}
              className={`p-3 rounded-full ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-[#3c4043] hover:bg-[#4a4d51]'
                } transition-colors`}
              title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              {isVideoOff ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14"></path>
                  <rect x="3" y="6" width="12" height="12" rx="2"></rect>
                  <line x1="3" y1="3" x2="21" y2="21"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14"></path>
                  <rect x="3" y="6" width="12" height="12" rx="2"></rect>
                </svg>
              )}
            </motion.button>

            <motion.button
              onClick={toggleScreenShare}
              className={`p-3 rounded-full ${isScreenSharing ? 'bg-green-500 hover:bg-green-600' : 'bg-[#3c4043] hover:bg-[#4a4d51]'
                } transition-colors`}
              title={isScreenSharing ? 'Stop presenting' : 'Present now'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="14" rx="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="18" x2="12" y2="21"></line>
              </svg>
            </motion.button>

            <div className="h-10 border-l border-gray-600 mx-2"></div>

            <motion.button
              onClick={toggleChat}
              className={`p-3 rounded-full ${showChat ? 'bg-[#4a4d51]' : 'bg-[#3c4043] hover:bg-[#4a4d51]'
                } transition-colors`}
              title="Chat with everyone"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"></path>
              </svg>
            </motion.button>

            <motion.button
              onClick={toggleParticipants}
              className={`p-3 rounded-full ${showParticipants ? 'bg-[#4a4d51]' : 'bg-[#3c4043] hover:bg-[#4a4d51]'
                } transition-colors`}
              title="Show everyone"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
                <path d="M16 3.13a4 4 0 010 7.75"></path>
              </svg>
            </motion.button>

            <div className="h-10 border-l border-gray-600 mx-2"></div>

            <motion.button
              onClick={leaveRoom}
              className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
              title="Leave call"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7 2 2 0 011.72 2v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.42 19.42 0 01-3.33-2.67m-2.67-3.34a19.79 19.79 0 01-3.07-8.63A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91"></path>
                <line x1="22" y1="2" x2="2" y2="22"></line>
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(showChat || showParticipants) && (
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-[320px] bg-[#2c2d30] z-10 shadow-xl"
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="flex flex-col h-full">
              <motion.div
                className="p-4 border-b border-gray-700 flex justify-between items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-white text-lg font-medium">{showChat ? 'In-call messages' : 'People'}</h2>
                <motion.button
                  onClick={() => (showChat ? setShowChat(false) : setShowParticipants(false))}
                  className="p-1 rounded-full hover:bg-[#3c4043] text-gray-400 hover:text-white transition"
                  whileHover={{ scale: 1.1, backgroundColor: '#3c4043' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </motion.div>

              <div className="flex-1 overflow-y-auto p-4">
                {showChat ? (
                  <motion.div
                    className="flex flex-col justify-center items-center h-full text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.div
                      className="bg-[#3c4043] rounded-full p-6 mb-4"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                        delay: 0.2,
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                    </motion.div>
                    <motion.p
                      className="text-gray-300 text-lg mb-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      No messages yet
                    </motion.p>
                    <motion.p
                      className="text-gray-500 text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      Messages sent to everyone will appear here
                    </motion.p>
                  </motion.div>
                ) : (
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-sm text-gray-400 px-2 py-1">In this meeting ({participants.length})</div>
                    {participants.map((participant, index) => (
                      <motion.div
                        key={participant.id}
                        className="flex items-center justify-between rounded-lg p-2 hover:bg-[#3c4043] transition-colors"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ backgroundColor: '#3c4043' }}
                      >
                        <div className="flex items-center space-x-3">
                          <motion.div
                            className="w-10 h-10 rounded-full bg-[#5f6368] flex items-center justify-center text-white uppercase"
                            whileHover={{ scale: 1.05 }}
                          >
                            {participant.name.charAt(0)}
                          </motion.div>
                          <span className="text-white">
                            {participant.name}
                            {participant.id === 1 ? ' (You)' : ''}
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          {participant.id !== 1 && (
                            <>
                              <motion.button
                                className="p-2 rounded-full hover:bg-[#4a4d51] text-gray-400 hover:text-white transition-colors"
                                whileHover={{ scale: 1.1, backgroundColor: '#4a4d51' }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M12 18.5a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.5m-4 0h8"></path>
                                  <path d="M16 9v.5a4 4 0 01-4 4v0a4 4 0 01-4-4V9"></path>
                                </svg>
                              </motion.button>
                              <motion.button
                                className="p-2 rounded-full hover:bg-[#4a4d51] text-gray-400 hover:text-white transition-colors"
                                whileHover={{ scale: 1.1, backgroundColor: '#4a4d51' }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                                  <path d="M10 10a2 2 0 100-4 2 2 0 000 4z"></path>
                                  <path d="M16 15v-1a3 3 0 00-6 0v1"></path>
                                </svg>
                              </motion.button>
                            </>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>

              {showChat && (
                <motion.div
                  className="p-4 border-t border-gray-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Send a message to everyone"
                      className="w-full bg-[#3c4043] border-none outline-none text-white px-4 py-3 rounded-md placeholder-gray-400 pr-10 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <motion.button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-500 transition-colors"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
