
import { ReactNode, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Permission } from "@/utils/authorization/auth-service";
import { useAdminStatus } from '@/hooks/use-admin-status';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export interface AdminRouteProps {
  children?: ReactNode;
  redirectTo?: string;
}

/**
 * Route component that ensures only admin users can access
 */
const AdminRoute = ({ children, redirectTo = "/dashboard" }: AdminRouteProps) => {
  const { isAdmin, isVerifying } = useAdminStatus();
  
  // Show loading while verifying admin status
  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
        <p className="ml-2 text-gray-600">Verifying admin access...</p>
      </div>
    );
  }
  
  // Redirect if not admin
  if (!isAdmin) {
    console.log("Access denied: User is not an admin");
    return <Navigate to={redirectTo} replace />;
  }
  
  // User is admin, allow access
  return children ? children : <Outlet />;
};

export default AdminRoute;
