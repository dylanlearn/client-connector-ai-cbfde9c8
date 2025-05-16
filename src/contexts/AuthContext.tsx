
import React, { createContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useProfile } from '@/contexts/ProfileContext';
import { cleanupAuthState } from '@/utils/auth-utils';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string) => Promise<{ error: any | null; data: any | null }>;
  signOut: () => Promise<void>;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any | null }>;
  updatePassword: (password: string) => Promise<{ error: any | null }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { refetchProfile } = useProfile();

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      // Clean up existing auth state to prevent conflicts
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return { error };
      }

      await refetchProfile();
      return { error: null };
    } catch (error) {
      console.error('Unexpected login error:', error);
      return { error };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      // Clean up existing auth state to prevent conflicts
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Signup error:', error);
        return { error, data: null };
      }

      return { error: null, data };
    } catch (error) {
      console.error('Unexpected signup error:', error);
      return { error, data: null };
    }
  };

  // Sign in with Google OAuth
  const signInWithGoogle = async () => {
    try {
      // Clean up existing auth state to prevent conflicts
      cleanupAuthState();
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        console.error('Google sign-in error:', error);
        toast({
          title: "Google sign-in failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Unexpected Google sign-in error:', error);
      toast({
        title: "Authentication error",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      // First, clean up auth state
      cleanupAuthState();
      
      // Then perform the signout
      await supabase.auth.signOut({ scope: 'global' });
      
      // Redirect to login page with a clean slate
      window.location.href = '/login';
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign out failed",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      return { error };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error };
    }
  };

  // Update password
  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      return { error };
    } catch (error) {
      console.error('Update password error:', error);
      return { error };
    }
  };

  // Initialize auth state
  useEffect(() => {
    setLoading(true);
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state change event:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Defer profile fetching to prevent deadlocks
        if (currentSession?.user) {
          setTimeout(() => {
            refetchProfile();
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    // Clean up function
    return () => {
      subscription.unsubscribe();
    };
  }, [refetchProfile]);

  const value = {
    session,
    user,
    signIn,
    signUp,
    signOut,
    loading,
    signInWithGoogle,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
