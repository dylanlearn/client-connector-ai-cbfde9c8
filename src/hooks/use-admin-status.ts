
import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';

export function useAdminStatus() {
  const { profile } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    // Check if user has admin role
    const adminCheck = profile?.role === 'admin';
    setIsAdmin(adminCheck);
    
    if (adminCheck) {
      console.info('Admin status verified from auth profile');
    }
  }, [profile]);

  return { isAdmin };
}
