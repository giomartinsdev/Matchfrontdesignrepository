import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  logout: () => void;
  updateUser: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and user
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('finfacil_user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Listen for logout events
    const handleLogout = () => {
      setUser(null);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password);
      const { access_token, user } = response;
      
      // Store token and user
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('finfacil_user', JSON.stringify(user));
      setUser(user);
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await apiService.register(email, password, name);
      const { access_token, user } = response;
      
      // Store token and user
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('finfacil_user', JSON.stringify(user));
      setUser(user);
      
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const response = await apiService.loginWithGoogle();
      const { access_token, user } = response;

      // Store token and user
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('finfacil_user', JSON.stringify(user));
      setUser(user);
      
      return response;
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('finfacil_user');
    localStorage.removeItem('access_token');
    window.dispatchEvent(new Event('auth:logout'));
  };

  const updateUser = async (userData: any) => {
    try {
      // Update user via API
      const updatedUser = await apiService.updateUserProfile(userData);
      
      // Update local storage and state
      localStorage.setItem('finfacil_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, loginWithGoogle, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
