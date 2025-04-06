
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
  phone_number: string | null;
  subscription_status: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  // Memoize fetch profile for performance
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      setIsProfileLoading(true);
      
      // Check local storage cache first
      const cachedProfile = localStorage.getItem(`profile-${userId}`);
      const cachedTime = localStorage.getItem(`profile-${userId}-time`);
      
      // Use cache if it's less than 5 minutes old
      if (cachedProfile && cachedTime) {
        const parsedTime = parseInt(cachedTime, 10);
        if (Date.now() - parsedTime < 5 * 60 * 1000) {
          setProfile(JSON.parse(cachedProfile));
          setIsProfileLoading(false);
          return;
        }
      }
      
      // Fetch from API if no valid cache
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        setProfile(data as UserProfile);
        
        // Update cache
        localStorage.setItem(`profile-${userId}`, JSON.stringify(data));
        localStorage.setItem(`profile-${userId}-time`, Date.now().toString());
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    } finally {
      setIsProfileLoading(false);
    }
  }, []);

  // SignIn function
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  };

  // SignOut function
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear cached profile on logout
    if (user?.id) {
      localStorage.removeItem(`profile-${user.id}`);
      localStorage.removeItem(`profile-${user.id}-time`);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    });
    
    if (error) throw error;
    return data;
  };

  // Initialize auth state
  useEffect(() => {
    setIsLoading(true);
    
    // Set up auth changes listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state change:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Do NOT fetch profile in the listener directly to avoid potential deadlocks
        // Instead, use setTimeout to defer it
        if (currentSession?.user) {
          setTimeout(() => {
            fetchProfile(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );
    
    // Then check current session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  return {
    user,
    session,
    profile,
    isLoading: isLoading || isProfileLoading,
    signIn,
    signOut,
    signInWithGoogle
  };
}
