
/**
 * Main entry point for client access services
 * Re-exports all client-related functionality
 */

export * from './token-generation';
export * from './client-link-creator';
export * from './client-link-validator';
export * from './client-link-delivery';
export * from './client-link-queries';

// Also export the validation utility from the main client services
import { validatePersonalMessage, VALIDATION_CONSTANTS } from '@/utils/validation-utils';
export { validatePersonalMessage, VALIDATION_CONSTANTS };
