
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
    error: undefined,
    isLoggedIn: !!ctx.user,
  };
}
