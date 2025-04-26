import React from 'react';
import { motion } from 'framer-motion';
import { buttonTransition } from './types';
import {
  MicrophoneIcon,
  MicrophoneSlashIcon,
  VideoIcon,
  VideoSlashIcon,
  DesktopIcon,
  CommentIcon,
  UsersIcon,
  PhoneSlashIcon
} from '../icons';

interface ControlBarProps {
  isMicOn: boolean;
  isCameraOn: boolean;
  setIsMicOn: (value: boolean) => void;
  setIsCameraOn: (value: boolean) => void;
  toggleSidebar: (tab: 'chat' | 'participants') => void;
  activeTab: 'chat' | 'participants';
  sidebarVisible: boolean;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  isMicOn,
  isCameraOn,
  setIsMicOn,
  setIsCameraOn,
  toggleSidebar,
  activeTab,
  sidebarVisible
}) => {
  return (
    <motion.div
      aria-label="controls"
      className="h-24 bg-gray-900 border-t border-gray-800 grid place-content-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className='flex items-center justify-center space-x-4'>
        <motion.button
          onClick={() => setIsMicOn(!isMicOn)}
          className={`p-4 rounded-full ${isMicOn ? 'bg-gray-800 text-white' : 'bg-red-600 text-white'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={buttonTransition}
        >
          {isMicOn ? <MicrophoneIcon /> : <MicrophoneSlashIcon />}
        </motion.button>

        <motion.button
          onClick={() => setIsCameraOn(!isCameraOn)}
          className={`p-4 rounded-full ${isCameraOn ? 'bg-gray-800 text-white' : 'bg-red-600 text-white'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={buttonTransition}
        >
          {isCameraOn ? <VideoIcon /> : <VideoSlashIcon />}
        </motion.button>

        <motion.button
          className="p-4 rounded-full bg-gray-800 text-white"
          whileHover={{ scale: 1.05, backgroundColor: "#1f2937" }}
          whileTap={{ scale: 0.95 }}
          transition={buttonTransition}
        >
          <DesktopIcon />
        </motion.button>

        <motion.button
          onClick={() => toggleSidebar('chat')}
          className={`p-4 rounded-full ${sidebarVisible && activeTab === 'chat' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-white'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={buttonTransition}
        >
          <CommentIcon />
        </motion.button>

        <motion.button
          onClick={() => toggleSidebar('participants')}
          className={`p-4 rounded-full ${sidebarVisible && activeTab === 'participants' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-white'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={buttonTransition}
        >
          <UsersIcon />
        </motion.button>

        <motion.button
          className="p-4 rounded-full bg-red-600 text-white"
          whileHover={{ scale: 1.05, backgroundColor: "#dc2626" }}
          whileTap={{ scale: 0.95 }}
          transition={buttonTransition}
        >
          <PhoneSlashIcon />
        </motion.button>
      </div>
    </motion.div>
  );
};
