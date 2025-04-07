
import { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Permission } from "@/utils/authorization/auth-service";
import RequirePermission from './RequirePermission';
import { useAdminStatus } from '@/hooks/use-admin-status';

export interface AdminRouteProps {
  children?: ReactNode;
}

/**
 * Route component that ensures only admin users can access
 */
const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAdmin } = useAdminStatus();
  
  return (
    <RequirePermission permission={Permission.VIEW_ADMIN_PANEL} redirectTo="/dashboard">
      {children ? children : <Outlet />}
    </RequirePermission>
  );
};

export default AdminRoute;
