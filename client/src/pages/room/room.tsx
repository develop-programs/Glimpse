import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import types and helpers
import { ViewType, Message, defaultTransition } from '@/components/room/types';

// Import components
import { ViewSelector } from '@/components/room/ViewSelector';
import { GalleryView } from '@/components/room/views/GalleryView';
import { SpeakerView } from '@/components/room/views/SpeakerView';
import { PresentationView } from '@/components/room/views/PresentationView';
import { Sidebar } from '@/components/room/sidebar/Sidebar';
import { ControlBar } from '@/components/room/ControlBar';

// Import services
import { generateMockParticipants, getPresenter, getSpeaker } from '@/components/room/ParticipantService';

export default function Room() {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'participants'>('chat');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [viewType, setViewType] = useState<ViewType>('gallery');

  const toggleSidebar = (tab: 'chat' | 'participants') => {
    if (sidebarVisible && activeTab === tab) {
      setSidebarVisible(false);
    } else {
      setSidebarVisible(true);
      setActiveTab(tab);
    }
  };

  const messages: Message[] = [
    { id: 1, sender: 'John Doe', text: 'Hello everyone!', time: '10:01' },
    { id: 2, sender: 'You', text: 'Hi John, how are you?', time: '10:02' },
    { id: 3, sender: 'Jane Smith', text: 'Good morning team!', time: '10:03' },
  ];

  // Generate 100 participants for demo purposes
  const allParticipants = generateMockParticipants(100);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [participantsPerPage, setParticipantsPerPage] = useState(12);

  // Compute current displayed participants
  const indexOfLastParticipant = currentPage * participantsPerPage;
  const indexOfFirstParticipant = indexOfLastParticipant - participantsPerPage;
  const currentParticipants = allParticipants.slice(indexOfFirstParticipant, indexOfLastParticipant);
  const totalPages = Math.ceil(allParticipants.length / participantsPerPage);

  // Function to change page
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="h-screen w-screen max-h-screen max-w-screen flex flex-col bg-gray-950 overflow-hidden">
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex justify-between items-center">
        <div className="text-white text-sm">
          <span className="font-semibold">Meeting Room</span>
          <span className="mx-2">•</span>
          <span>{allParticipants.length} participants</span>
        </div>

        <ViewSelector viewType={viewType} setViewType={setViewType} />

        {/* Participants per page selector */}
        <div className="flex items-center">
          <label className="text-gray-300 text-xs mr-2">Display:</label>
          <select
            value={participantsPerPage}
            onChange={(e) => {
              setParticipantsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when changing items per page
            }}
            className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value={12}>12</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={42}>42</option>
          </select>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <motion.div
          className={`${sidebarVisible ? 'flex-1' : 'w-full'} h-full bg-gray-900 p-3 overflow-hidden relative`}
          layout="position"
          layoutDependency={sidebarVisible}
          transition={defaultTransition}
        >
          <AnimatePresence mode="wait">
            {viewType === 'gallery' && (
              <GalleryView
                participants={currentParticipants}
                isCameraOn={isCameraOn}
                currentPage={currentPage}
                totalPages={totalPages}
                paginate={paginate}
              />
            )}

            {viewType === 'speaker' && (
              <SpeakerView
                speaker={getSpeaker(allParticipants)}
                participants={allParticipants}
                isCameraOn={isCameraOn}
              />
            )}

            {viewType === 'presentation' && (
              <PresentationView
                presenter={getPresenter(allParticipants)}
                participants={allParticipants}
                isCameraOn={isCameraOn}
              />
            )}
          </AnimatePresence>
        </motion.div>

        <Sidebar
          sidebarVisible={sidebarVisible}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          messages={messages}
          participants={allParticipants}
        />
      </div>

      <ControlBar
        isMicOn={isMicOn}
        isCameraOn={isCameraOn}
        setIsMicOn={setIsMicOn}
        setIsCameraOn={setIsCameraOn}
        toggleSidebar={toggleSidebar}
        activeTab={activeTab}
        sidebarVisible={sidebarVisible}
      />
    </div>
  );
}
