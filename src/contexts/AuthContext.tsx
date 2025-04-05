
import { createContext, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useAuthState } from "@/hooks/use-auth-state";
import { useAuthActions } from "@/hooks/use-auth-actions";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, name: string, phoneNumber: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { session, user, profile, isLoading: stateLoading, setProfile } = useAuthState();
  const { signIn, signInWithGoogle, signUp, signOut, isLoading: actionLoading } = useAuthActions(setProfile);
  
  const isLoading = stateLoading || actionLoading;

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        signIn,
        signInWithGoogle,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Removing the duplicate useAuth hook definition from here
// as it's now properly defined in src/hooks/use-auth.ts
