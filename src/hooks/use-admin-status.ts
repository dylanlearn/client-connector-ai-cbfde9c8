
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { toast } from "sonner";
import { logClientError } from "@/utils/monitoring/client-error-logger";

export const useAdminStatus = () => {
  const { user, profile: authProfile } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVerifying, setIsVerifying] = useState<boolean>(true); 
  const [lastVerified, setLastVerified] = useState<Date | null>(null);

  // Function to verify admin status directly from the database
  const verifyAdminStatus = useCallback(async (force = false) => {
    // Skip if no user or if we've verified recently (within last minute) and not forcing
    if (!user?.id) {
      setIsAdmin(false);
      setIsVerifying(false);
      return false;
    }

    // Skip verification if we've checked recently (unless forced)
    if (!force && lastVerified && (new Date().getTime() - lastVerified.getTime() < 60000)) {
      console.log("Skipping admin verification - checked recently");
      return isAdmin;
    }

    try {
      setIsVerifying(true);
      console.log("Profile query starting for user:", user.id);
      
      // Direct check from auth profile (most reliable)
      if (authProfile?.role === 'admin') {
        console.log("Admin status verified from auth profile");
        setIsAdmin(true);
        setLastVerified(new Date());
        setIsVerifying(false);
        return true;
      }
      
      // Double-check with database query
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error("Error in verifyAdminStatus database query:", error);
        // Log client error for monitoring
        logClientError(
          `Error verifying admin status: ${error.message}`,
          "useAdminStatus",
          user.id,
          { error, userId: user.id }
        );
        throw error;
      }
      
      const adminStatus = data?.role === 'admin';
      console.log("Admin verification result from database:", { role: data?.role, isAdmin: adminStatus });
      
      if (force || isAdmin !== adminStatus) {
        console.log("Admin status verified from database, updating state:", adminStatus);
        setIsAdmin(adminStatus);
      }
      
      setLastVerified(new Date());
      setIsVerifying(false);
      return adminStatus;
    } catch (err) {
      console.error("Error in verifyAdminStatus:", err);
      setIsVerifying(false);
      return false;
    }
  }, [user?.id, isAdmin, lastVerified, authProfile?.role]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user?.id) {
        setIsVerifying(true);
        
        // First check: Direct from profile
        if (authProfile?.role === 'admin') {
          console.log("Admin status verified from auth profile");
          setIsAdmin(true);
          setIsLoading(false);
          setIsVerifying(false);
          setLastVerified(new Date());
          return;
        }

        // Second check: From app_metadata (if available)
        if (user.app_metadata?.role === 'admin') {
          console.log("Admin status verified from app metadata");
          setIsAdmin(true);
          setIsLoading(false);
          setIsVerifying(false);
          setLastVerified(new Date());
          return;
        }
        
        // Third check: Verify from database
        try {
          const isUserAdmin = await verifyAdminStatus();
          setIsAdmin(isUserAdmin);
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      
      setIsLoading(false);
      setIsVerifying(false);
    };

    checkAdminStatus();
  }, [user?.id, authProfile, verifyAdminStatus]);

  // Re-verify when profile changes
  useEffect(() => {
    if (authProfile && user) {
      if (authProfile.role === 'admin' && !isAdmin) {
        console.log("Admin role detected in profile, updating admin status");
        setIsAdmin(true);
        setLastVerified(new Date());
      }
    }
  }, [authProfile, user, isAdmin]);

  return { isAdmin, isLoading, isVerifying, verifyAdminStatus };
};
