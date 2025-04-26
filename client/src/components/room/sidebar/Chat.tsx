import React from 'react';
import { motion } from 'framer-motion';
import { Message, buttonTransition } from '../types';

interface ChatProps {
  messages: Message[];
}

export const Chat: React.FC<ChatProps> = ({ messages }) => {
  return (
    <motion.div
      key="chat"
      className="flex flex-col h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <motion.div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: index * 0.05 }}
          >
            <div
              className={`rounded-lg px-3 py-2 max-w-[80%] ${msg.sender === 'You'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-700 text-white'
                }`}
            >
              {msg.text}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {msg.sender !== 'You' && `${msg.sender} • `}{msg.time}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-3 border-t border-gray-700">
        <div className="flex">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border border-gray-600 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white"
          />
          <motion.button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-r-lg"
            whileHover={{ backgroundColor: "#4f46e5" }}
            whileTap={{ scale: 0.97 }}
            transition={buttonTransition}
          >
            Send
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
