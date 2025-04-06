
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { AuthorizationService, Permission } from "@/utils/authorization/auth-service";
import { AuthApiService } from "@/utils/authorization/auth-api-service";

/**
 * Hook for checking user permissions in components
 * @param useApi Whether to use the API service to fetch permissions (defaults to false for client-side checks)
 */
export function useAuthorization(useApi = false) {
  const { user, profile } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(useApi);

  // Fetch permissions from API if useApi is true
  useEffect(() => {
    if (useApi && user?.id) {
      setIsLoading(true);
      AuthApiService.fetchUserPermissions(user.id)
        .then(fetchedPermissions => {
          setPermissions(fetchedPermissions);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (!useApi) {
      // Use client-side permission checks
      setPermissions(AuthorizationService.getUserPermissions(user, profile));
    }
  }, [user, profile, useApi]);

  return {
    /**
     * Check if the current user has a specific permission
     */
    can: (permission: Permission) => 
      !useApi 
        ? AuthorizationService.hasPermission(permission, user, profile)
        : permissions.includes(permission),
    
    /**
     * Check if the current user has any of the given permissions
     */
    canAny: (checkPermissions: Permission[]) => 
      !useApi
        ? AuthorizationService.hasAnyPermission(checkPermissions, user, profile)
        : checkPermissions.some(p => permissions.includes(p)),
    
    /**
     * Check if the current user has all of the given permissions
     */
    canAll: (checkPermissions: Permission[]) => 
      !useApi
        ? AuthorizationService.hasAllPermissions(checkPermissions, user, profile)
        : checkPermissions.every(p => permissions.includes(p)),
    
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
    permissions: useApi ? permissions : AuthorizationService.getUserPermissions(user, profile),
    
    /**
     * Loading state when fetching permissions from API
     */
    isLoading
  };
}
