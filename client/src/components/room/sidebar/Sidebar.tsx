import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message, Participant, buttonTransition, springTransition, defaultTransition } from '../types';
import { Chat } from './Chat';
import { ParticipantsList } from './ParticipantsList';
import { CommentIcon, UsersIcon } from '../../icons';

interface SidebarProps {
  sidebarVisible: boolean;
  activeTab: 'chat' | 'participants';
  setActiveTab: (tab: 'chat' | 'participants') => void;
  messages: Message[];
  participants: Participant[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarVisible,
  activeTab,
  setActiveTab,
  messages,
  participants
}) => {
  return (
    <AnimatePresence mode="sync">
      {sidebarVisible && (
        <motion.div
          className="w-150 h-full bg-gray-800 border-l border-gray-700 flex flex-col overflow-hidden"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={defaultTransition}
        >
          <div className="flex border-b border-gray-700">
            <motion.button
              onClick={() => setActiveTab('chat')}
              className={`relative flex-1 py-3 flex items-center justify-center space-x-2 ${activeTab === 'chat' ? 'text-indigo-400' : 'text-gray-300'}`}
              whileHover={{ backgroundColor: "rgba(99, 102, 241, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              transition={buttonTransition}
            >
              <CommentIcon />
              <span>Chat</span>
              {activeTab === 'chat' && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                  layoutId="activeTab"
                  transition={springTransition}
                />
              )}
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('participants')}
              className={`relative flex-1 py-3 flex items-center justify-center space-x-2 ${activeTab === 'participants' ? 'text-indigo-400' : 'text-gray-300'}`}
              whileHover={{ backgroundColor: "rgba(99, 102, 241, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              transition={buttonTransition}
            >
              <UsersIcon />
              <span>People ({participants.length})</span>
              {activeTab === 'participants' && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                  layoutId="activeTab"
                  transition={springTransition}
                />
              )}
            </motion.button>
          </div>

          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              {activeTab === 'chat' ? (
                <Chat messages={messages} />
              ) : (
                <ParticipantsList participants={participants} />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
