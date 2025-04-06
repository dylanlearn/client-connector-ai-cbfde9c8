
import { ReactNode, useEffect, useRef } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export interface ProtectedRouteProps {
  children?: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
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
      }, 3000); // 3 second timeout (reduced from 5s for better UX)
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

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
