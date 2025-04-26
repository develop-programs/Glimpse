import React from 'react';
import { motion } from 'framer-motion';
import { Participant, defaultTransition, springTransition } from './types';

interface ParticipantTileProps {
    participant: Participant;
    isCameraOn: boolean;
    size?: 'small' | 'large';
}

export const ParticipantTile: React.FC<ParticipantTileProps> = ({
    participant,
    isCameraOn,
    size = 'small'
}) => {
    return (
        <motion.div
            key={participant.id}
            className={`relative rounded-lg h-full overflow-hidden ${participant.isCurrentUser ? 'border-2 border-indigo-500' : ''}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={defaultTransition}
            whileHover={{ boxShadow: "0px 0px 8px rgba(99, 102, 241, 0.5)" }}
        >
            <div className="bg-gray-800 h-full w-full flex items-center justify-center">
                {!isCameraOn && participant.isCurrentUser ? (
                    <motion.div
                        className={`${size === 'large' ? 'w-24 h-24' : 'w-20 h-20'} rounded-full bg-gray-700 flex items-center justify-center text-xl text-white`}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={springTransition}
                    >
                        {participant.name.charAt(0)}
                    </motion.div>
                ) : (
                    <div className="h-full w-full bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center">
                        <div className={`${size === 'large' ? 'w-24 h-24' : 'w-16 h-16'} rounded-full bg-gray-700 flex items-center justify-center text-xl text-white`}>
                            {participant.name.charAt(0)}
                        </div>
                    </div>
                )}
            </div>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 px-2 py-1 rounded-md text-white text-sm backdrop-blur-sm">
                {participant.name} {participant.isCurrentUser && '(You)'}
            </div>
        </motion.div>
    );
};
