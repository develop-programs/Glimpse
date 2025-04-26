import React from 'react';
import { motion } from 'framer-motion';
import { Participant } from '../types';
import { ParticipantTile } from '../ParticipantTile';

interface GalleryViewProps {
  participants: Participant[];
  isCameraOn: boolean;
  currentPage: number;
  totalPages: number;
  paginate: (page: number) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ 
  participants, 
  isCameraOn, 
  currentPage, 
  totalPages, 
  paginate 
}) => {
  // Function to automatically adjust grid size based on participant count
  const getGridColumns = () => {
    const count = participants.length;
    if (count <= 4) return 'grid-cols-2';
    if (count <= 9) return 'grid-cols-3';
    if (count <= 16) return 'grid-cols-4';
    return 'grid-cols-4'; // Max 4 columns
  };

  return (
    <motion.div
      key="gallery-view"
      className={`${getGridColumns()} gap-3 h-full grid overflow-hidden`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {participants.map((participant) => (
        <ParticipantTile 
          key={participant.id}
          participant={participant} 
          isCameraOn={isCameraOn} 
        />
      ))}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center space-x-2">
          <motion.button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-1 rounded-full ${currentPage === 1 ? 'bg-gray-700 text-gray-400' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
            whileHover={currentPage !== 1 ? { scale: 1.1 } : undefined}
            whileTap={currentPage !== 1 ? { scale: 0.95 } : undefined}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
            </svg>
          </motion.button>

          <div className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-md">
            Page {currentPage} of {totalPages}
          </div>

          <motion.button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-1 rounded-full ${currentPage === totalPages ? 'bg-gray-700 text-gray-400' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
            whileHover={currentPage !== totalPages ? { scale: 1.1 } : undefined}
            whileTap={currentPage !== totalPages ? { scale: 0.95 } : undefined}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};
