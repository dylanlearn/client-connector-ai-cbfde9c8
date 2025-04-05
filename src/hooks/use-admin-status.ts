
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { toast } from "./use-toast";

export const useAdminStatus = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(true); // Add isVerifying state

  // Function to verify admin status directly from the database
  const verifyAdminStatus = async (force = false) => {
    if (!user?.id) {
      setIsAdmin(false);
      setIsVerifying(false); // Update verification state
      return false;
    }

    try {
      setIsVerifying(true); // Set verifying state to true during verification
      console.log("Profile query starting for user:", user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role, email')
        .eq('id', user.id)
        .single();
      
      console.log("Profile query result:", { profileData: data, profileError: error });
      
      if (error) {
        console.error("Error checking admin status:", error);
        setIsVerifying(false); // Update verification state
        return false;
      }
      
      const adminStatus = data?.role === 'admin';
      
      if (force) {
        console.log("Admin status verified from database");
        setIsAdmin(adminStatus);
      }
      
      setIsVerifying(false); // Update verification state
      return adminStatus;
    } catch (err) {
      console.error("Error in verifyAdminStatus:", err);
      setIsVerifying(false); // Update verification state
      return false;
    }
  };

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user?.id) {
        setIsVerifying(true); // Set verifying to true at the beginning
        console.log("Starting admin verification for user:", user.id);
        console.log("User email:", user.email);
        console.log("User metadata:", user.user_metadata);
        
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
