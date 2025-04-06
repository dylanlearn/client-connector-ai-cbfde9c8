
import { ReactNode, useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

export interface ProtectedRouteProps {
  children?: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Add a timeout to prevent infinite loading states
  useEffect(() => {
    let timeoutId: number | undefined;
    
    if (isLoading) {
      timeoutId = window.setTimeout(() => {
        console.warn('Authentication check is taking too long, redirecting to login');
        navigate('/login', { state: { from: location.pathname } });
      }, 5000); // 5 second timeout
    }
    
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [isLoading, navigate, location.pathname]);

  // Show loading state if auth is still being checked
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
