import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, invalidateProfileCache } from "@/utils/auth-utils";
import { toast } from "sonner";

const PROFILE_QUERY_KEY = 'profile';

export function useProfileData(userId: string | undefined) {
  const queryClient = useQueryClient();
  const [updateError, setUpdateError] = useState<Error | null>(null);
  
  const queryKey = useMemo(() => 
    [PROFILE_QUERY_KEY, userId], 
    [userId]
  );
  
  const { 
    data: profile, 
    isLoading, 
    error,
    refetch: refetchProfile 
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!userId) return null;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) throw error;
        return data as UserProfile;
      } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
    },
    enabled: !!userId,
    staleTime: 300000,
    gcTime: 600000,
    retry: 2,
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching profile:', error);
      }
    }
  });

  const optimizedRefetchProfile = useCallback(async () => {
    if (userId) {
      invalidateProfileCache(userId);
      await refetchProfile();
    }
  }, [userId, refetchProfile]);

  const { mutateAsync: updateProfile } = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      if (!userId) throw new Error('User ID is required to update profile');
      
      setUpdateError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data as UserProfile;
    },
    onSuccess: (newProfileData) => {
      queryClient.setQueryData(queryKey, newProfileData);
      
      if (userId) {
        invalidateProfileCache(userId);
      }
      
      toast.success('Profile updated successfully');
    },
    onError: (error: Error) => {
      setUpdateError(error);
      toast.error('Failed to update profile', {
        description: error.message
      });
      console.error('Error updating profile:', error);
    }
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    updateError,
    refetchProfile: optimizedRefetchProfile
  };
}
