// Basic Socket.io test client to verify connections
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
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Mock user ID and room ID for testing
let userId = null;
let roomId = null;
let isAuthenticated = false;

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

// Chat events
socket.on("chat_message", (message) => {
  console.log(`\n📨 Received message: ${JSON.stringify(message, null, 2)}`);
});

socket.on("user_typing", (data) => {
  console.log(`\n✏️ User ${data.username} is typing...`);
});

socket.on("user_joined", (data) => {
  console.log(`\n👋 User joined: ${JSON.stringify(data, null, 2)}`);
});

socket.on("user_left", (data) => {
  console.log(`\n👋 User left: ${JSON.stringify(data, null, 2)}`);
});

socket.on("room_joined", (data) => {
  console.log(`\n🚪 Joined room: ${JSON.stringify(data, null, 2)}`);
});

socket.on("webrtc_signal", (data) => {
  console.log(`\n📡 WebRTC signal received: ${JSON.stringify(data.type)}`);
});

// Display interactive menu
function showMenu() {
  console.log("\n=== Socket.io Test Client ===");
  console.log("1) Authenticate");
  console.log("2) Join room");
  console.log("3) Send chat message");
  console.log("4) Send typing indicator");
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
        sendChatMessage();
        break;
      case "4":
        sendTypingIndicator();
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
      if (response.success) {
        console.log("✅ Authenticated successfully");
        isAuthenticated = true;
      } else {
        console.log("❌ Authentication failed:", response.message);
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
      } else {
        console.log("❌ Failed to join room:", response ? response.message : "Unknown error");
      }
      showMenu();
    });
  });
}

// Send a chat message
function sendChatMessage() {
  if (!roomId) {
    console.log("❌ You need to join a room first!");
    return showMenu();
  }
  
  rl.question("Enter message: ", (content) => {
    const message = {
      content,
      roomId,
      sender: {
        id: userId,
        username: `TestUser_${userId}`
      },
      timestamp: Date.now()
    };
    
    socket.emit("chat_message", message, (response) => {
      if (response && response.success) {
        console.log("✅ Message sent successfully");
      } else {
        console.log("❌ Failed to send message:", response ? response.message : "Unknown error");
      }
      showMenu();
    });
  });
}

// Send typing indicator
function sendTypingIndicator() {
  if (!roomId) {
    console.log("❌ You need to join a room first!");
    return showMenu();
  }
  
  const data = {
    roomId,
    userId,
    username: `TestUser_${userId}`,
    isTyping: true
  };
  
  socket.emit("typing", data);
  console.log("✅ Typing indicator sent");
  
  // Automatically turn off the typing indicator after 5 seconds
  setTimeout(() => {
    socket.emit("typing", { ...data, isTyping: false });
    console.log("✅ Typing indicator stopped");
  }, 5000);
  
  showMenu();
}

// Leave the room
function leaveRoom() {
  if (!roomId) {
    console.log("❌ You're not in a room!");
    return showMenu();
  }
  
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

// Connect to the server when script starts
socket.connect();
