
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to check and verify admin status through multiple paths
 */
export const useAdminStatus = () => {
  const { user, profile } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [lastVerified, setLastVerified] = useState<number | null>(null);

  /**
   * Verify admin status with a direct database query
   * This provides a reliable fallback if the profile data is not correctly synchronized
   */
  const verifyAdminStatus = useCallback(async (forceCheck = false) => {
    // Don't proceed if no user is logged in
    if (!user) {
      setIsAdmin(false);
      return false;
    }
    
    // Skip verification if we've checked recently (10 seconds) and not forcing
    const now = Date.now();
    if (!forceCheck && lastVerified && (now - lastVerified < 10000)) {
      return isAdmin;
    }
    
    try {
      setIsVerifying(true);
      
      // First check profile from context for performance
      if (profile?.role === 'admin') {
        console.log("Admin status verified from profile");
        setIsAdmin(true);
        setLastVerified(now);
        return true;
      }
      
      // Double-check with a direct database query as a reliable fallback
      console.log("Verifying admin status with database query");
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (!profileError && profileData?.role === 'admin') {
        console.log("Admin status verified from database");
        setIsAdmin(true);
        setLastVerified(now);
        return true;
      }
      
      // If we reach here, user is not an admin
      console.log("User is not an admin");
      setIsAdmin(false);
      setLastVerified(now);
      return false;
    } catch (error) {
      console.error("Error verifying admin status:", error);
      // Don't change admin status on error to prevent lockouts
      return isAdmin;
    } finally {
      setIsVerifying(false);
    }
  }, [user?.id, profile?.role, isAdmin, lastVerified]);
  
  // Verify admin status on mount and when user/profile changes
  useEffect(() => {
    if (user) {
      verifyAdminStatus();
    } else {
      setIsAdmin(false);
    }
  }, [user?.id, profile?.role, verifyAdminStatus]);
  
  return {
    isAdmin,
    isVerifying,
    verifyAdminStatus
  };
};
