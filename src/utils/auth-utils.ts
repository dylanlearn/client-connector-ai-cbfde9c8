
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
export function getRedirectUrl(): string {
  return `${window.location.origin}/dashboard`;
}

// Helper function to get email confirmation redirect URL
export function getEmailConfirmationRedirectUrl(): string {
  return `${window.location.origin}/email-confirmation`;
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
  
  // Example SQL that would be executed:
  // ALTER TABLE ${tableName} REPLICA IDENTITY FULL;
  // INSERT INTO supabase_realtime.subscription (subscription_id, entity, filters, claims, claims_role, created_at)
  // VALUES ('${tableName}_changes', '${tableName}', '{}', '{}', 'authenticated', now());
}
