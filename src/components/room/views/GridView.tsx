import React from "react";
import VideoTile from "../VideoTile";

interface RemotePeer {
  id: string;
  stream: MediaStream | null;
  name?: string;
}

interface GridViewProps {
  localStream: MediaStream | null;
  remotePeers: RemotePeer[];
  isConnected: boolean;
  onSelectSpotlight?: (peerId?: string) => void;
  spotlightPeerId?: string;
}

export default function GridView({ 
  localStream, 
  remotePeers, 
  isConnected,
  onSelectSpotlight,
  spotlightPeerId
}: GridViewProps) {
  const totalPeers = remotePeers.length + 1; // +1 for local stream
  
  // Determine grid layout based on number of participants
  const getGridClass = () => {
    if (totalPeers <= 1) return "grid-cols-1";
    if (totalPeers === 2) return "grid-cols-1 md:grid-cols-2";
    if (totalPeers <= 4) return "grid-cols-1 sm:grid-cols-2";
    if (totalPeers <= 6) return "grid-cols-2 md:grid-cols-3";
    if (totalPeers <= 9) return "grid-cols-2 md:grid-cols-3";
    return "grid-cols-3 md:grid-cols-4";
  };

  // Calculate tile sizes for responsive layout
  const getTileSize = () => {
    if (totalPeers <= 1) return "h-full";
    if (totalPeers <= 4) return "h-[calc(50%-0.5rem)]";
    if (totalPeers <= 9) return "h-[calc(33.333%-0.67rem)]";
    return "h-[calc(25%-0.75rem)]";
  };

  const handleTileClick = (peerId?: string) => {
    if (onSelectSpotlight) {
      onSelectSpotlight(peerId);
    }
  };

  return (
    <div className="w-full h-full p-2 sm:p-4">
      <div className={`h-full grid ${getGridClass()} gap-3 md:gap-4`}>
        {/* Local video */}
        <VideoTile 
          stream={localStream} 
          isLocal={true} 
          isConnected={isConnected}
          className={getTileSize()}
          onClick={() => handleTileClick(undefined)}
          isSpotlighted={spotlightPeerId === undefined && !!onSelectSpotlight}
        />

        {/* Remote videos */}
        {remotePeers.map((peer) => (
          <VideoTile
            key={peer.id}
            stream={peer.stream}
            userName={peer.name || "Remote User"}
            className={getTileSize()}
            onClick={() => handleTileClick(peer.id)}
            isSpotlighted={spotlightPeerId === peer.id}
          />
        ))}
      </div>
    </div>
  );
}
