
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Session } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Track if component is mounted
    let isMounted = true;
    
    // Set up listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state change event:", event);
        if (isMounted) {
          setSession(currentSession);
          if (currentSession?.user) {
            setUser({
              id: currentSession.user.id,
              email: currentSession.user.email || '',
              name: currentSession.user.user_metadata?.name
            });
          } else {
            setUser(null);
          }
        }
      }
    );

    // Initial session check
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (isMounted) {
          if (data.session?.user) {
            setUser({
              id: data.session.user.id,
              email: data.session.user.email || '',
              name: data.session.user.user_metadata?.name
            });
            setSession(data.session);
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
        setIsLoading(false);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error("Error in signIn:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsLoading(false);
      return false;
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
        setIsLoading(false);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error("Error in signOut:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsLoading(false);
      return false;
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
        setIsLoading(false);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error("Error in signUp:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsLoading(false);
      return false;
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
        setIsLoading(false);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error("Error in signInWithGoogle:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsLoading(false);
      return false;
    } finally {
      // The page will redirect, so we don't need to set isLoading to false here
    }
  };

  return {
    user,
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
