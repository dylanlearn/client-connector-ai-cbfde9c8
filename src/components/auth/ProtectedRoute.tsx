
import { ReactNode, useEffect, useRef } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export interface ProtectedRouteProps {
  children?: ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { user, isLoading, profile } = useAuth();
  const location = useLocation();
  const timeoutRef = useRef<number | null>(null);

  // Add a timeout to prevent infinite loading states
  useEffect(() => {
    // Clear previous timeout if it exists
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (isLoading) {
      timeoutRef.current = window.setTimeout(() => {
        console.warn('Authentication check is taking too long, redirecting to login');
        // This will force a redirect to login if auth check takes too long
        if (!user) {
          window.location.href = `/login?redirect=${encodeURIComponent(location.pathname)}`;
        }
      }, 3000); // 3 second timeout
    }
    
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isLoading, location.pathname, user]);

  // Debug logs for admin access
  useEffect(() => {
    if (adminOnly) {
      console.log('AdminOnly route access attempt:', { 
        isLoading, 
        userExists: !!user, 
        profile, 
        userEmail: user?.email,
        userRole: profile?.role,
        adminEmails: ['dylanmohseni0@gmail.com', 'admin@example.com']
      });
    }
  }, [adminOnly, isLoading, user, profile]);

  // Show loading state if auth is still being checked
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
        <p className="ml-2 text-gray-600">Loading your account...</p>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // For admin routes, check if user has admin role or is in admin email list
  if (adminOnly) {
    // Force debug output to help diagnose the issue
    console.log('Admin access check:', {
      email: user.email,
      role: profile?.role,
      isAdminByRole: profile?.role === 'admin',
      isAdminByEmail: user.email && ['dylanmohseni0@gmail.com', 'admin@example.com'].includes(user.email)
    });
    
    const isAdmin = profile?.role === 'admin';
    const isAdminEmail = user.email && ['dylanmohseni0@gmail.com', 'admin@example.com'].includes(user.email);
    
    if (!isAdmin && !isAdminEmail) {
      console.log('Non-admin user tried to access admin route:', {
        role: profile?.role,
        email: user.email,
        isAdminByEmail: isAdminEmail
      });
      return <Navigate to="/dashboard" replace />;
    }
    
    // User is confirmed admin, proceed
    console.log('Admin access granted to', user.email);
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
