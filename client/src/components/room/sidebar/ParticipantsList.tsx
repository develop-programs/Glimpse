import React from 'react';
import { motion } from 'framer-motion';
import { Participant, buttonTransition } from '../types';

interface ParticipantsListProps {
  participants: Participant[];
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({ participants }) => {
  return (
    <motion.div
      key="participants"
      className="p-4 space-y-2 h-full overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      {participants.map((participant, index) => (
        <motion.div
          key={participant.id}
          className="flex items-center justify-between p-2 hover:bg-gray-700 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15, delay: index * 0.05 }}
          whileHover={{ backgroundColor: "rgba(99, 102, 241, 0.1)" }}
        >
          <div className="flex items-center space-x-3">
            <motion.div
              className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white"
              whileHover={{ scale: 1.05 }}
              transition={buttonTransition}
            >
              {participant.name.charAt(0)}
            </motion.div>
            <span className="text-white">{participant.name} {participant.isCurrentUser && '(You)'}</span>
          </div>
          {participant.isCurrentUser ? (
            <span className="text-xs bg-indigo-900 text-indigo-200 py-1 px-2 rounded">Host</span>
          ) : (
            <motion.button
              className="text-gray-400 hover:text-red-400"
              whileHover={{ scale: 1.1, color: "#f87171" }}
              whileTap={{ scale: 0.95 }}
              transition={buttonTransition}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
              </svg>
            </motion.button>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};
