
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { Session, User, Provider } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './ProfileContext';
import { cleanupAuthState, getRedirectUrl } from '@/utils/auth-utils';
import { toast } from 'sonner';

export interface AuthContextType {
  isLoggedIn: boolean;
  error: Error | null;
  isLoading: boolean;
  session: Session | null;
  user: User | null;
  profile: any | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { profile, isLoading: isProfileLoading, refetchProfile } = useProfile();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state change event:", event);
        if (isMounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          // If user signs in, refetch profile after a small delay to avoid deadlocks
          if (event === 'SIGNED_IN' && currentSession?.user) {
            setTimeout(() => {
              refetchProfile();
            }, 0);
          }
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (isMounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error initializing auth state:', err);
        if (isMounted) {
          setIsLoading(false);
          setError(err instanceof Error ? err : new Error('Unknown error during auth initialization'));
        }
      }
    };

    initializeAuth();

    // Clean up on unmount
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [refetchProfile]);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      // Clean up auth state before signing in
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      return { error: null };
    } catch (error: any) {
      console.error('Sign in error:', error.message);
      toast.error(`Login failed: ${error.message}`);
      return { error };
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      // Clean up auth state before signing in
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${getRedirectUrl()}`
        }
      });
      
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Google sign in error:', error.message);
      toast.error(`Google login failed: ${error.message}`);
      return { error };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast.success('Registration successful! Please check your email to confirm your account.');
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Sign up error:', error.message);
      toast.error(`Registration failed: ${error.message}`);
      return { error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      cleanupAuthState();
      toast.success('Successfully signed out');
    } catch (error: any) {
      console.error('Sign out error:', error.message);
      toast.error('Failed to sign out');
    }
  };

  // Send password reset email
  const sendPasswordReset = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (!error) {
        toast.success('Password reset email sent. Check your inbox.');
      }
      
      return { error };
    } catch (error: any) {
      console.error('Password reset error:', error.message);
      toast.error(`Failed to send password reset email: ${error.message}`);
      return { error };
    }
  };

  // Update password
  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (!error) {
        toast.success('Password updated successfully');
      }
      
      return { error };
    } catch (error: any) {
      console.error('Password update error:', error.message);
      toast.error(`Failed to update password: ${error.message}`);
      return { error };
    }
  };

  // Memoizing the context value to prevent unnecessary re-renders
  const value = {
    isLoggedIn: !!user,
    isLoading: isLoading || isProfileLoading,
    error,
    session,
    user,
    profile,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    sendPasswordReset,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}
