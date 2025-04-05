
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { UserProfile } from "@/utils/auth-utils";

/**
 * Hook for efficiently fetching and caching user profile data
 * Uses TanStack Query to prevent redundant database calls
 */
export function useProfileData() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Only fetch profile if user is authenticated
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user?.id) return null;
      
      console.log("Fetching profile from database for user:", user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      return data as UserProfile;
    },
    enabled: !!user?.id, // Only run query if userId exists
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep unused data in cache for 10 minutes
    retry: (failureCount, error) => {
      // Limit retries to prevent excessive database calls on persistent errors
      return failureCount < 2;
    }
  });

  // Function to update profile in the cache
  const updateProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update cache with new values
      queryClient.setQueryData(['profile', user.id], (oldData: UserProfile | undefined) => {
        return oldData ? { ...oldData, ...updates } : null;
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };
  
  return {
    profile,
    isLoading,
    error,
    updateProfile,
  };
}
