import React from 'react';
import { motion } from 'framer-motion';
import { Participant } from '../types';
import { ParticipantTile } from '../ParticipantTile';

interface SpeakerViewProps {
    speaker: Participant;
    participants: Participant[];
    isCameraOn: boolean;
}

export const SpeakerView: React.FC<SpeakerViewProps> = ({
    speaker,
    participants,
    isCameraOn
}) => {
    return (
        <motion.div
            key="speaker-view"
            className="flex flex-col h-full gap-3 scroll-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            <div className="flex-1 h-full">
                <ParticipantTile participant={speaker} isCameraOn={isCameraOn} size="large" />
            </div>
            <div className="h-28 overflow-hidden">
                {/* Horizontal scrollable container for participants */}
                <div className="flex space-x-2 overflow-x-auto pb-2 h-full snap-x snap-mandatory">
                    {participants
                        .filter(p => p.id !== speaker.id)
                        .map((participant) => (
                            <div
                                key={participant.id}
                                className="flex-shrink-0 w-36 h-full snap-start"
                            >
                                <ParticipantTile participant={participant} isCameraOn={isCameraOn} />
                            </div>
                        ))}
                </div>
            </div>

            {/* Indicator for scrolling */}
            <div className="flex justify-center space-x-1 mt-1">
                <div className="text-xs text-gray-400">
                    Scroll for more participants →
                </div>
            </div>
        </motion.div>
    );
};
