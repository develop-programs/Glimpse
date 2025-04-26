import React from 'react';
import { motion } from 'framer-motion';
import { ViewType, buttonTransition } from './types';
import { GridViewIcon, SpeakerViewIcon, PresentationViewIcon } from '../icons';

interface ViewSelectorProps {
  viewType: ViewType;
  setViewType: (type: ViewType) => void;
}

export const ViewSelector: React.FC<ViewSelectorProps> = ({ viewType, setViewType }) => {
  return (
    <div className="flex bg-gray-800 p-1 rounded-lg">
      <motion.button
        onClick={() => setViewType('gallery')}
        className={`flex items-center space-x-1 px-3 py-1 rounded-md ${viewType === 'gallery' ? 'bg-indigo-600 text-white' : 'text-gray-300'}`}
        whileHover={viewType !== 'gallery' ? { backgroundColor: "rgba(99, 102, 241, 0.1)" } : {}}
        whileTap={{ scale: 0.97 }}
        transition={buttonTransition}
      >
        <GridViewIcon />
        <span className="text-sm">Gallery</span>
      </motion.button>
      <motion.button
        onClick={() => setViewType('speaker')}
        className={`flex items-center space-x-1 px-3 py-1 rounded-md ${viewType === 'speaker' ? 'bg-indigo-600 text-white' : 'text-gray-300'}`}
        whileHover={viewType !== 'speaker' ? { backgroundColor: "rgba(99, 102, 241, 0.1)" } : {}}
        whileTap={{ scale: 0.97 }}
        transition={buttonTransition}
      >
        <SpeakerViewIcon />
        <span className="text-sm">Speaker</span>
      </motion.button>
      <motion.button
        onClick={() => setViewType('presentation')}
        className={`flex items-center space-x-1 px-3 py-1 rounded-md ${viewType === 'presentation' ? 'bg-indigo-600 text-white' : 'text-gray-300'}`}
        whileHover={viewType !== 'presentation' ? { backgroundColor: "rgba(99, 102, 241, 0.1)" } : {}}
        whileTap={{ scale: 0.97 }}
        transition={buttonTransition}
      >
        <PresentationViewIcon />
        <span className="text-sm">Presentation</span>
      </motion.button>
    </div>
  );
};
