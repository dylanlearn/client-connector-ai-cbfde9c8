
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

/**
 * Hook to access the authentication context
 * Always use this throughout the app for consistent auth state management
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return {
    ...context,
    // Adding convenient derived properties
    isLoggedIn: !!context.user,
    error: undefined, // For compatibility with old implementations
  };
}
