
import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate authentication check
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    // Artificial delay to simulate network request
    setTimeout(checkAuth, 500);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simulate authentication
    setIsLoading(true);
    
    // For demo purposes, we'll just create a mock user
    const mockUser = {
      id: '1',
      email,
      name: 'Demo User'
    };
    
    // Store in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsLoading(false);
    
    return mockUser;
  };

  const signOut = async () => {
    // Clear stored user data
    localStorage.removeItem('user');
    setUser(null);
  };

  const signInWithGoogle = async () => {
    // Mock Google authentication
    setIsLoading(true);
    
    const mockGoogleUser = {
      id: '2',
      email: 'google.user@example.com',
      name: 'Google User'
    };
    
    localStorage.setItem('user', JSON.stringify(mockGoogleUser));
    setUser(mockGoogleUser);
    setIsLoading(false);
    
    return mockGoogleUser;
  };

  const signUp = async (email: string, password: string, name: string, phoneNumber: string) => {
    // Simulate registration
    setIsLoading(true);
    
    const mockNewUser = {
      id: '3',
      email,
      name
    };
    
    // Store the new user
    localStorage.setItem('user', JSON.stringify(mockNewUser));
    setUser(mockNewUser);
    setIsLoading(false);
    
    return mockNewUser;
  };

  // Computed properties
  const isLoggedIn = !!user;

  return {
    user,
    isLoading,
    isLoggedIn,
    signIn,
    signOut,
    signInWithGoogle,
    signUp
  };
};
