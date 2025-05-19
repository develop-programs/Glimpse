import React from "react";
import VideoTile from "../VideoTile";

interface RemotePeer {
    id: string;
    stream: MediaStream | null;
    name?: string;
}

interface SpotlightViewProps {
    localStream: MediaStream | null;
    remotePeers: RemotePeer[];
    isConnected: boolean;
    spotlightPeerId?: string; // ID of the peer to spotlight
    onChangeSpotlight?: (peerId?: string) => void;
}

export default function SpotlightView({
    localStream,
    remotePeers,
    isConnected,
    spotlightPeerId,
    onChangeSpotlight
}: SpotlightViewProps) {
    // By default, if no spotlight is set or spotlight peer isn't found, use the first remote peer
    // If no remote peers, use local user
    const getSpotlightPeer = () => {
        if (spotlightPeerId) {
            const found = remotePeers.find(p => p.id === spotlightPeerId);
            if (found) return found;
        }

        return remotePeers.length > 0 ? remotePeers[0] : null;
    };

    const spotlightPeer = getSpotlightPeer();
    const isLocalSpotlight = !spotlightPeer;

    // Filtered list excluding the spotlight peer
    const otherPeers = spotlightPeer
        ? remotePeers.filter(p => p.id !== spotlightPeer.id)
        : remotePeers;

    const handleTileClick = (peerId?: string) => {
        if (onChangeSpotlight) {
            onChangeSpotlight(peerId);
        }
    };

    return (
        <div className="h-full flex flex-col gap-4 p-2 sm:p-4">
            {/* Spotlight video */}
            <div className="flex-grow rounded-xl overflow-hidden shadow-2xl transition-all duration-500 ease-in-out">
                {isLocalSpotlight ? (
                    <VideoTile
                        stream={localStream}
                        isLocal={true}
                        isConnected={isConnected}
                        className="h-full"
                        isSpotlighted={true}
                    />
                ) : (
                    <VideoTile
                        stream={spotlightPeer.stream}
                        userName={spotlightPeer.name || "Remote User"}
                        className="h-full"
                        isSpotlighted={true}
                    />
                )}
            </div>

            {/* Bottom row of other participants */}
            <div className="h-[140px] md:h-[160px] flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {!isLocalSpotlight && (
                    <VideoTile
                        stream={localStream}
                        isLocal={true}
                        isConnected={isConnected}
                        className="flex-none w-[200px] md:w-[250px] h-full rounded-lg"
                        onClick={() => handleTileClick(undefined)}
                    />
                )}

                {otherPeers.map((peer) => (
                    <VideoTile
                        key={peer.id}
                        stream={peer.stream}
                        userName={peer.name || "Remote User"}
                        className="flex-none w-[200px] md:w-[250px] h-full rounded-lg"
                        onClick={() => handleTileClick(peer.id)}
                    />
                ))}
            </div>

            {/* Horizontal scrolling indicator for smaller screens */}
            {(otherPeers.length > 2 || (!isLocalSpotlight && otherPeers.length > 1)) && (
                <div className="md:hidden text-center text-white/60 text-xs">
                    <span>← Swipe for more participants →</span>
                </div>
            )}
        </div>
    );
}
