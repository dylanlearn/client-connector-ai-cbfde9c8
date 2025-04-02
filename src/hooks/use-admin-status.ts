
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to check and verify admin status
 */
export const useAdminStatus = () => {
  const { user, profile } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  /**
   * Verify admin status with a direct database query
   */
  const verifyAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      return false;
    }
    
    try {
      setIsVerifying(true);
      
      // First check profile from context
      if (profile?.role === 'admin') {
        setIsAdmin(true);
        setIsVerifying(false);
        return true;
      }
      
      // Double-check with a direct database query
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (!profileError && profileData?.role === 'admin') {
        setIsAdmin(true);
        setIsVerifying(false);
        return true;
      }
      
      setIsAdmin(false);
      return false;
    } catch (error) {
      console.error("Error verifying admin status:", error);
      setIsAdmin(false);
      return false;
    } finally {
      setIsVerifying(false);
    }
  };
  
  // Check admin status on mount and when user/profile changes
  useEffect(() => {
    if (user) {
      verifyAdminStatus();
    } else {
      setIsAdmin(false);
    }
  }, [user?.id, profile?.role]);
  
  return {
    isAdmin,
    isVerifying,
    verifyAdminStatus
  };
};
