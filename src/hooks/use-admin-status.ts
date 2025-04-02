
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
      
      console.log("Starting admin verification for user:", user.id);
      console.log("User email:", user.email);
      console.log("User metadata:", user.user_metadata);
      
      // First check profile from context for performance
      if (profile?.role === 'admin') {
        console.log("Admin status verified from profile role");
        setIsAdmin(true);
        setLastVerified(now);
        return true;
      }
      
      // Check for admin for Google login based on email
      const userEmail = user.email || profile?.email || user.user_metadata?.email;
      const adminEmails = ["dylanmohseni0@gmail.com"]; // Add your admin emails here
      
      if (userEmail && adminEmails.includes(userEmail.toLowerCase())) {
        console.log("Admin status verified from email match:", userEmail);
        
        // Update the user's profile to have admin role for future sessions
        try {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', user.id);
            
          if (updateError) {
            console.error("Error updating profile to admin:", updateError);
          } else {
            console.log("Successfully updated profile to admin role");
          }
        } catch (updateError) {
          console.error("Exception updating profile to admin:", updateError);
        }
        
        setIsAdmin(true);
        setLastVerified(now);
        return true;
      }
      
      // Double-check with a direct database query as a reliable fallback
      console.log("Verifying admin status with database query");
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, email')
        .eq('id', user.id)
        .single();
        
      console.log("Profile query result:", { profileData, profileError });
      
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
  }, [user, profile, isAdmin, lastVerified]);
  
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
