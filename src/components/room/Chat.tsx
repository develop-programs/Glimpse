import React, { useState, useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { chatMessagesAtom, ChatMessage } from '@/data/room';
import { socket, socketService } from '@/services/socket-native';
import { X, Send, MessageSquare } from 'lucide-react';

interface ChatProps {
  roomId: string;
  isOpen: boolean;
  onClose: () => void;
}

const Chat: React.FC<ChatProps> = ({ roomId, isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useAtom(chatMessagesAtom);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Focus the input field when chat is opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);
  
  // Set up socket event listeners for chat messages
  useEffect(() => {
    // Handler for receiving a new message
    const handleNewMessage = (data: any) => {
      console.log('New message received:', data);
      if (data.roomId === roomId && data.message) {
        const newMessage: ChatMessage = {
          id: data.message.id || `msg-${Date.now()}`,
          sender: data.message.senderName || data.message.sender,
          content: data.message.content,
          timestamp: new Date(data.message.timestamp || Date.now()),
        };
        
        setChatMessages(prevMessages => [...prevMessages, newMessage]);
      }
    };

    // Add debugging log for socket events
    console.log('Setting up socket listeners for room:', roomId);
    
    // Listen for new messages
    socket.on('new_message', handleNewMessage);
    
    // Log when connected/disconnected
    const handleConnect = () => {
      console.log('Socket connected');
    };
    
    const handleDisconnect = () => {
      console.log('Socket disconnected');
    };
    
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    
    // Clean up event listener
    return () => {
      console.log('Cleaning up socket listeners');
      socket.off('new_message', handleNewMessage);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [roomId, setChatMessages]);
  
  // Send a message
  const sendMessage = () => {
    if (!message.trim()) return;
    
    // Get user info
    const displayName = localStorage.getItem('displayName') || 'Guest';
    
    console.log('Sending message to room:', roomId, message);
    
    // Send via socket
    socketService.emit('chat_message', {
      roomId,
      content: message
    });
    
    console.log('Message sent to room:', roomId, message);
    
    // Add to local state (optimistic update)
    const chatMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      sender: displayName,
      content: message,
      timestamp: new Date(),
    };
    
    setChatMessages(prevMessages => [...prevMessages, chatMessage]);
    
    // Clear input
    setMessage('');
  };
  
  // Handle key press for sending message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  // Format message timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="flex flex-col h-full w-full bg-gray-900 rounded-lg overflow-hidden">
      {/* Chat header */}
      <div className="p-3 border-b border-gray-700 flex justify-between items-center bg-gray-800">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold text-white">Chat</h3>
        </div>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-700 transition-colors"
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {chatMessages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            <div className="text-center">
              <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>No messages yet</p>
              <p className="text-xs mt-1">Start the conversation!</p>
            </div>
          </div>
        ) : (
          chatMessages.map(msg => (
            <div key={msg.id} className={`max-w-[85%] ${msg.sender === (localStorage.getItem('displayName') || 'You') ? 'ml-auto' : ''}`}>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="font-medium text-sm text-white">{msg.sender}</span>
                  <span className="text-xs text-gray-400">{formatTime(msg.timestamp)}</span>
                </div>
                <div className={`p-2 rounded-lg mt-1 ${
                  msg.sender === (localStorage.getItem('displayName') || 'You') 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-white'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="p-3 border-t border-gray-700 bg-gray-800">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            className={`p-2 rounded-full ${message.trim() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-600 cursor-not-allowed'} transition-colors`}
          >
            <Send className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
