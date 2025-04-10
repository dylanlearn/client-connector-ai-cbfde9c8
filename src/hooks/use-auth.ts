
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

// Admin email list - for client-side admin detection
const ADMIN_EMAILS = [
  'dylanmohseni0@gmail.com',
  'admin@example.com',
  // add other admin emails here
];

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  // Check if email is in admin list
  const isAdminEmail = useCallback((email: string | undefined): boolean => {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase());
  }, []);

  // Memoize fetch profile for performance
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      setIsProfileLoading(true);
      console.log('Fetching profile for user:', userId);
      
      // Check local storage cache first
      const cachedProfile = localStorage.getItem(`profile-${userId}`);
      const cachedTime = localStorage.getItem(`profile-${userId}-time`);
      
      // Use cache if it's less than 5 minutes old
      if (cachedProfile && cachedTime) {
        const parsedTime = parseInt(cachedTime, 10);
        if (Date.now() - parsedTime < 5 * 60 * 1000) {
          console.log('Using cached profile');
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
        
        // If we're dealing with the admin email, we can create a temporary profile
        const currentUser = supabase.auth.getUser().then(({data}) => {
          if (data.user && isAdminEmail(data.user.email)) {
            console.log('Admin email detected, creating temporary admin profile');
            const tempAdminProfile: UserProfile = {
              id: data.user.id,
              email: data.user.email || '',
              name: data.user.user_metadata?.name || 'Admin User',
              avatar_url: data.user.user_metadata?.avatar_url || null,
              role: 'admin',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              phone_number: null,
              subscription_status: 'sync-pro'
            };
            setProfile(tempAdminProfile);
            
            // Cache the temporary profile
            localStorage.setItem(`profile-${userId}`, JSON.stringify(tempAdminProfile));
            localStorage.setItem(`profile-${userId}-time`, Date.now().toString());
          }
        });
        return;
      }

      console.log('Profile fetched successfully:', data);
      
      // If this is an admin email but profile doesn't have admin role, override it
      if (data && data.email && isAdminEmail(data.email) && data.role !== 'admin') {
        data.role = 'admin';
        console.log('Overriding profile with admin role for admin email');
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
  }, [isAdminEmail]);

  // SignIn function
  const signIn = async (email: string, password: string) => {
    console.log('Signing in with email:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  };

  // SignOut function
  const signOut = async () => {
    console.log('Signing out');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear cached profile on logout
    if (user?.id) {
      localStorage.removeItem(`profile-${user.id}`);
      localStorage.removeItem(`profile-${user.id}-time`);
    }
    
    // Clear state
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    console.log('Signing in with Google');
    
    // Get the current URL origin (for redirect)
    const origin = window.location.origin;
    const redirectUrl = `${origin}/dashboard`;
    
    console.log('Redirect URL for Google login:', redirectUrl);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    });
    
    if (error) {
      console.error('Google OAuth error:', error);
      throw error;
    }
    
    console.log('Google sign-in initiated:', data);
    return data;
  };

  // Initialize auth state
  useEffect(() => {
    console.log('Setting up auth state');
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
      console.log('Current session:', currentSession ? 'exists' : 'none');
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
        
        // Check if this is an admin email
        if (currentSession.user.email && isAdminEmail(currentSession.user.email)) {
          console.log('Admin email detected during initialization');
        }
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile, isAdminEmail]);

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
