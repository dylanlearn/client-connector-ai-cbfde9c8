
import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';

export function useAdminStatus() {
  const { profile } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);

  useEffect(() => {
    // Check if user has admin role
    const adminCheck = profile?.role === 'admin';
    setIsAdmin(adminCheck);
    setIsVerifying(false);
    
    if (adminCheck) {
      console.info('Admin status verified from auth profile');
    }
  }, [profile]);

  // Added a function to verify admin status if needed
  const verifyAdminStatus = async () => {
    setIsVerifying(true);
    try {
      // In a real app, this might make an API call to verify admin status
      // For now, we'll just use the profile check
      const adminCheck = profile?.role === 'admin';
      setIsAdmin(adminCheck);
    } catch (error) {
      console.error("Error verifying admin status:", error);
      setIsAdmin(false);
    } finally {
      setIsVerifying(false);
    }
  };

  return { isAdmin, isVerifying, verifyAdminStatus };
}
