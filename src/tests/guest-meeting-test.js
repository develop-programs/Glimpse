// Test file for guest mode meeting functionality
import { generateRoomId } from '../components/dashboard/Features/NewMeeting';

/**
 * Test creating a meeting in guest mode
 * This function simulates creating a new meeting as a guest user
 * Usage: Open browser console and run window.testGuestMeeting.create()
 */
const testCreateMeeting = () => {
  console.log('Testing meeting creation in guest mode');
  
  // Clear any existing user ID or auth token
  localStorage.removeItem('auth_token');
  
  // Generate a room ID
  const roomId = generateRoomId();
  console.log('Generated room ID:', roomId);
  
  // Set a guest user ID
  const guestId = 'guest-' + Math.random().toString(36).substring(2, 15);
  localStorage.setItem('userId', guestId);
  console.log('Set guest user ID:', guestId);
  
  // Set a display name
  localStorage.setItem('displayName', 'Test Guest');
  
  // Navigate to room
  window.location.href = `/room/${roomId}`;
  
  return roomId; // Return the roomId so it can be shared with others for testing
};

/**
 * Test joining a meeting in guest mode
 * This function simulates joining an existing meeting as a guest user
 * @param {string} roomId - The room ID to join
 * Usage: Open browser console and run window.testGuestMeeting.join("roomId")
 */
const testJoinMeeting = (roomId) => {
  if (!roomId) {
    console.error('Error: Room ID is required to join a meeting');
    return;
  }
  
  console.log('Testing meeting joining in guest mode');
  console.log('Joining room:', roomId);
  
  // Clear any existing user ID or auth token
  localStorage.removeItem('auth_token');
  
  // Set a guest user ID
  const guestId = 'guest-' + Math.random().toString(36).substring(2, 15);
  localStorage.setItem('userId', guestId);
  console.log('Set guest user ID:', guestId);
  
  // Set a display name
  localStorage.setItem('displayName', 'Test Guest Joiner');
  
  // Navigate to room
  window.location.href = `/room/${roomId}`;
};

// Expose functions to window for testing via browser console
window.testGuestMeeting = {
  create: testCreateMeeting,
  join: testJoinMeeting,
  // Helper function to get the current meeting info
  getInfo: () => {
    return {
      roomId: window.location.pathname.split('/room/')[1],
      userId: localStorage.getItem('userId'),
      displayName: localStorage.getItem('displayName'),
      isGuest: !localStorage.getItem('auth_token')
    };
  }
};

console.log('Guest meeting test utilities loaded.');
console.log('Usage:');
console.log('1. To create a meeting: window.testGuestMeeting.create()');
console.log('2. To join a meeting: window.testGuestMeeting.join("roomId")');
console.log('3. To get current meeting info: window.testGuestMeeting.getInfo()');
