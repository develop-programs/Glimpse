import { socket } from './socket-native';

// Define interfaces for better type safety
interface PeerConnectionConfig {
  onIceCandidate?: (candidate: RTCIceCandidate) => void;
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
  onTrack?: (event: RTCTrackEvent) => void;
  roomId?: string;
  userId?: string;
}

interface PeerData {
  id: string;
  stream: MediaStream | null;
  connection: RTCPeerConnection;
  isInitiator: boolean;
}

class RoomPeerService {
  private peers: Map<string, PeerData> = new Map();
  private config: PeerConnectionConfig = {};
  private localStream: MediaStream | null = null;
  private roomId: string | null = null;
  private myUserId: string | null = null;
  
  constructor() {
    this.setupSocketListeners();
  }
  
  // Set up socket event listeners for WebRTC signaling
  private setupSocketListeners() {
    socket.on('webrtc_signal', (data: any) => {
      const { type, peerId, signal } = data;
      
      switch (type) {
        case 'offer':
          this.handleRemoteOffer(signal, peerId);
          break;
          
        case 'answer':
          this.handleRemoteAnswer(signal, peerId);
          break;
          
        case 'ice-candidate':
          this.handleRemoteIceCandidate(signal, peerId);
          break;
      }
    });
    
    socket.on('user_joined', (data: any) => {
      const { userId, username } = data;
      console.log(`User joined room: ${username} (${userId})`);
      this.createPeerConnection(userId, true);
    });
    
    socket.on('user_left', (data: any) => {
      const { userId } = data;
      console.log(`User left room: ${userId}`);
      this.removePeer(userId);
    });
  }
  
  // Initialize service with config
  public init(config: PeerConnectionConfig = {}): void {
    this.config = config;
    
    if (config.roomId) {
      this.roomId = config.roomId;
    }
    
    if (config.userId) {
      this.myUserId = config.userId;
    }
  }
  
  // Create a new peer connection for a specific user
  private createPeerConnection(peerId: string, isInitiator: boolean): RTCPeerConnection {
    try {
      const peer = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
          { urls: "stun:stun3.l.google.com:19302" },
        ],
      });
      
      // Set up event handlers
      peer.onicecandidate = (event) => {
        if (event.candidate) {
          this.sendIceCandidate(peerId, event.candidate);
          
          if (this.config.onIceCandidate) {
            this.config.onIceCandidate(event.candidate);
          }
        }
      };
      
      peer.onconnectionstatechange = () => {
        console.log(`Peer ${peerId} connection state: ${peer.connectionState}`);
        
        if (this.config.onConnectionStateChange) {
          this.config.onConnectionStateChange(peer.connectionState);
        }
      };
      
      peer.ontrack = (event) => {
        console.log(`Received track from peer ${peerId}:`, event);
        
        if (this.config.onTrack) {
          this.config.onTrack(event);
        }
        
        // Update the peer's stream
        const peerData = this.peers.get(peerId);
        if (peerData && event.streams && event.streams[0]) {
          this.peers.set(peerId, {
            ...peerData,
            stream: event.streams[0]
          });
        }
      };
      
      // Add local stream tracks if available
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => {
          if (this.localStream) {
            peer.addTrack(track, this.localStream);
          }
        });
      }
      
      // Store the peer connection
      this.peers.set(peerId, {
        id: peerId,
        connection: peer,
        stream: null,
        isInitiator
      });
      
      // If this peer is the initiator, create and send an offer
      if (isInitiator) {
        this.createAndSendOffer(peerId);
      }
      
      return peer;
    } catch (error) {
      console.error("Error creating RTCPeerConnection:", error);
      throw error;
    }
  }
  
  // Add a stream to all peer connections
  public addStream(stream: MediaStream): void {
    this.localStream = stream;
    
    // Add stream to all existing peer connections
    this.peers.forEach((peerData, peerId) => {
      const { connection } = peerData;
      
      // Remove any existing tracks
      const senders = connection.getSenders();
      senders.forEach(sender => {
        connection.removeTrack(sender);
      });
      
      // Add new tracks from the stream
      stream.getTracks().forEach(track => {
        connection.addTrack(track, stream);
      });
      
      // If this is the initiator, create a new offer
      if (peerData.isInitiator) {
        this.createAndSendOffer(peerId);
      }
    });
  }
  
  // Create and send an offer to a peer
  private async createAndSendOffer(peerId: string): Promise<void> {
    try {
      const peerData = this.peers.get(peerId);
      if (!peerData) return;
      
      const { connection } = peerData;
      
      const offer = await connection.createOffer();
      await connection.setLocalDescription(offer);
      
      this.sendOffer(peerId, offer);
    } catch (error) {
      console.error(`Error creating offer for peer ${peerId}:`, error);
    }
  }
  
  // Handle a remote offer
  private async handleRemoteOffer(offer: RTCSessionDescriptionInit, peerId: string): Promise<void> {
    try {
      // Create a peer connection if it doesn't exist
      let peer = this.peers.get(peerId)?.connection;
      if (!peer) {
        peer = this.createPeerConnection(peerId, false);
      }
      
      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      
      this.sendAnswer(peerId, answer);
    } catch (error) {
      console.error(`Error handling offer from peer ${peerId}:`, error);
    }
  }
  
  // Handle a remote answer
  private async handleRemoteAnswer(answer: RTCSessionDescriptionInit, peerId: string): Promise<void> {
    try {
      const peerData = this.peers.get(peerId);
      if (!peerData) return;
      
      const { connection } = peerData;
      
      await connection.setRemoteDescription(new RTCSessionDescription(answer));
      console.log(`Set remote answer from peer ${peerId}`);
    } catch (error) {
      console.error(`Error handling answer from peer ${peerId}:`, error);
    }
  }
  
  // Handle a remote ICE candidate
  private async handleRemoteIceCandidate(candidate: RTCIceCandidateInit, peerId: string): Promise<void> {
    try {
      const peerData = this.peers.get(peerId);
      if (!peerData) return;
      
      const { connection } = peerData;
      
      await connection.addIceCandidate(new RTCIceCandidate(candidate));
      console.log(`Added ICE candidate from peer ${peerId}`);
    } catch (error) {
      console.error(`Error handling ICE candidate from peer ${peerId}:`, error);
    }
  }
  
  // Send an offer to a peer
  private sendOffer(peerId: string, offer: RTCSessionDescriptionInit): void {
    if (!this.roomId) {
      console.error("Room ID not set");
      return;
    }
    
    socket.emit('webrtc_signal', {
      type: 'offer',
      roomId: this.roomId,
      peerId,
      signal: offer
    });
  }
  
  // Send an answer to a peer
  private sendAnswer(peerId: string, answer: RTCSessionDescriptionInit): void {
    if (!this.roomId) {
      console.error("Room ID not set");
      return;
    }
    
    socket.emit('webrtc_signal', {
      type: 'answer',
      roomId: this.roomId,
      peerId,
      signal: answer
    });
  }
  
  // Send an ICE candidate to a peer
  private sendIceCandidate(peerId: string, candidate: RTCIceCandidate): void {
    if (!this.roomId) {
      console.error("Room ID not set");
      return;
    }
    
    socket.emit('webrtc_signal', {
      type: 'ice-candidate',
      roomId: this.roomId,
      peerId,
      signal: candidate
    });
  }
  
  // Remove a peer connection
  public removePeer(peerId: string): void {
    const peerData = this.peers.get(peerId);
    if (!peerData) return;
    
    const { connection } = peerData;
    
    // Clean up the connection
    connection.onicecandidate = null;
    connection.onconnectionstatechange = null;
    connection.ontrack = null;
    connection.close();
    
    // Remove from the map
    this.peers.delete(peerId);
  }
  
  // Get all peers
  public getAllPeers(): PeerData[] {
    return Array.from(this.peers.values());
  }
  
  // Get a specific peer
  public getPeer(peerId: string): PeerData | undefined {
    return this.peers.get(peerId);
  }
  
  // Join a room and start connections
  public joinRoom(roomId: string, userId: string): void {
    this.roomId = roomId;
    this.myUserId = userId;
    
    socket.emit('join_room', { roomId });
  }
  
  // Leave a room and clean up all connections
  public leaveRoom(): void {
    if (!this.roomId) return;
    
    socket.emit('leave_room', { roomId: this.roomId });
    
    // Clean up all peer connections
    this.peers.forEach((_, peerId) => {
      this.removePeer(peerId);
    });
    
    this.roomId = null;
  }
  
  // Clean up all resources
  public cleanup(): void {
    // Leave the current room if in one
    if (this.roomId) {
      this.leaveRoom();
    }
    
    // Clean up local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
  }

  // Method from old peer service to maintain compatibility
  async getOffer(): Promise<RTCSessionDescriptionInit | undefined> {
    // This is just to maintain compatibility with old code
    console.warn("getOffer() is deprecated. Use createPeerConnection() instead.");
    return undefined;
  }
  
  // Method from old peer service to maintain compatibility
  async setOffer(offer: RTCSessionDescriptionInit): Promise<void> {
    console.warn("setOffer() is deprecated. This method does nothing.");
    return;
  }
  
  // Method from old peer service to maintain compatibility
  async getAnswer(offer?: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit | undefined> {
    console.warn("getAnswer() is deprecated. Use createPeerConnection() instead.");
    return undefined;
  }
  
  // Method from old peer service to maintain compatibility
  async setAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    console.warn("setAnswer() is deprecated. This method does nothing.");
    return;
  }
}

export const roomPeerService = new RoomPeerService();
