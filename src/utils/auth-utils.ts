
export interface UserProfile {
  id: string;
  name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  role?: string | null;
  created_at?: string;
  updated_at?: string;
  subscription_status?: string | null;
  preferences?: Record<string, any>;
}

// Helper function to get redirect URL for authentication
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

// Helper function to get email confirmation redirect URL
export function getEmailConfirmationRedirectUrl(): string {
  return `${window.location.origin}/dashboard`;
}

// Cache invalidation helpers
export function invalidateProfileCache(userId: string): void {
  if (typeof window !== 'undefined') {
    // Clear profile cache for the user
    // In a real implementation, this might use a caching library like react-query's invalidateQueries
    console.log(`Invalidating profile cache for user ${userId}`);
    // This is a placeholder implementation
    const cacheKey = `profile-${userId}`;
    localStorage.removeItem(cacheKey);
  }
}

// Enable realtime updates for a specific table
export function enableRealtimeForTable(tableName: string): void {
  if (!tableName) return;
  
  // In a real implementation, this would execute SQL to enable realtime for the table
  // For demonstration purposes only
  console.log(`Enabling realtime updates for table: ${tableName}`);
}

// Clean up auth state in local storage
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
