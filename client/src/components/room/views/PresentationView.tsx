import React from 'react';
import { motion } from 'framer-motion';
import { Participant } from '../types';
import { ParticipantTile } from '../ParticipantTile';

interface PresentationViewProps {
  presenter: Participant;
  participants: Participant[];
  isCameraOn: boolean;
}

export const PresentationView: React.FC<PresentationViewProps> = ({ 
  presenter, 
  participants, 
  isCameraOn 
}) => {
  return (
    <motion.div
      key="presentation-view"
      className="flex h-full gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex-1">
        <div className="h-full bg-black rounded-lg border border-gray-700 flex items-center justify-center">
          <div className="text-gray-400 text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="mx-auto mb-4" viewBox="0 0 16 16">
              <path d="M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3zm2-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z" />
              <path d="M5.5 4a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 .5-.5zm4.5.5a.5.5 0 0 1 1 0v1a.5.5 0 0 1-1 0v-1zm4 3a.5.5 0 0 1 0 1h-1a.5.5 0 0 1 0-1h1zm-5 0a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1h5zm-5 3a.5.5 0 0 1 0 1h1a.5.5 0 0 1 0-1h-1zm4 0a.5.5 0 0 1 0 1h1a.5.5 0 0 1 0-1h-1z" />
            </svg>
            <p className="text-xl">Screen Sharing</p>
            <p className="mt-2">Waiting for <span className="font-semibold">{presenter.name}</span> to share their screen</p>
          </div>
        </div>
      </div>

      <div className="w-64 flex flex-col">
        {/* Presenter */}
        <div className="h-40 mb-3">
          <ParticipantTile participant={presenter} isCameraOn={isCameraOn} />
        </div>

        {/* Scrollable list of other participants */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {participants
            .filter(p => p.id !== presenter.id)
            .slice(0, 20) // Show first 20 for better performance
            .map(participant => (
              <div key={participant.id} className="h-24">
                <ParticipantTile participant={participant} isCameraOn={isCameraOn} />
              </div>
            ))}

          {participants.length > 21 && (
            <div className="text-center p-2 text-gray-400 text-xs">
              + {participants.length - 21} more participants
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
