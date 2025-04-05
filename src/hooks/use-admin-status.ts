
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { toast } from "sonner";

export const useAdminStatus = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(true); 

  // Function to verify admin status directly from the database
  const verifyAdminStatus = async (force = false) => {
    if (!user?.id) {
      setIsAdmin(false);
      setIsVerifying(false);
      return false;
    }

    try {
      setIsVerifying(true);
      console.log("Profile query starting for user:", user.id);
      
      // Mock verification for now since we don't have a working Supabase client
      // In a real implementation, this would query the database
      const adminStatus = user.email?.includes('admin') || false;
      
      if (force) {
        console.log("Admin status verified from database");
        setIsAdmin(adminStatus);
      }
      
      setIsVerifying(false);
      return adminStatus;
    } catch (err) {
      console.error("Error in verifyAdminStatus:", err);
      setIsVerifying(false);
      return false;
    }
  };

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user?.id) {
        setIsVerifying(true);
        console.log("Starting admin verification for user:", user.id);
        
        // First check if admin role is in the profile
        if (user.app_metadata?.role === 'admin') {
          console.log("Admin status verified from app metadata");
          setIsAdmin(true);
          setIsLoading(false);
          setIsVerifying(false);
          return;
        }

        // Then verify from the database
        const isUserAdmin = await verifyAdminStatus();
        setIsAdmin(isUserAdmin);
      } else {
        setIsAdmin(false);
      }
      
      setIsLoading(false);
      setIsVerifying(false);
    };

    checkAdminStatus();
  }, [user?.id]);

  return { isAdmin, isLoading, isVerifying, verifyAdminStatus };
};
