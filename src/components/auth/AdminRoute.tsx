
import { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

export interface AdminRouteProps {
  children?: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, profile } = useAuth();
  
  // Check if the user is logged in and has an admin role
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has admin privileges
  if (profile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default AdminRoute;
