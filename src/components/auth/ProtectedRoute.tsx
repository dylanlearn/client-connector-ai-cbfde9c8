
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
  
  // For admin routes, check if user has admin role
  if (adminOnly && profile?.role !== 'admin') {
    console.log('Non-admin user tried to access admin route:', profile?.role);
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
