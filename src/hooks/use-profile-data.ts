
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/utils/auth-utils";
import { useState, useCallback } from 'react';

const PROFILE_STALE_TIME = 1000 * 60 * 5; // 5 minutes
const PROFILE_CACHE_TIME = 1000 * 60 * 30; // 30 minutes

/**
 * Hook for efficiently fetching and caching user profile data
 * Uses TanStack Query to prevent redundant database calls
 */
export function useProfileData(userId: string | undefined) {
  const queryClient = useQueryClient();
  const [retries, setRetries] = useState(0);
  const MAX_RETRIES = 2;

  // Query for profile data
  const { 
    data: profile, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!userId) return null;
      
      console.log("Fetching profile from database for user:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        
        // Limit retries to prevent excessive database calls on persistent errors
        if (retries < MAX_RETRIES) {
          setRetries(prev => prev + 1);
          throw error; // This will trigger a retry
        } else {
          // After max retries, just return null
          console.warn('Max retries reached for profile fetch');
          return null;
        }
      }
      
      // Reset retry counter on success
      setRetries(0);
      return data as UserProfile;
    },
    enabled: !!userId, // Only run query if userId exists
    staleTime: PROFILE_STALE_TIME, // Consider data fresh for 5 minutes
    gcTime: PROFILE_CACHE_TIME, // Keep unused data in cache for 30 minutes
    retry: (failureCount, error: any) => {
      // Only retry if we haven't exceeded max retries
      return failureCount < MAX_RETRIES;
    }
  });

  // Mutation for updating profile
  const mutation = useMutation({
    mutationFn: async (updates: Partial<UserProfile>): Promise<void> => {
      if (!userId) return;
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
        
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      // Update cache with new values on successful mutation
      queryClient.setQueryData(['profile', userId], (oldData: UserProfile | undefined) => {
        return oldData ? { ...oldData, ...variables } : null;
      });
    }
  });

  const updateProfile = useCallback(async (updates: Partial<UserProfile>): Promise<void> => {
    return mutation.mutateAsync(updates);
  }, [mutation]);

  const refetchProfile = useCallback(async (): Promise<void> => {
    await refetch();
  }, [refetch]);
  
  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refetchProfile
  };
}
