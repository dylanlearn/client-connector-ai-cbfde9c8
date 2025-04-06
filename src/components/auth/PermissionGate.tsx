
import { ReactNode } from "react";
import { useAuthorization } from "@/hooks/use-authorization";
import { Permission } from "@/utils/authorization/auth-service";

interface PermissionGateProps {
  permission?: Permission | Permission[];
  isAdmin?: boolean;
  hasPaidSubscription?: boolean;
  requireAll?: boolean; // Only used when permission is an array
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component that conditionally renders its children based on user permissions
 * Use this for UI elements that should only be shown to users with specific permissions
 */
const PermissionGate = ({
  permission,
  isAdmin = false,
  hasPaidSubscription = false,
  requireAll = false,
  children,
  fallback = null
}: PermissionGateProps) => {
  const auth = useAuthorization();
  
  // Check admin status if required
  if (isAdmin && !auth.isAdmin()) {
    return <>{fallback}</>;
  }
  
  // Check subscription status if required
  if (hasPaidSubscription && !auth.hasPaidSubscription()) {
    return <>{fallback}</>;
  }
  
  // Check specific permission(s)
  if (permission) {
    let hasPermission = false;
    
    if (Array.isArray(permission)) {
      hasPermission = requireAll 
        ? auth.canAll(permission)
        : auth.canAny(permission);
    } else {
      hasPermission = auth.can(permission);
    }
    
    if (!hasPermission) {
      return <>{fallback}</>;
    }
  }
  
  // All checks passed, render children
  return <>{children}</>;
};

export default PermissionGate;
