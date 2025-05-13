
import { createContext, useState, useEffect, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/utils/auth-utils";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, name?: string, phoneNumber?: string) => Promise<void>;
  supabase: typeof supabase;
}

export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
  signInWithGoogle: async () => {},
  signUp: async () => {},
  supabase,
});

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to clean up auth state
const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user profile when user changes
  useEffect(() => {
    async function fetchUserProfile(userId: string) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }
        
        setProfile(data as UserProfile);
      } catch (error) {
        console.error("Exception when fetching profile:", error);
      }
    }
    
    if (user) {
      // Use setTimeout to avoid potential deadlocks
      setTimeout(() => {
        fetchUserProfile(user.id);
      }, 0);
    } else {
      setProfile(null);
    }
  }, [user]);

  useEffect(() => {
    // Handle auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state change event:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      // Try global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (error) {
        // Continue even if global sign out fails
      }
      
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      
      // Show success toast
      toast({
        title: "Login successful",
        description: "You have been logged in successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "An unknown error occurred",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Clean up auth state first
      cleanupAuthState();
      
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) throw error;
      
      // Force page reload for clean state
      window.location.href = '/login';
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      // Try global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (error) {
        // Continue even if global sign out fails
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw error;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Google login failed",
        description: error instanceof Error ? error.message : "Failed to login with Google",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name?: string, phoneNumber?: string) => {
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      // Try global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (error) {
        // Continue even if global sign out fails
      }
      
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone_number: phoneNumber,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw error;
      
      // Show success toast
      toast({
        title: "Registration successful",
        description: "Your account has been created. Please check your email for verification.",
      });
      
      return data;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Failed to create account",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user,
      profile,
      isLoading,
      signIn,
      signOut,
      signInWithGoogle,
      signUp,
      supabase,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
