# Glimpse WebRTC Implementation Guide

This document provides an overview of the WebRTC implementation in the Glimpse video conferencing application, including signaling, media handling, and peer connection management.

## Overview

WebRTC (Web Real-Time Communication) is used in Glimpse to enable direct peer-to-peer audio, video, and data communication between users. The implementation follows these key steps:

1. **Signaling**: Using WebSockets to exchange session information and ICE candidates
2. **Media Access**: Requesting and managing local media streams (camera, microphone)
3. **Peer Connection**: Establishing and managing peer connections with other users
4. **Media Streaming**: Sending and receiving audio/video streams

## Architecture

### Client-Side Components

- `room-peer.ts`: Main service for managing WebRTC peer connections
- `api.ts`: API service with WebSocket integration
- `socket.ts`: WebSocket client for signaling
- `ChatContext.tsx`: Context for WebSocket communication
- `room-with-query.tsx`: Room component that implements video conferencing

### Server-Side Components

- `chatHandler.js`: WebSocket handler for signaling
- `rooms.js`: API routes for room management
- `Room.js`: MongoDB model for rooms

## WebRTC Flow

### 1. User Joins a Room

When a user joins a room, the following sequence occurs:

1. User authenticates with JWT
2. User joins a room via WebSocket
3. Server notifies existing room participants of new user
4. Each existing participant initiates a peer connection to the new user
5. The new user accepts incoming connections

### 2. Media Handling

For media streams, the client:

1. Requests access to camera and microphone
2. Creates a local media stream
3. Displays the local stream in the UI
4. Adds the local stream tracks to peer connections

```javascript
// Simplified media handling
async function initializeMediaStream() {
  try {
    const constraints = {
      video: camera ? { width: 1280, height: 720 } : false,
      audio: mic ? { echoCancellation: true } : false
    };
    
    const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    
    // Display locally
    videoRef.current.srcObject = mediaStream;
    
    // Share with peers
    roomPeerService.addStream(mediaStream);
  } catch (error) {
    console.error("Error accessing media devices:", error);
  }
}
```

### 3. Peer Connection Setup

The `room-peer.ts` service handles peer connection setup:

```typescript
// Creating a peer connection to another user
function createPeerConnection(peerId, isInitiator) {
  // Create RTCPeerConnection with ICE servers
  const pc = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" }
    ]
  });
  
  // Add local stream tracks to connection
  if (localStream) {
    localStream.getTracks().forEach(track => {
      pc.addTrack(track, localStream);
    });
  }
  
  // Handle ICE candidates
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      // Send candidate to remote peer via socket
      socket.emit("webrtc_signal", {
        type: "ice-candidate",
        peerId,
        roomId,
        signal: event.candidate
      });
    }
  };
  
  // Handle remote tracks
  pc.ontrack = (event) => {
    // Display remote stream
    handleRemoteStream(event.streams[0], peerId);
  };
  
  // If initiator, create and send offer
  if (isInitiator) {
    createAndSendOffer(pc, peerId);
  }
  
  return pc;
}
```

### 4. Signaling Process

The signaling process uses WebSockets:

1. **Offer Creation**: Initiator creates an offer and sets it as local description
2. **Offer Transmission**: Offer is sent to the remote peer via WebSocket
3. **Offer Reception**: Remote peer receives the offer and sets it as remote description
4. **Answer Creation**: Remote peer creates an answer and sets it as local description
5. **Answer Transmission**: Answer is sent back to the initiator via WebSocket
6. **Answer Reception**: Initiator receives the answer and sets it as remote description
7. **ICE Candidate Exchange**: Peers exchange ICE candidates via WebSocket

## Screen Sharing Implementation

Screen sharing uses the `getDisplayMedia` API:

```typescript
async function toggleScreenShare() {
  if (screenShare) {
    // Stop screen sharing
    localStream.getTracks().forEach(track => {
      if (track.kind === 'video' && track.label.includes('screen')) {
        track.stop();
      }
    });
    
    // Revert to camera if enabled
    if (camera) {
      await initializeMediaStream();
    }
    
    setScreenShare(false);
  } else {
    try {
      // Request screen share stream
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: screenShareWithAudio
      });
      
      // Replace video track in all peer connections
      const videoTrack = displayStream.getVideoTracks()[0];
      roomPeerService.replaceTrack(videoTrack);
      
      // Update local display
      const newStream = new MediaStream([videoTrack]);
      if (localStream && localStream.getAudioTracks().length > 0) {
        newStream.addTrack(localStream.getAudioTracks()[0]);
      }
      
      setLocalStream(newStream);
      videoRef.current.srcObject = newStream;
      
      setScreenShare(true);
      
      // Handle when user stops sharing
      videoTrack.onended = () => {
        setScreenShare(false);
        initializeMediaStream();
      };
    } catch (err) {
      console.error("Error sharing screen:", err);
    }
  }
}
```

## Handling Network Changes and Disconnects

The implementation includes:

1. **ICE Connection Monitoring**: Watching ICE connection state
2. **Connection State Changes**: Handling peer connection state changes
3. **Reconnection Logic**: Attempting to reconnect on network changes

```typescript
// Handle connection state changes
pc.onconnectionstatechange = () => {
  switch(pc.connectionState) {
    case "connected":
      console.log(`Connected to peer ${peerId}`);
      break;
    case "disconnected":
    case "failed":
      console.log(`Connection to peer ${peerId} lost`);
      // Attempt reconnection
      setTimeout(() => {
        if (peers.has(peerId)) {
          console.log(`Attempting to reconnect to ${peerId}`);
          createPeerConnection(peerId, true);
        }
      }, 2000);
      break;
    case "closed":
      console.log(`Connection to peer ${peerId} closed`);
      peers.delete(peerId);
      break;
  }
};
```

## Optimizations

The implementation includes several optimizations:

1. **Adaptive Bitrate**: Adjusting video quality based on network conditions
2. **Connection Pruning**: Removing stale connections
3. **Resource Management**: Properly releasing media tracks when not needed
4. **Error Handling**: Comprehensive error handling for WebRTC operations

## Testing

The project includes test scripts for WebRTC functionality:

1. `webrtc-test.js`: For testing peer connections
2. Check the README in the `tests` directory for detailed testing instructions

## Common Issues and Solutions

1. **ICE Connection Failures**: Usually due to firewall issues or incompatible NAT traversal
   - Solution: Use additional TURN servers

2. **Media Access Denied**: Browser permissions issues
   - Solution: Ensure proper error handling and user guidance

3. **Track Replacement Issues**: When transitioning between camera and screen sharing
   - Solution: Properly stop and replace tracks in all peer connections

4. **Memory Leaks**: From not releasing media tracks and peer connections
   - Solution: Implement proper cleanup in component unmount

## WebRTC Security Considerations

1. All media access requires explicit user permission
2. DTLS (Datagram Transport Layer Security) is used to encrypt all WebRTC communications
3. ICE servers should be configured to use secure origins
4. Room access is protected by authentication
