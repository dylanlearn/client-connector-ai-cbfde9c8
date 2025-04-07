
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
      console.log("Checking admin status with:", { 
        profile, 
        user,
        profileRole: profile?.role,
        userEmail: user?.email,
        adminEmails: ADMIN_EMAILS 
      });
      
      // Consider both profile role and admin email list
      const adminByRole = profile?.role === 'admin';
      const adminByEmail = user?.email && ADMIN_EMAILS.includes(user.email);
      const adminCheck = adminByRole || adminByEmail;
      
      console.log("Admin check results:", { 
        adminByRole,
        adminByEmail,
        isAdmin: adminCheck,
        email: user?.email
      });
      
      setIsAdmin(adminCheck);
      setIsVerifying(false);
    };
    
    // Short delay to ensure profile is loaded
    const timer = setTimeout(() => {
      checkAdminStatus();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [profile, user]);

  // Added a function to verify admin status if needed
  const verifyAdminStatus = async () => {
    setIsVerifying(true);
    try {
      // In a real app, this might make an API call to verify admin status
      // For now, we'll use the profile check and email check
      const adminByRole = profile?.role === 'admin';
      const adminByEmail = user?.email && ADMIN_EMAILS.includes(user.email);
      const adminCheck = adminByRole || adminByEmail;
      
      setIsAdmin(adminCheck);
      console.log('Admin verification complete:', {
        isAdmin: adminCheck,
        method: adminByRole ? 'profile role' : (adminByEmail ? 'admin email' : 'none'),
        role: profile?.role,
        email: user?.email
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
