
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

// This hook provides canonical authentication state/actions from Supabase.
// Always use this everywhere in the app!
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider.");
  // Adding convenient error and loading fields for compatibility
  // (If needed for form handling; otherwise these can be removed)
  return {
    ...ctx,
    // NOTE: ctx isLoading is already present; error handling is passed via thrown errors
    error: undefined,
    isLoggedIn: !!ctx.user,
  };
}
