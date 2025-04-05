
import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { UserProfile } from "@/utils/auth-utils";
import { useProfileData } from "@/hooks/use-profile-data";
import { AuthContext } from './AuthContext';

interface ProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  error: Error | null;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refetchProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useContext(AuthContext);
  
  // Only fetch profile if user is authenticated
  const {
    profile,
    isLoading,
    error,
    updateProfile: updateProfileData,
    refetchProfile
  } = useProfileData(user?.id);
  
  // Wrap the updateProfile function to return void
  const updateProfile = async (updates: Partial<UserProfile>) => {
    await updateProfileData(updates);
    // Return void explicitly
    return;
  };
  
  // Create memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    profile,
    isLoading,
    error,
    updateProfile,
    refetchProfile,
  }), [profile, isLoading, error, updateProfile, refetchProfile]);
  
  // Wrap the original AuthContext to include profile data
  const authContext = useContext(AuthContext);
  
  // Memoize the enhanced auth context to prevent unnecessary re-renders
  const enhancedAuthContext = useMemo(() => ({
    ...authContext,
    profile: profile,
  }), [authContext, profile]);
  
  return (
    <ProfileContext.Provider value={contextValue}>
      <AuthContext.Provider value={enhancedAuthContext}>
        {children}
      </AuthContext.Provider>
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  
  return context;
}
