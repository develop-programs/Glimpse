import VideoTile from "../VideoTile";
import Chat from "../Chat";
import { useAtom } from 'jotai';
import { chatAtom } from '@/data/room';

interface RemotePeer {
    id: string;
    stream: MediaStream | null;
    name?: string;
}

interface SidebarViewProps {
    localStream: MediaStream | null;
    remotePeers: RemotePeer[];
    isConnected: boolean;
    primaryPeerId?: string; // ID of the peer to feature in main view
    onChangePrimary?: (peerId?: string) => void;
    roomId: string; // Added roomId prop
}

export default function SidebarView({
    localStream,
    remotePeers,
    isConnected,
    primaryPeerId,
    onChangePrimary,
    roomId
}: SidebarViewProps) {
    const [isChatOpen, setIsChatOpen] = useAtom(chatAtom);
    
    const getPrimaryPeer = () => {
        if (primaryPeerId) {
            const found = remotePeers.find(p => p.id === primaryPeerId);
            if (found) return found;
        }

        return null;
    };

    const primaryPeer = getPrimaryPeer();
    const isLocalPrimary = !primaryPeer;

    // All peers for the sidebar
    const sidebarPeers = isLocalPrimary
        ? remotePeers
        : remotePeers.filter(p => p.id !== primaryPeer.id);

    const handleTileClick = (peerId?: string) => {
        if (onChangePrimary) {
            onChangePrimary(peerId);
        }
    };

    return (
        <div className="h-full flex flex-col md:flex-row p-2 sm:p-4 gap-4">
            {/* Main content area (70% width on larger screens, full width on mobile) */}
            <div className="md:w-[70%] h-[60%] md:h-full rounded-xl overflow-hidden shadow-xl">
                {isLocalPrimary ? (
                    <VideoTile
                        stream={localStream}
                        isLocal={true}
                        isConnected={isConnected}
                        className="h-full"
                        isSpotlighted={true}
                    />
                ) : (
                    <VideoTile
                        stream={primaryPeer.stream}
                        userName={primaryPeer.name || "Remote User"}
                        className="h-full"
                        isSpotlighted={true}
                    />
                )}
            </div>

            {/* Sidebar with other participants and chat (30% width on larger screens) */}
            <div className="md:w-[30%] h-[40%] md:h-full flex flex-col">
                {/* Toggle button for chat/participants */}
                <div className="px-3 py-2 flex justify-between items-center bg-gray-800 border-b border-gray-700">
                    <h3 className="text-white font-medium">
                        {isChatOpen ? 'Chat' : 'Participants'}
                    </h3>
                    <button 
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded transition-colors"
                    >
                        Switch to {isChatOpen ? 'Participants' : 'Chat'}
                    </button>
                </div>
                
                {/* Chat panel when open */}
                {isChatOpen && (
                    <Chat 
                        roomId={roomId}
                        isOpen={isChatOpen}
                        onClose={() => setIsChatOpen(false)}
                    />
                )}
                
                {/* Participants only shown when chat is closed */}                    
                {!isChatOpen && (
                    <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:overflow-x-hidden h-full p-2">
                        {!isLocalPrimary && (
                            <VideoTile
                                stream={localStream}
                                isLocal={true}
                                isConnected={isConnected}
                                className="flex-none w-[180px] h-full md:w-full md:h-[200px] rounded-lg"
                                onClick={() => handleTileClick(undefined)}
                            />
                        )}

                        {sidebarPeers.map((peer) => (
                            <VideoTile
                                key={peer.id}
                                stream={peer.stream}
                                userName={peer.name || "Remote User"}
                                className="flex-none w-[180px] h-full md:w-full md:h-[200px] rounded-lg"
                                onClick={() => handleTileClick(peer.id)}
                            />
                        ))}

                        {/* Empty state when no other participants */}
                        {sidebarPeers.length === 0 && isLocalPrimary && (
                            <div className="flex-none w-full h-full md:h-[200px] rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 border border-gray-700 border-dashed">
                                <div className="text-center p-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 opacity-50" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    <p>Waiting for others to join</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Scroll indicator for mobile */}
            {sidebarPeers.length > 1 && (
                <div className="md:hidden text-center text-white/60 text-xs">
                    <span>← Swipe for more participants →</span>
                </div>
            )}
        </div>
    );
}
