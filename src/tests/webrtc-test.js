// WebRTC connection test script
const { io } = require("socket.io-client");
const readline = require("readline");

// Create readline interface for interactive testing
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Server URL - should match the one in your app
const SOCKET_URL = process.env.SOCKET_URL || "http://localhost:3000";

console.log(`Connecting to Socket.io server at: ${SOCKET_URL}`);

// Create socket connection
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  reconnection: true,
});

// WebRTC configuration
const rtcConfig = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

// Mock user and room data
let userId = null;
let roomId = null;
let isAuthenticated = false;
let peerConnections = new Map(); // userId -> RTCPeerConnection

// Socket connection events
socket.on("connect", () => {
  console.log("✅ Connected to socket server!");
  console.log(`Socket ID: ${socket.id}`);
  showMenu();
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from socket server");
});

socket.on("connect_error", (error) => {
  console.error("❌ Connection error:", error.message);
});

// WebRTC signaling events
socket.on("webrtc_signal", (data) => {
  console.log(`\n📡 WebRTC signal received: ${data.type} from ${data.peerId}`);
  
  const { type, peerId, signal } = data;
  
  switch (type) {
    case "offer":
      handleRemoteOffer(signal, peerId);
      break;
    case "answer":
      handleRemoteAnswer(signal, peerId);
      break;
    case "ice-candidate":
      handleRemoteIceCandidate(signal, peerId);
      break;
  }
});

socket.on("user_joined", (data) => {
  console.log(`\n👋 User joined: ${JSON.stringify(data, null, 2)}`);
  if (data.userId !== userId) {
    console.log(`Initiating WebRTC connection to ${data.userId}`);
    createPeerConnection(data.userId, true);
  }
});

socket.on("user_left", (data) => {
  console.log(`\n👋 User left: ${JSON.stringify(data, null, 2)}`);
  closePeerConnection(data.userId);
});

// Display interactive menu
function showMenu() {
  console.log("\n=== WebRTC Test Client ===");
  console.log("1) Authenticate");
  console.log("2) Join room");
  console.log("3) Create offer to specific peer");
  console.log("4) List active peer connections");
  console.log("5) Leave room");
  console.log("6) Disconnect");
  console.log("7) Exit");
  
  rl.question("Select an option: ", (answer) => {
    switch(answer) {
      case "1":
        authenticateUser();
        break;
      case "2":
        joinRoom();
        break;
      case "3":
        createOfferToPeer();
        break;
      case "4":
        listPeerConnections();
        break;
      case "5":
        leaveRoom();
        break;
      case "6":
        socket.disconnect();
        showMenu();
        break;
      case "7":
        console.log("Exiting...");
        socket.disconnect();
        rl.close();
        process.exit(0);
        break;
      default:
        console.log("Invalid option");
        showMenu();
    }
  });
}

// Simulate authentication
function authenticateUser() {
  rl.question("Enter user ID (for testing): ", (id) => {
    userId = id;
    
    // Create a fake JWT token for testing
    const mockToken = Buffer.from(JSON.stringify({ userId })).toString('base64');
    
    socket.emit("authenticate", { token: mockToken }, (response) => {
      if (response && response.success) {
        console.log("✅ Authenticated successfully");
        isAuthenticated = true;
      } else {
        console.log("❌ Authentication failed:", response ? response.message : "Unknown error");
      }
      showMenu();
    });
  });
}

// Join a room
function joinRoom() {
  if (!isAuthenticated) {
    console.log("❌ You need to authenticate first!");
    return showMenu();
  }
  
  rl.question("Enter room ID: ", (id) => {
    roomId = id;
    
    socket.emit("join_room", { roomId, userId }, (response) => {
      if (response && response.success) {
        console.log("✅ Joined room successfully");
        
        // If there are existing users in the room, create peer connections to them
        if (response.users && response.users.length > 0) {
          response.users.forEach(user => {
            if (user.id !== userId) {
              console.log(`Creating peer connection to existing user: ${user.id}`);
              createPeerConnection(user.id, true);
            }
          });
        }
      } else {
        console.log("❌ Failed to join room:", response ? response.message : "Unknown error");
      }
      showMenu();
    });
  });
}

// Create an offer to a specific peer
function createOfferToPeer() {
  if (!roomId) {
    console.log("❌ You need to join a room first!");
    return showMenu();
  }
  
  rl.question("Enter peer ID to connect to: ", (peerId) => {
    createPeerConnection(peerId, true);
    showMenu();
  });
}

// List active peer connections
function listPeerConnections() {
  console.log("\n=== Active Peer Connections ===");
  
  if (peerConnections.size === 0) {
    console.log("No active peer connections");
  } else {
    peerConnections.forEach((pc, peerId) => {
      console.log(`- Peer: ${peerId}, Connection state: ${pc.connectionState}`);
    });
  }
  
  showMenu();
}

// Leave the room
function leaveRoom() {
  if (!roomId) {
    console.log("❌ You're not in a room!");
    return showMenu();
  }
  
  // Close all peer connections
  peerConnections.forEach((pc, peerId) => {
    closePeerConnection(peerId);
  });
  
  socket.emit("leave_room", { roomId, userId }, (response) => {
    if (response && response.success) {
      console.log("✅ Left room successfully");
      roomId = null;
    } else {
      console.log("❌ Failed to leave room:", response ? response.message : "Unknown error");
    }
    showMenu();
  });
}

// Create a new peer connection
function createPeerConnection(peerId, isInitiator) {
  console.log(`Creating ${isInitiator ? 'initiator' : 'receiver'} peer connection to ${peerId}`);
  
  // Create and store new RTCPeerConnection
  const pc = new RTCPeerConnection(rtcConfig);
  
  // Store extra data with the connection
  pc._peerId = peerId;
  pc._isInitiator = isInitiator;
  
  // Set up event handlers
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      console.log(`❄️ Local ICE candidate: ${event.candidate.candidate}`);
      
      // Send candidate to remote peer
      socket.emit("webrtc_signal", {
        type: "ice-candidate",
        peerId: peerId,
        roomId: roomId,
        signal: event.candidate
      });
    }
  };
  
  pc.onconnectionstatechange = () => {
    console.log(`Connection state changed: ${pc.connectionState}`);
  };
  
  pc.oniceconnectionstatechange = () => {
    console.log(`ICE connection state changed: ${pc.iceConnectionState}`);
  };
  
  pc.onsignalingstatechange = () => {
    console.log(`Signaling state changed: ${pc.signalingState}`);
  };
  
  pc.ontrack = (event) => {
    console.log("Remote track received", event.streams[0].id);
  };
  
  // Save connection
  peerConnections.set(peerId, pc);
  
  // If we're the initiator, create and send an offer
  if (isInitiator) {
    createAndSendOffer(pc, peerId);
  }
  
  return pc;
}

// Close and remove a peer connection
function closePeerConnection(peerId) {
  const pc = peerConnections.get(peerId);
  if (pc) {
    console.log(`Closing peer connection to ${peerId}`);
    
    try {
      pc.close();
    } catch (err) {
      console.error("Error closing peer connection:", err);
    }
    
    peerConnections.delete(peerId);
    console.log(`Peer connection to ${peerId} closed`);
  }
}

// Create and send WebRTC offer
async function createAndSendOffer(pc, peerId) {
  try {
    // Add a dummy audio track (needed to create an offer)
    const stream = new MediaStream();
    pc.addTrack(stream.getTracks()[0], stream);
    
    // Create offer
    const offer = await pc.createOffer();
    console.log(`Created offer: ${offer.sdp.substring(0, 50)}...`);
    
    // Set as local description
    await pc.setLocalDescription(offer);
    console.log("Set local description (offer)");
    
    // Send to remote peer
    socket.emit("webrtc_signal", {
      type: "offer",
      peerId: peerId,
      roomId: roomId,
      signal: offer
    });
    
    console.log(`Sent offer to ${peerId}`);
  } catch (err) {
    console.error("Error creating/sending offer:", err);
  }
}

// Handle incoming offer from remote peer
async function handleRemoteOffer(offer, peerId) {
  try {
    console.log(`Received offer from ${peerId}`);
    
    // Create peer connection if it doesn't exist
    let pc = peerConnections.get(peerId);
    if (!pc) {
      pc = createPeerConnection(peerId, false);
    }
    
    // Set remote description
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    console.log("Set remote description (offer)");
    
    // Create answer
    const answer = await pc.createAnswer();
    console.log(`Created answer: ${answer.sdp.substring(0, 50)}...`);
    
    // Set as local description
    await pc.setLocalDescription(answer);
    console.log("Set local description (answer)");
    
    // Send to remote peer
    socket.emit("webrtc_signal", {
      type: "answer",
      peerId: peerId,
      roomId: roomId,
      signal: answer
    });
    
    console.log(`Sent answer to ${peerId}`);
  } catch (err) {
    console.error("Error handling offer:", err);
  }
}

// Handle incoming answer from remote peer
async function handleRemoteAnswer(answer, peerId) {
  try {
    console.log(`Received answer from ${peerId}`);
    
    const pc = peerConnections.get(peerId);
    if (!pc) {
      console.error(`No peer connection found for ${peerId}`);
      return;
    }
    
    // Set remote description
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
    console.log("Set remote description (answer)");
  } catch (err) {
    console.error("Error handling answer:", err);
  }
}

// Handle incoming ICE candidate from remote peer
async function handleRemoteIceCandidate(candidate, peerId) {
  try {
    console.log(`Received ICE candidate from ${peerId}`);
    
    const pc = peerConnections.get(peerId);
    if (!pc) {
      console.error(`No peer connection found for ${peerId}`);
      return;
    }
    
    // Add ICE candidate
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
    console.log("Added remote ICE candidate");
  } catch (err) {
    console.error("Error handling ICE candidate:", err);
  }
}

// Connect to the server when script starts
socket.connect();
