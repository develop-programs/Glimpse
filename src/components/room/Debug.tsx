import React from 'react';

interface DebugProps {
  stream: MediaStream | null;
  remotePeers: { id: string; stream: MediaStream | null; name?: string }[];
  isConnected: boolean;
}

export default function Debug({ stream, remotePeers, isConnected }: DebugProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [networkStatus, setNetworkStatus] = React.useState<string>("Unknown");
  const [testingNetwork, setTestingNetwork] = React.useState(false);

  const testNetworkConnectivity = async () => {
    setTestingNetwork(true);
    setNetworkStatus("Testing...");
    
    try {
      // Test general internet connectivity
      const internetPromise = fetch('https://www.google.com', { 
        mode: 'no-cors',
        cache: 'no-cache',
        method: 'HEAD'
      }).then(() => true).catch(() => false);
      
      // Test WebRTC connectivity
      const pc1 = new RTCPeerConnection();
      const pc2 = new RTCPeerConnection();
      
      let webrtcSuccess = false;
      
      const webrtcPromise = new Promise<boolean>((resolve) => {
        pc1.onicecandidate = e => e.candidate && pc2.addIceCandidate(e.candidate);
        pc2.onicecandidate = e => e.candidate && pc1.addIceCandidate(e.candidate);
        
        const dc = pc1.createDataChannel('test');
        
        pc2.ondatachannel = (e) => {
          const receiveDc = e.channel;
          receiveDc.onopen = () => {
            webrtcSuccess = true;
            resolve(true);
          };
        };
        
        // Timeout after 5 seconds
        setTimeout(() => {
          if (!webrtcSuccess) {
            resolve(false);
          }
        }, 5000);
        
        pc1.createOffer()
          .then(offer => pc1.setLocalDescription(offer))
          .then(() => pc2.setRemoteDescription(pc1.localDescription!))
          .then(() => pc2.createAnswer())
          .then(answer => pc2.setLocalDescription(answer))
          .then(() => pc1.setRemoteDescription(pc2.localDescription!))
          .catch(() => resolve(false));
      });
      
      const [hasInternet, hasWebRTC] = await Promise.all([internetPromise, webrtcPromise]);
      
      if (!hasInternet) {
        setNetworkStatus("❌ No internet connection");
      } else if (!hasWebRTC) {
        setNetworkStatus("⚠️ Internet OK, WebRTC may be blocked");
      } else {
        setNetworkStatus("✅ Network OK, WebRTC enabled");
      }
      
      pc1.close();
      pc2.close();
    } catch (err) {
      setNetworkStatus("❌ Network test failed");
      console.error("Network test error:", err);
    } finally {
      setTestingNetwork(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        className="fixed left-2 bottom-20 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-md text-xs z-40"
        onClick={() => setIsOpen(true)}
      >
        Debug
      </button>
    );
  }

  const localStreamInfo = !stream ? "No local stream" : {
    id: stream.id,
    active: stream.active,
    audioTracks: stream.getAudioTracks().map(t => ({
      id: t.id.slice(0, 8) + '...',
      kind: t.kind,
      enabled: t.enabled,
      readyState: t.readyState,
      muted: t.muted,
    })),
    videoTracks: stream.getVideoTracks().map(t => ({
      id: t.id.slice(0, 8) + '...',
      kind: t.kind,
      enabled: t.enabled,
      readyState: t.readyState,
    })),
  };

  return (
    <div className="fixed left-2 bottom-20 bg-black/80 text-white p-3 rounded-lg text-xs z-40 max-w-xs max-h-96 overflow-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Debug Info</h3>
        <button onClick={() => setIsOpen(false)} className="text-white">×</button>
      </div>
      
      <div className="mb-2">
        <p className="font-semibold">Connection: {isConnected ? '✅ Connected' : '❌ Not Connected'}</p>
      </div>
      
      <div className="mb-2">
        <p className="font-semibold">Local Stream:</p>
        <pre className="overflow-auto text-green-300 bg-black/50 p-1 rounded mt-1">
          {JSON.stringify(localStreamInfo, null, 2)}
        </pre>
      </div>
      
      <div className="mb-2">
        <p className="font-semibold">Remote Peers ({remotePeers.length}):</p>
        {remotePeers.length === 0 ? (
          <p className="text-yellow-300 mt-1">No remote peers connected</p>
        ) : (
          remotePeers.map(peer => (
            <details key={peer.id} className="mt-1">
              <summary className="cursor-pointer">{peer.name || "Remote User"} ({peer.id.slice(0, 6)}...)</summary>
              <pre className="overflow-auto text-blue-300 bg-black/50 p-1 rounded mt-1 text-[10px]">
                {JSON.stringify({
                  id: peer.id,
                  stream: !peer.stream ? "No stream" : {
                    id: peer.stream.id,
                    active: peer.stream.active,
                    tracks: peer.stream.getTracks().length
                  }
                }, null, 2)}
              </pre>
            </details>
          ))
        )}
      </div>
      
      <div className="mb-2">
        <p className="font-semibold flex justify-between">
          <span>Network Status:</span> 
          <span className={networkStatus.includes("✅") ? "text-green-400" : 
                           networkStatus.includes("⚠️") ? "text-yellow-400" : 
                           networkStatus.includes("❌") ? "text-red-400" : ""}>
            {networkStatus}
          </span>
        </p>
      </div>
      
      <div className="mt-3 border-t border-gray-700 pt-2 flex gap-2">
        <button
          onClick={testNetworkConnectivity}
          disabled={testingNetwork}
          className={`bg-blue-700 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs flex-1 ${
            testingNetwork ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {testingNetwork ? 'Testing...' : 'Test Network'}
        </button>
        
        <button
          onClick={() => {
            if (stream) {
              console.log("Local stream:", stream);
              console.log("Video tracks:", stream.getVideoTracks());
              console.log("Audio tracks:", stream.getAudioTracks());
            }
          }}
          className="bg-blue-700 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs flex-1"
        >
          Log Stream Details
        </button>
      </div>
    </div>
  );
}
