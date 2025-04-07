
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
    const adminCheck = 
      profile?.role === 'admin' || 
      (user?.email && ADMIN_EMAILS.includes(user.email));
    
    setIsAdmin(adminCheck);
    setIsVerifying(false);
    
    if (adminCheck) {
      console.info('Admin status verified:', {
        fromProfile: profile?.role === 'admin',
        fromEmail: user?.email && ADMIN_EMAILS.includes(user.email),
        email: user?.email
      });
    }
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
