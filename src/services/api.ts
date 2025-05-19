// Base URL for API requests
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// Import utility functions
import { handleApiResponse, getAuthHeaders } from '@/utils/api-utils';
// Import socket service for re-export
import { socketService } from './socket';

// Also provide the socket as a named export for backward compatibility
const socket = socketService;

// Implement the API methods that query-hooks.ts expects
const api = {
  // Basic HTTP methods
  get: async (endpoint: string) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.warn('Authentication failed: Token may be invalid or expired');
          // Clear the invalid token
          localStorage.removeItem('auth_token');
        }
        throw new Error(`API error: ${response.status}`);
      }

      return {
        data: await response.json(),
        status: response.status,
      };
    } catch (error) {
      console.error('Error in GET request:', error);
      throw error;
    }
  },

  post: async (endpoint: string, payload: object) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.warn('Authentication failed: Token may be invalid or expired');
          // Clear the invalid token
          localStorage.removeItem('auth_token');
        }
        throw new Error(`API error: ${response.status}`);
      }

      return {
        data: await response.json(),
        status: response.status,
      };
    } catch (error) {
      console.error('Error in POST request:', error);
      throw error;
    }
  },

  // Auth service
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      return await response.json();
    },

    register: async (username: string, email: string, password: string) => {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      return await response.json();
    },

    verify: async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No auth token found');
      }

      const response = await fetch(`${BASE_URL}/api/auth/verify`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      return await response.json();
    },
  },

  // Rooms service
  rooms: {
    getAll: async () => {
      const response = await fetch(`${BASE_URL}/api/rooms`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }

      return await response.json();
    },

    getById: async (roomId: string) => {
      const response = await fetch(`${BASE_URL}/api/rooms/${roomId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch room ${roomId}`);
      }

      return await response.json();
    },

    create: async (name: string, description?: string) => {
      const response = await fetch(`${BASE_URL}/api/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to create room');
      }

      return await response.json();
    },

    join: async (roomId: string) => {
      const response = await fetch(`${BASE_URL}/api/rooms/${roomId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to join room ${roomId}`);
      }

      return await response.json();
    },

    leave: async (roomId: string) => {
      const response = await fetch(`${BASE_URL}/api/rooms/${roomId}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to leave room ${roomId}`);
      }

      return await response.json();
    },

    getMessages: async (roomId: string, page: number = 1, limit: number = 50) => {
      const response = await fetch(`${BASE_URL}/api/rooms/${roomId}/messages?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch messages for room ${roomId}`);
      }

      return await response.json();
    },
  },

  // Messages service
  messages: {
    send: async (roomId: string, content: string) => {
      const response = await fetch(`${BASE_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        body: JSON.stringify({ roomId, content }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return await response.json();
    },

    delete: async (messageId: string) => {
      const response = await fetch(`${BASE_URL}/api/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      return await response.json();
    },
  },
};

// Export the API object
export default api;

// Also export named api for flexibility
export { api, socketService, socket };