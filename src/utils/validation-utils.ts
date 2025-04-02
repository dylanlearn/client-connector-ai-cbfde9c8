
/**
 * Centralized validation utilities for the application
 */

const MAX_PERSONAL_MESSAGE_LENGTH = 150;

/**
 * Validates a personal message against length constraints
 * @param message The personal message to validate
 * @returns An object containing validation result and error message if any
 */
export const validatePersonalMessage = (message: string | null | undefined): { 
  valid: boolean; 
  errorMessage: string | null 
} => {
  if (!message) {
    return { valid: true, errorMessage: null };
  }
  
  if (message.length > MAX_PERSONAL_MESSAGE_LENGTH) {
    return { 
      valid: false, 
      errorMessage: `Personal message must be ${MAX_PERSONAL_MESSAGE_LENGTH} characters or less` 
    };
  }
  
  return { valid: true, errorMessage: null };
};

// Export constants for use throughout the application
export const VALIDATION_CONSTANTS = {
  MAX_PERSONAL_MESSAGE_LENGTH,
};
