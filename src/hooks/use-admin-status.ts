
import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';

// Admin emails that should always be recognized
const ADMIN_EMAILS = [
  'dylanmohseni0@gmail.com',
  'admin@example.com'
];

export function useAdminStatus() {
  const { profile, user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);

  useEffect(() => {
    // Check if user has admin role or is an admin email
    const checkAdminStatus = () => {
      console.log("Checking admin status with:", { profile, user });
      
      // Consider both profile role and admin email list
      const adminCheck = 
        profile?.role === 'admin' || 
        (user?.email && ADMIN_EMAILS.includes(user.email));
      
      console.log("Admin check result:", adminCheck, {
        profileCheck: profile?.role === 'admin',
        emailCheck: user?.email && ADMIN_EMAILS.includes(user.email),
        email: user?.email
      });
      
      setIsAdmin(adminCheck);
      setIsVerifying(false);
    };
    
    checkAdminStatus();
  }, [profile, user]);

  // Added a function to verify admin status if needed
  const verifyAdminStatus = async () => {
    setIsVerifying(true);
    try {
      // In a real app, this might make an API call to verify admin status
      // For now, we'll use the profile check and email check
      const adminCheck = 
        profile?.role === 'admin' || 
        (user?.email && ADMIN_EMAILS.includes(user.email));
      
      setIsAdmin(adminCheck);
      console.log('Admin verification complete:', {
        isAdmin: adminCheck,
        method: profile?.role === 'admin' ? 'profile' : 'email',
        email: user?.email,
        adminEmails: ADMIN_EMAILS
      });
    } catch (error) {
      console.error("Error verifying admin status:", error);
      setIsAdmin(false);
    } finally {
      setIsVerifying(false);
    }
  };

  return { isAdmin, isVerifying, verifyAdminStatus };
}
