
import { createContext, useState, useEffect, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/utils/auth-utils";

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

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      fetchUserProfile(user.id);
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
    const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, name?: string, phoneNumber?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone_number: phoneNumber,
        },
      }
    });
    if (error) throw error;
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
