import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { socket, socketService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useRoomMessages } from '@/services/query-hooks';

// Define chat message type
export interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    username: string;
  };
  timestamp: number;
  messageType?: 'text' | 'system' | 'media';
}

interface RoomUser {
  id: string;
  username: string;
  isActive: boolean;
  lastActive?: number;
}

interface ChatContextType {
  messages: ChatMessage[];
  users: RoomUser[];
  isConnected: boolean;
  isJoined: boolean;
  sendMessage: (content: string) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  typingUsers: Map<string, string>; // userId -> username
  setIsTyping: (isTyping: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ 
  children, 
  roomId 
}: { 
  children: ReactNode;
  roomId: string;
}) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<RoomUser[]>([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isJoined, setIsJoined] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());
  
  // Fetch initial messages from the API
  const { data: messagesData } = useRoomMessages(roomId);

  // Handle socket connection events
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);
  
  // Connect to the room with socket
  useEffect(() => {
    if (roomId && user && isConnected) {
      joinRoom(roomId);
    }
    
    return () => {
      leaveRoom();
    };
  }, [roomId, user, isConnected]);
  
  // Initialize messages from API
  useEffect(() => {
    if (messagesData?.success && messagesData?.data) {
      setMessages(messagesData.data);
    }
  }, [messagesData]);

  // Set up room event handlers
  useEffect(() => {
    function onRoomJoined(data: any) {
      console.log('Room joined:', data);
      
      if (data.roomId === roomId) {
        setIsJoined(true);
        
        if (data.messages) {
          setMessages(data.messages);
        }
        
        if (data.users) {
          setUsers(data.users);
        }
      }
    }

    function onNewMessage(data: any) {
      console.log('New message:', data);
      
      if (data.roomId === roomId) {
        setMessages(prevMessages => [...prevMessages, data.message]);
      }
    }

    function onUserJoined(data: any) {
      console.log('User joined:', data);
      
      if (data.message) {
        setMessages(prevMessages => [...prevMessages, {
          id: data.message.id,
          content: data.message.content,
          sender: {
            id: data.userId,
            username: data.username
          },
          timestamp: data.message.timestamp,
          messageType: data.message.messageType || 'system'
        }]);
      }
      
      // Add user to users list if not already there
      setUsers(prevUsers => {
        if (!prevUsers.some(u => u.id === data.userId)) {
          return [...prevUsers, {
            id: data.userId,
            username: data.username,
            isActive: true
          }];
        }
        return prevUsers;
      });
    }

    function onUserLeft(data: any) {
      console.log('User left:', data);
      
      if (data.message) {
        setMessages(prevMessages => [...prevMessages, {
          id: data.message.id,
          content: data.message.content,
          sender: {
            id: data.userId,
            username: data.username
          },
          timestamp: data.message.timestamp,
          messageType: data.message.messageType || 'system'
        }]);
      }
      
      // Update user status in users list
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === data.userId 
            ? { ...u, isActive: false, lastActive: Date.now() } 
            : u
        )
      );
    }
    
    function onTypingStatus(data: any) {
      const { userId, username, isTyping } = data;
      
      // Skip self
      if (user && userId === user.id) return;
      
      setTypingUsers(prevTypingUsers => {
        const newTypingUsers = new Map(prevTypingUsers);
        
        if (isTyping) {
          newTypingUsers.set(userId, username);
        } else {
          newTypingUsers.delete(userId);
        }
        
        return newTypingUsers;
      });
    }

    // Register event handlers
    socket.on('room_joined', onRoomJoined);
    socket.on('new_message', onNewMessage);
    socket.on('user_joined', onUserJoined);
    socket.on('user_left', onUserLeft);
    socket.on('typing_status', onTypingStatus);

    return () => {
      // Clean up event handlers
      socket.off('room_joined', onRoomJoined);
      socket.off('new_message', onNewMessage);
      socket.off('user_joined', onUserJoined);
      socket.off('user_left', onUserLeft);
      socket.off('typing_status', onTypingStatus);
    };
  }, [roomId, user]);

  const joinRoom = (roomId: string) => {
    socketService.joinRoom(roomId);
  };

  const leaveRoom = () => {
    if (isJoined && roomId) {
      socketService.leaveRoom(roomId);
      setIsJoined(false);
    }
  };

  const sendMessage = (content: string) => {
    if (!content.trim() || !isJoined || !roomId) return;
    
    socketService.sendMessage(roomId, content);
    
    // Clear typing status
    socketService.sendTypingStatus(roomId, false);
  };
  
  const setIsTyping = (isTyping: boolean) => {
    if (!isJoined || !roomId) return;
    
    socketService.sendTypingStatus(roomId, isTyping);
  };

  return (
    <ChatContext.Provider value={{
      messages,
      users,
      isConnected,
      isJoined,
      sendMessage,
      joinRoom,
      leaveRoom,
      typingUsers,
      setIsTyping
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
