// Basic WebSocket test client to verify connections
import { WebSocket } from 'ws';
import readline from 'readline';

// Create readline interface for interactive testing
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Server URL - should match the one in your app
const SERVER_URL = process.env.SERVER_URL || "localhost";
const SERVER_PORT = process.env.SERVER_PORT || "3000";
const WS_URL = `ws://${SERVER_URL}:${SERVER_PORT}/ws`;

console.log(`Connecting to WebSocket server at: ${WS_URL}`);

// Variables to track state
let socket = null;
let userId = null;
let roomId = null;
let isAuthenticated = false;

// Create socket connection function
function connectSocket() {
  if (socket) {
    console.log("Closing existing connection...");
    socket.close();
  }

  console.log("Connecting to WebSocket server...");
  socket = new WebSocket(WS_URL);

  // Socket connection events
  socket.on('open', () => {
    console.log("✅ Connected to socket server!");
    showMenu();
  });

  socket.on('close', () => {
    console.log("❌ Disconnected from socket server");
  });

  socket.on('error', (error) => {
    console.error("❌ Connection error:", error.message);
  });

  // Handle messages from server
  socket.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      console.log(`\n📨 Received message: ${JSON.stringify(message, null, 2)}`);
      
      // Handle specific message types
      switch(message.type) {
        case 'chat_message':
          console.log(`\n📨 Chat message from ${message.sender.username}: ${message.content}`);
          break;
          
        case 'user_typing':
          console.log(`\n✏️ User ${message.username} is typing...`);
          break;
          
        case 'user_joined':
          console.log(`\n👋 User joined: ${JSON.stringify(message, null, 2)}`);
          break;
          
        case 'user_left':
          console.log(`\n👋 User left: ${JSON.stringify(message, null, 2)}`);
          break;
          
        case 'room_joined':
          console.log(`\n🚪 Joined room: ${JSON.stringify(message, null, 2)}`);
          break;
          
        case 'webrtc_signal':
          console.log(`\n📡 WebRTC signal received: ${JSON.stringify(message.type)}`);
          break;
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });
}

// Send a message to the server
function sendMessage(type, data = {}, callback) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.log("❌ Socket not connected");
    return;
  }
  
  const message = {
    type,
    ...data
  };
  
  try {
    socket.send(JSON.stringify(message));
    console.log(`Sent ${type} message`);
    
    if (callback) {
      callback();
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

// Display interactive menu
function showMenu() {
  console.log("\n=== WebSocket Test Client ===");
  console.log("1) Authenticate");
  console.log("2) Join room");
  console.log("3) Send chat message");
  console.log("4) Send typing indicator");
  console.log("5) Leave room");
  console.log("6) Disconnect");
  console.log("7) Reconnect");
  console.log("8) Exit");
  
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
        if (socket) {
          socket.close();
        }
        showMenu();
        break;
      case "7":
        connectSocket();
        break;
      case "8":
        console.log("Exiting...");
        if (socket) {
          socket.close();
        }
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
    
    sendMessage("authenticate", { token: mockToken }, () => {
      console.log("✅ Authentication request sent");
      isAuthenticated = true;
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
    
    sendMessage("join_room", { roomId, userId }, () => {
      console.log("✅ Join room request sent");
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
    
    sendMessage("chat_message", message, () => {
      console.log("✅ Message sent");
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
  
  sendMessage("typing", data, () => {
    console.log("✅ Typing indicator sent");
    
    // Automatically turn off the typing indicator after 5 seconds
    setTimeout(() => {
      sendMessage("typing", { ...data, isTyping: false }, () => {
        console.log("✅ Typing indicator stopped");
      });
    }, 5000);
    
    showMenu();
  });
}

// Leave the room
function leaveRoom() {
  if (!roomId) {
    console.log("❌ You're not in a room!");
    return showMenu();
  }
  
  sendMessage("leave_room", { roomId, userId }, () => {
    console.log("✅ Leave room request sent");
    roomId = null;
    showMenu();
  });
}

// Connect to the server when script starts
connectSocket();
