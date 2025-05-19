# Glimpse Integration Testing Guide

This guide will help you test the integration between the Glimpse client and server components, focusing on WebSocket connections, chat functionality, and WebRTC peer connections.

## Prerequisites

1. Make sure both the client and server are running:
   - Server: Run `npm start` in the server directory
   - Client: Run `npm run dev` in the client directory

2. Install the required dependencies for test scripts:
   ```bash
   cd client
   npm install socket.io-client readline
   ```

## Testing WebSocket Connection and Chat

1. Run the socket test script:
   ```bash
   node src/tests/socket-test.js
   ```

2. Follow the interactive menu to:
   - Authenticate with a test user ID
   - Join a room (use the same room ID as in the browser)
   - Send test messages to see if they appear in the client
   - Test typing indicators

3. In your browser, open the Glimpse app and navigate to the same room to see if messages and notifications appear correctly.

## Testing WebRTC Peer Connections

1. Run the WebRTC test script:
   ```bash
   node src/tests/webrtc-test.js
   ```

2. Follow the interactive menu to:
   - Authenticate with a test user ID
   - Join a room (use the same room ID as in the browser)
   - Create offers to specific peers
   - List active peer connections

3. In your browser, open the Glimpse app and navigate to the same room to test video/audio connections.

## Troubleshooting

### WebSocket Issues

- **Connection failures**: Check if the server is running and if the client is connecting to the correct URL
- **Authentication errors**: Verify the token format and authentication process
- **Message delivery problems**: Check the room ID and the server logs for any errors

### WebRTC Issues

- **ICE connection failures**: May indicate NAT traversal issues, try using different networks
- **Media stream errors**: Check browser permissions for camera and microphone access
- **Peer connection state issues**: Verify the signaling process and check network connectivity

## End-to-End Testing Checklist

1. **Authentication**
   - [ ] User can log in successfully
   - [ ] WebSocket connects on login
   - [ ] Authentication state persists on refresh

2. **Room Functionality**
   - [ ] User can create a new room
   - [ ] User can join an existing room
   - [ ] Room details are displayed correctly

3. **Chat Features**
   - [ ] Messages are sent and received in real-time
   - [ ] System messages appear for user join/leave events
   - [ ] Typing indicators work correctly

4. **Media Connections**
   - [ ] Camera and microphone permissions are requested correctly
   - [ ] Local video preview works
   - [ ] Peer connections establish successfully
   - [ ] Audio and video streams are exchanged properly
   - [ ] Screen sharing works

5. **UI Functionality**
   - [ ] View switching (grid, spotlight, sidebar) works
   - [ ] Controls for camera, microphone, and screen sharing work
   - [ ] Participant list shows all connected users
   - [ ] Chat panel opens and closes correctly

## Performance Testing

For each room, test with:
- 2 participants (minimum viable test)
- 4 participants (medium load)
- 8+ participants (heavy load)

Monitor:
- Network usage
- CPU/memory consumption
- Video quality degradation
- Connection stability
