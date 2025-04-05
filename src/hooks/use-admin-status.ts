
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { toast } from "sonner";
import { logClientError } from "@/utils/monitoring/client-error-logger";
import { checkAdminStatus } from "@/utils/auth-utils";

export const useAdminStatus = () => {
  const { user, profile: authProfile } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVerifying, setIsVerifying] = useState<boolean>(true); 
  const lastVerifiedRef = useRef<Date | null>(null);
  const verificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to verify admin status with improved caching
  const verifyAdminStatus = useCallback(async (force = false) => {
    // Skip if no user
    if (!user?.id) {
      setIsAdmin(false);
      setIsVerifying(false);
      return false;
    }

    // Skip verification if we've checked recently (unless forced)
    if (!force && lastVerifiedRef.current && 
        (new Date().getTime() - lastVerifiedRef.current.getTime() < 60000)) {
      console.log("Skipping admin verification - checked recently");
      return isAdmin;
    }

    try {
      setIsVerifying(true);
      
      // Direct check from auth profile (most reliable and already cached)
      if (authProfile?.role === 'admin') {
        console.log("Admin status verified from auth profile");
        setIsAdmin(true);
        lastVerifiedRef.current = new Date();
        setIsVerifying(false);
        return true;
      }
      
      // Double-check with cached database query
      const isUserAdmin = await checkAdminStatus(user.id);
      
      if (force || isAdmin !== isUserAdmin) {
        console.log("Admin status verified from database, updating state:", isUserAdmin);
        setIsAdmin(isUserAdmin);
      }
      
      lastVerifiedRef.current = new Date();
      setIsVerifying(false);
      return isUserAdmin;
    } catch (err) {
      console.error("Error in verifyAdminStatus:", err);
      setIsVerifying(false);
      return false;
    }
  }, [user?.id, isAdmin, authProfile?.role]);

  // Debounced verification to avoid too many calls
  const debouncedVerifyAdminStatus = useCallback((force = false) => {
    // Clear any existing timeout
    if (verificationTimeoutRef.current) {
      clearTimeout(verificationTimeoutRef.current);
    }
    
    // Set a new timeout
    verificationTimeoutRef.current = setTimeout(() => {
      verifyAdminStatus(force);
    }, 100); // 100ms debounce
  }, [verifyAdminStatus]);

  // Initial admin status check
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user?.id) {
        setIsVerifying(true);
        
        // First check: Direct from profile (already cached)
        if (authProfile?.role === 'admin') {
          console.log("Admin status verified from auth profile");
          setIsAdmin(true);
          setIsLoading(false);
          setIsVerifying(false);
          lastVerifiedRef.current = new Date();
          return;
        }

        // Second check: From app_metadata (if available)
        if (user.app_metadata?.role === 'admin') {
          console.log("Admin status verified from app metadata");
          setIsAdmin(true);
          setIsLoading(false);
          setIsVerifying(false);
          lastVerifiedRef.current = new Date();
          return;
        }
        
        // Third check: Verify from database with the cached function
        try {
          await verifyAdminStatus(true);
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
    
    // Cleanup function
    return () => {
      if (verificationTimeoutRef.current) {
        clearTimeout(verificationTimeoutRef.current);
      }
    };
  }, [user?.id, authProfile, verifyAdminStatus]);

  // Re-verify when profile changes
  useEffect(() => {
    if (authProfile && user) {
      if (authProfile.role === 'admin' && !isAdmin) {
        console.log("Admin role detected in profile, updating admin status");
        setIsAdmin(true);
        lastVerifiedRef.current = new Date();
      }
    }
  }, [authProfile, user, isAdmin]);

  return { 
    isAdmin, 
    isLoading, 
    isVerifying, 
    verifyAdminStatus: debouncedVerifyAdminStatus 
  };
};
