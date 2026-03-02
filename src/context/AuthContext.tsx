import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  handle: string;
  avatar: string;
  role: string;
  points: number;
  events: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('cyberverse_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock authentication - in real app, this would validate against backend
    if (email && password.length >= 6) {
      const mockUser: User = {
        id: 'user_' + Date.now(),
        name: email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email,
        handle: '@' + email.split('@')[0].replace(/\./g, '_'),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        role: 'Member',
        points: 0,
        events: 0,
      };
      
      setUser(mockUser);
      localStorage.setItem('cyberverse_user', JSON.stringify(mockUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (name && email && password.length >= 6) {
      const mockUser: User = {
        id: 'user_' + Date.now(),
        name,
        email,
        handle: '@' + name.toLowerCase().replace(/\s/g, '_'),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        role: 'New Recruit',
        points: 100,
        events: 0,
      };
      
      setUser(mockUser);
      localStorage.setItem('cyberverse_user', JSON.stringify(mockUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cyberverse_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
