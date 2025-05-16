
import { UserProfile } from '@/types/enterprise-auth';

/**
 * Helper function to get redirect URL for authentication
 * @param fallbackUrl Default URL to redirect to if no redirect is specified
 * @returns The URL to redirect to after successful authentication
 */
export function getRedirectUrl(fallbackUrl: string = '/dashboard'): string {
  // Check for redirect in URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const redirectPath = urlParams.get('redirect');
  
  if (redirectPath) {
    // Make sure we only redirect to paths within our app, not external URLs
    if (redirectPath.startsWith('/')) {
      return redirectPath;
    }
  }
  
  return fallbackUrl;
}

/**
 * Helper function to get email confirmation redirect URL
 * @returns URL for email confirmation redirection
 */
export function getEmailConfirmationRedirectUrl(): string {
  return `${window.location.origin}/dashboard`;
}

/**
 * Invalidate cache for a specific user's profile
 * @param userId The ID of the user whose profile cache to invalidate
 */
export function invalidateProfileCache(userId: string): void {
  if (typeof window !== 'undefined') {
    // Clear profile cache for the user
    console.log(`Invalidating profile cache for user ${userId}`);
    // This is a placeholder implementation
    const cacheKey = `profile-${userId}`;
    localStorage.removeItem(cacheKey);
  }
}

/**
 * Clean up auth state in local storage to prevent auth limbo states
 */
export function cleanupAuthState(): void {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
}

/**
 * Enable realtime updates for a specific table
 * @param tableName The name of the table to enable realtime updates for
 */
export function enableRealtimeForTable(tableName: string): void {
  if (!tableName) return;
  
  // In a real implementation, this would execute SQL to enable realtime for the table
  console.log(`Enabling realtime updates for table: ${tableName}`);
}

export type { UserProfile };
