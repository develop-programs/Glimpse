import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { useLogin, useVerifyAuth } from '@/services/query-hooks';
import { socketService } from '@/services/api';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Use the login mutation
  const loginMutation = useLogin();

  // Use auth verification query
  const { data: authData, isLoading: isVerifying } = useVerifyAuth();

  useEffect(() => {
    // Check if user is logged in on mount
    checkAuthStatus();

    // Update user data if auth verification succeeds
    if (authData && authData.success && authData.user) {
      setUser(authData.user);
      setIsLoading(false);
    }
  }, [authData]);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // User data from localStorage as a fallback before the query completes
      const savedUser = localStorage.getItem('user_data');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      // Initialize socket connection if token exists
      socketService.connect();
      socketService.authenticate();
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await loginMutation.mutateAsync({ email, password });

      if (result.success) {
        setUser(result.user);
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // In a real app, you would make an API call to create a new user
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (name && email && password) {
        // Mock user creation
        const mockUser: User = {
          id: `user-${Date.now()}`,
          username: name,
          email,
          role: 'User'
        };

        // Save token and user data
        localStorage.setItem('auth_token', 'mock-jwt-token');
        localStorage.setItem('user_data', JSON.stringify(mockUser));

        setUser(mockUser);
        setIsLoading(false);

        // Initialize socket connection
        socketService.connect();
        socketService.authenticate();

        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Signup failed:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);

    // Disconnect socket
    socketService.disconnect();

    navigate('/auth/login');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading: isLoading || isVerifying,
      login,
      logout,
      signup
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
