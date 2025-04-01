
/**
 * Utility functions for generating secure tokens
 */

// Generate a unique token for client access
export const generateToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};
