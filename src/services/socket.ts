// filepath: /home/shreyansh/Documents/Projects/Glimpse/client/src/services/socket.ts
// This file now implements the socket service functionality

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080";

// Socket service implementation
export const socketService = {
  socket: null as WebSocket | null,

  // Connect to the WebSocket server
  connect: () => {
    if (
      socketService.socket &&
      socketService.socket.readyState === WebSocket.OPEN
    ) {
      console.log("Socket is already connected");
      return;
    }

    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.error("Cannot connect to socket: No auth token found");
      return;
    }

    // Create WebSocket connection with auth token
    const userId = JSON.parse(localStorage.getItem("user_data") || "{}").id;
    socketService.socket = new WebSocket(
      `${SOCKET_URL.replace("http", "ws")}/ws?token=${token}`
    );

    socketService.socket.onopen = () => {
      console.log("Socket connection established");
    };

    socketService.socket.onerror = (error) => {
      console.error("Socket error:", error);
    };

    socketService.socket.onclose = () => {
      console.log("Socket connection closed");
    };

    return socketService.socket;
  },

  // Authenticate the WebSocket connection
  authenticate: () => {
    const userData = localStorage.getItem("user_data");
    if (socketService.socket && userData) {
      const user = JSON.parse(userData);
      socketService.emit("authenticate", { userId: user.id });
    }
  },

  // Join a room through the WebSocket
  joinRoom: (roomId: string) => {
    socketService.emit("join_room", { roomId });
  },

  // Leave a room through the WebSocket
  leaveRoom: (roomId: string) => {
    socketService.emit("leave_room", { roomId });
  },

  // Disconnect from the WebSocket server
  disconnect: () => {
    if (socketService.socket) {
      socketService.socket.close();
      socketService.socket = null;
      console.log("Socket disconnected");
    }
  },

  // Send a message through the WebSocket
  emit: (eventName: string, data: any) => {
    if (
      socketService.socket &&
      socketService.socket.readyState === WebSocket.OPEN
    ) {
      const message = JSON.stringify({
        event: eventName,
        data: data,
      });
      socketService.socket.send(message);
    } else {
      console.error("Cannot emit event: Socket not connected");
    }
  },

  // Register an event listener
  on: (eventName: string, callback: (data: any) => void) => {
    if (socketService.socket) {
      const originalOnMessage = socketService.socket.onmessage;

      socketService.socket.onmessage = (event) => {
        // Call the original handler if it exists
        if (originalOnMessage && socketService.socket) {
          originalOnMessage.call(socketService.socket, event);
        }

        try {
          const message = JSON.parse(event.data);
          if (message.event === eventName) {
            callback(message.data);
          }
        } catch (error) {
          console.error("Error parsing socket message:", error);
        }
      };
    } else {
      console.error("Cannot register event listener: Socket not connected");
    }
  },

  // Remove an event listener
  off: (eventName: string) => {
    if (!socketService.socket) {
      console.error("Cannot remove event listener: Socket not connected");
      return;
    }
    
    // Since WebSocket doesn't have a direct way to remove listeners for specific events,
    // we need to implement our own event management system
    
    // Store the original onmessage handler
    const originalOnMessage = socketService.socket.onmessage;
    
    // Replace the onmessage handler with a new one that filters out the specified event
    if (originalOnMessage) {
      socketService.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          // Only call the original handler if it's not the event we're removing
          if (message.event !== eventName && originalOnMessage && socketService.socket) {
            originalOnMessage.call(socketService.socket, event);
          }
        } catch (error) {
          // If there's an error parsing, just call the original handler
          if (originalOnMessage && socketService.socket) {
            originalOnMessage.call(socketService.socket, event);
          }
        }
      };
    }
    
    console.log(`Removed listener for event: ${eventName}`);
  },
};
