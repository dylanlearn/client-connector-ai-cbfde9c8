
import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '@/types/enterprise-auth';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isLoggedIn?: boolean; // Add isLoggedIn property
  signOut?: () => Promise<void>;
  signIn?: (email: string, password: string) => Promise<void>; // Add signIn property
  signInWithGoogle?: () => Promise<void>; // Add signInWithGoogle property
}

export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Track if component is mounted
    let isMounted = true;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state change event:", event);
        if (isMounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        }
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (isMounted) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
      }
    });

    // Clean up function
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []); 

  // Load profile data when user changes
  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!user) {
        setProfile(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (isMounted) {
          setProfile(data as UserProfile);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        // Don't set profile to null here to prevent losing data
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'Failed to sign in');
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      toast.error(error.message || 'Failed to sign in with Google');
      throw error;
    }
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    isLoggedIn: !!user,
    signOut,
    signIn,
    signInWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
