// socket-native.ts - WebSocket implementation using the native WebSocket API
// This replaces the Socket.io implementation to match our server's WebSocket implementation

// Base URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const WS_URL = API_URL.replace(/^http/, 'ws').replace(/8080/, '8081');

type MessageCallback = (data: any) => void;
type EventCallback = () => void;

interface SocketCallbacks {
  [key: string]: MessageCallback[];
}

export class WebSocketService {
  private socket: WebSocket | null = null;
  private connected: boolean = false;
  private callbacks: SocketCallbacks = {};
  private eventCallbacks: Record<string, EventCallback[]> = {
    connect: [],
    disconnect: [],
    connect_error: []
  };
  private reconnectTimer: number | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;

  constructor() {
    this.initialize();
  }

  private initialize() {
    // This doesn't connect yet, just sets up the structure
    this.callbacks = {};
    this.connected = false;
  }

  // Connect to the WebSocket server
  connect() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket already connected or connecting');
      return;
    }

    try {
      // Ensure proper WebSocket URL format
      console.log('Attempting to connect to WebSocket at:', WS_URL);
      this.socket = new WebSocket(`${WS_URL}`);

      this.socket.onopen = () => {
        console.log('WebSocket connected successfully to:', WS_URL);
        this.connected = true;
        this.reconnectAttempts = 0;
        this.triggerEvent('connect');
      };

      this.socket.onclose = (event) => {
        console.log('WebSocket disconnected with code:', event.code, 'reason:', event.reason);
        this.connected = false;
        this.triggerEvent('disconnect');
        this.attemptReconnect();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        console.error('Connection failed to:', WS_URL);
        this.triggerEvent('connect_error');
      };

      this.socket.onmessage = (event) => {
        try {
          console.log('WebSocket message received:', event.data);
          const data = JSON.parse(event.data);
          const type = data.type || 'unknown';
          
          if (this.callbacks[type]) {
            console.log('Triggering callbacks for event type:', type);
            this.callbacks[type].forEach(callback => callback(data));
          } else {
            console.log('No callbacks registered for event type:', type);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.triggerEvent('connect_error');
      this.attemptReconnect();
    }
  }

  // Attempt to reconnect with backoff
  private attemptReconnect() {
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnect attempts reached');
      return;
    }

    const delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts);
    console.log(`Attempting to reconnect in ${delay}ms`);

    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  // Disconnect from the WebSocket server
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.connected = false;
  }

  // Register an event listener (connect, disconnect, connect_error)
  on(event: string, callback: EventCallback | MessageCallback) {
    if (event === 'connect' || event === 'disconnect' || event === 'connect_error') {
      if (!this.eventCallbacks[event]) {
        this.eventCallbacks[event] = [];
      }
      this.eventCallbacks[event].push(callback as EventCallback);
    } else {
      if (!this.callbacks[event]) {
        this.callbacks[event] = [];
      }
      this.callbacks[event].push(callback as MessageCallback);
    }
  }

  // Remove an event listener
  off(event: string, callback: EventCallback | MessageCallback) {
    if (event === 'connect' || event === 'disconnect' || event === 'connect_error') {
      if (this.eventCallbacks[event]) {
        this.eventCallbacks[event] = this.eventCallbacks[event].filter(cb => cb !== callback);
      }
    } else if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
    }
  }

  // Trigger an event (connect, disconnect, connect_error)
  private triggerEvent(event: string) {
    if (this.eventCallbacks[event]) {
      this.eventCallbacks[event].forEach(callback => callback());
    }
  }

  // Send a message to the server
  emit(type: string, data: any, callback?: (response: any) => void) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected. Current state:', this.socket ? this.socket.readyState : 'null');
      if (callback) {
        callback({ success: false, message: 'WebSocket not connected' });
      }
      return;
    }

    const message = {
      type,
      ...data
    };

    try {
      const messageString = JSON.stringify(message);
      console.log('Sending WebSocket message:', messageString);
      this.socket.send(messageString);
      
      // If a callback is provided, register a one-time listener for the response
      if (callback) {
        const responseType = `${type}_response`;
        const onResponse = (response: any) => {
          callback(response);
          // Remove the listener after it's called
          if (this.callbacks[responseType]) {
            this.callbacks[responseType] = this.callbacks[responseType].filter(cb => cb !== onResponse);
          }
        };
        
        if (!this.callbacks[responseType]) {
          this.callbacks[responseType] = [];
        }
        this.callbacks[responseType].push(onResponse);
      }
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      if (callback) {
        callback({ success: false, message: 'Error sending message' });
      }
    }
  }

  // Check if the socket is connected
  isConnected(): boolean {
    return this.connected;
  }

  // Authenticate the socket connection with a JWT token
  authenticate() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.error('No auth token found');
      return;
    }

    this.emit('authenticate', { token }, (response) => {
      if (response.success) {
        console.log('Socket authenticated successfully');
      } else {
        console.error('Socket authentication failed:', response.message);
      }
    });
  }
}

// Create a singleton instance
export const socketService = new WebSocketService();

// Export a compatibility layer for components that expect a socket.io like interface
export const socket = {
  connected: false,
  connect: () => socketService.connect(),
  disconnect: () => socketService.disconnect(),
  on: (event: string, callback: any) => socketService.on(event, callback),
  off: (event: string, callback: any) => socketService.off(event, callback),
  emit: (event: string, data: any, callback?: any) => socketService.emit(event, data, callback),
};

// Initialize event listeners for tracking connection state
socketService.on('connect', () => {
  socket.connected = true;
});

socketService.on('disconnect', () => {
  socket.connected = false;
});
