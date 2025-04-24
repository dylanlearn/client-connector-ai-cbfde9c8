
import { useCallback } from 'react';
import { nanoid } from 'nanoid';

// A simple hook that returns a user ID, using localStorage to persist it
// In a real application, this would integrate with an authentication system
export function useUser() {
  const getUserId = useCallback(() => {
    // Check if we already have a user ID in localStorage
    const storedUserId = localStorage.getItem('collaborative_user_id');
    
    if (storedUserId) {
      return storedUserId;
    }
    
    // Generate a new user ID if none exists
    const newUserId = nanoid();
    localStorage.setItem('collaborative_user_id', newUserId);
    return newUserId;
  }, []);
  
  return getUserId();
}
