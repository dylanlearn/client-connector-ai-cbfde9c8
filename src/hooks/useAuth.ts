
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

// This hook provides canonical authentication state/actions from Supabase.
// Always use this everywhere in the app!
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider.");
  
  return {
    ...ctx,
    // Adding convenient error and loading fields for compatibility
    // (If needed for form handling; otherwise these can be removed)
    error: undefined,
    isLoggedIn: !!ctx.user,
    signUp: async (email: string, password: string, name?: string, phoneNumber?: string) => {
      try {
        const { error } = await ctx.supabase.auth.signUp({
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
        return true;
      } catch (error) {
        console.error("Error signing up:", error);
        return false;
      }
    }
  };
}
