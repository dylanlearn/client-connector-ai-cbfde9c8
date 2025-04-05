
import { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminStatus } from '@/hooks/use-admin-status';
import { useAuth } from '@/hooks/use-auth';

interface AdminRouteProps {
  children?: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user } = useAuth();
  const { isAdmin } = useAdminStatus();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/settings" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default AdminRoute;
