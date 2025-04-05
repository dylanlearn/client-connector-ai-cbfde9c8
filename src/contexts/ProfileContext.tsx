
import React, { createContext, useContext, ReactNode } from 'react';
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
  
  // Wrap the original AuthContext to include profile data
  const enhancedAuthContext = useContext(AuthContext);
  
  return (
    <ProfileContext.Provider 
      value={{
        profile,
        isLoading,
        error,
        updateProfile,
        refetchProfile,
      }}
    >
      <AuthContext.Provider 
        value={{
          ...enhancedAuthContext,
          profile: profile,
        }}
      >
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
