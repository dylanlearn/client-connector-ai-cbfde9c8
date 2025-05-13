
import { ReactNode, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export interface ProtectedRouteProps {
  children?: ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { user, isLoading, profile } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
        <p className="ml-2 text-gray-600">Loading your account...</p>
      </div>
    );
  }
  
  // If not authenticated, redirect to login with return path
  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // For admin-only routes, check if user is admin
  if (adminOnly) {
    const isAdmin = profile?.role === 'admin';
    const isAdminEmail = user.email && ['dylanmohseni0@gmail.com', 'admin@example.com'].includes(user.email);
    
    if (!isAdmin && !isAdminEmail) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // User is authenticated (and is admin if adminOnly=true)
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
