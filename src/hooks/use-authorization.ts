
import { useAuth } from "@/hooks/use-auth";
import { AuthorizationService, Permission } from "@/utils/authorization/auth-service";

/**
 * Hook for checking user permissions in components
 */
export function useAuthorization() {
  const { user, profile } = useAuth();

  return {
    /**
     * Check if the current user has a specific permission
     */
    can: (permission: Permission) => 
      AuthorizationService.hasPermission(permission, user, profile),
    
    /**
     * Check if the current user has any of the given permissions
     */
    canAny: (permissions: Permission[]) => 
      AuthorizationService.hasAnyPermission(permissions, user, profile),
    
    /**
     * Check if the current user has all of the given permissions
     */
    canAll: (permissions: Permission[]) => 
      AuthorizationService.hasAllPermissions(permissions, user, profile),
    
    /**
     * Check if the current user is an admin
     */
    isAdmin: () => AuthorizationService.isAdmin(user, profile),
    
    /**
     * Check if the current user has a paid subscription
     */
    hasPaidSubscription: () => AuthorizationService.hasPaidSubscription(user, profile),
    
    /**
     * Get all permissions for the current user
     */
    permissions: AuthorizationService.getUserPermissions(user, profile),
  };
}
