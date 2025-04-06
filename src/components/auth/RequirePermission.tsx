
import { ReactNode } from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { Permission } from "@/utils/authorization/auth-service";
import { useAuthorization } from "@/hooks/use-authorization"; 
import { useAuth } from "@/hooks/use-auth";
import LoadingIndicator from "@/components/ui/LoadingIndicator";

interface RequirePermissionProps {
  permission: Permission | Permission[];
  children: ReactNode;
  redirectTo?: string;
  requireAll?: boolean; // If true, user must have ALL permissions in the array
}

/**
 * Component that checks if user has the required permission(s)
 * If permission is an array, it will check if user has any of the permissions by default
 * Set requireAll to true to check if user has all permissions
 */
const RequirePermission = ({ 
  permission,
  children,
  redirectTo = "/dashboard",
  requireAll = false
}: RequirePermissionProps) => {
  const { isLoading, user } = useAuth();
  const { can, canAll, canAny } = useAuthorization();
  const location = useLocation();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingIndicator size="lg" />
      </div>
    );
  }
  
  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Check permission(s)
  let hasPermission = false;
  
  if (Array.isArray(permission)) {
    hasPermission = requireAll ? canAll(permission) : canAny(permission);
  } else {
    hasPermission = can(permission);
  }
  
  // If user doesn't have permission, redirect
  if (!hasPermission) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }
  
  // Render children if user has permission
  return <>{children}</>;
};

export default RequirePermission;
