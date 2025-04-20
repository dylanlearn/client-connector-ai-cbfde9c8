
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile from profiles table
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error.message);
        return null;
      }
      
      return data;
    } catch (err) {
      console.error('Exception when fetching profile:', err);
      return null;
    }
  };

  useEffect(() => {
    // Track if component is mounted
    let isMounted = true;
    
    // Set up listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state change event:", event);
        if (!isMounted) return;
        
        setSession(currentSession);
        
        if (currentSession?.user) {
          setUser(currentSession.user);
          
          // Fetch profile - use setTimeout to avoid potential deadlocks
          setTimeout(async () => {
            if (!isMounted) return;
            const profileData = await fetchProfile(currentSession.user.id);
            if (isMounted && profileData) {
              setProfile(profileData);
            }
          }, 0);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    // Initial session check
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          if (isMounted) setIsLoading(false);
          return;
        }
        
        if (isMounted) {
          setSession(data.session);
          setUser(data.session?.user || null);
          
          if (data.session?.user) {
            const profileData = await fetchProfile(data.session.user.id);
            if (isMounted && profileData) {
              setProfile(profileData);
            }
          }
          
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Session check error:", err);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    checkSession();

    // Clean up function
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error("Login error:", error.message);
        setError(error.message);
        toast.error(error.message);
        setIsLoading(false);
        return false;
      }
      
      toast.success("Successfully logged in");
      return true;
    } catch (err) {
      console.error("Error in signIn:", err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error.message);
        setError(error.message);
        toast.error(error.message);
        setIsLoading(false);
        return false;
      }
      
      toast.success("Successfully logged out");
      return true;
    } catch (err) {
      console.error("Error in signOut:", err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        console.error("Registration error:", error.message);
        setError(error.message);
        toast.error(error.message);
        setIsLoading(false);
        return false;
      }
      
      toast.success("Registration successful! Please check your email for confirmation.");
      return true;
    } catch (err) {
      console.error("Error in signUp:", err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        console.error("Google login error:", error.message);
        setError(error.message);
        toast.error(error.message);
        setIsLoading(false);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error("Error in signInWithGoogle:", err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
      return false;
    }
    // Don't set isLoading to false here as the page will redirect
  };

  return {
    user,
    profile,
    session,
    isLoading,
    error,
    signIn,
    signOut,
    signUp,
    signInWithGoogle,
    isLoggedIn: !!user
  };
};
