
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/utils/auth-utils";
import { toast } from "sonner";

export function useProfileData(userId: string | undefined) {
  const queryClient = useQueryClient();
  const [updateError, setUpdateError] = useState<Error | null>(null);
  
  // Profile fetching with React Query for caching
  const { 
    data: profile, 
    isLoading, 
    error,
    refetch: refetchProfile 
  } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data as UserProfile;
    },
    // Only fetch when we have a userId
    enabled: !!userId,
    // Cache profile data for 5 minutes (300000ms)
    staleTime: 300000,
    // Only retry failed requests twice
    retry: 2,
    // Using meta for error handling instead of onError
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching profile:', error);
      }
    }
  });

  // Profile update mutation
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
      // Update the cached profile data
      queryClient.setQueryData(['profile', userId], newProfileData);
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
    refetchProfile: async () => {
      await refetchProfile();
    }
  };
}
