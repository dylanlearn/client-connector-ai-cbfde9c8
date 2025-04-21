
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export function useAdminStatus() {
  const { user, profile } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Define admin emails
  const adminEmails = ['dylanmohseni0@gmail.com', 'admin@example.com', 'dmohsen@purdue.edu'];
  
  useEffect(() => {
    // Check if user is admin via profile role
    const adminByRole = profile?.role === 'admin';
    
    // Check if user is admin via email
    const adminByEmail = user?.email ? adminEmails.includes(user.email) : false;
    
    // User is admin if either check passes
    const isAdminUser = adminByRole || adminByEmail;
    
    console.log('Admin check results:', {
      adminByRole,
      adminByEmail,
      isAdmin: isAdminUser,
      email: user?.email
    });
    
    setIsAdmin(isAdminUser);
  }, [user, profile]);
  
  return { isAdmin };
}
