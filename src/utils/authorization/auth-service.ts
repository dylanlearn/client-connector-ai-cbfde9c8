
/**
 * Enum for application permissions
 */
export enum Permission {
  VIEW_DASHBOARD = 'VIEW_DASHBOARD',
  MANAGE_PROJECTS = 'MANAGE_PROJECTS',
  EDIT_PROFILE = 'EDIT_PROFILE',
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  MANAGE_USERS = 'MANAGE_USERS',
  VIEW_ADMIN_PANEL = 'VIEW_ADMIN_PANEL',
  ACCESS_PREMIUM_FEATURES = 'ACCESS_PREMIUM_FEATURES'
}

/**
 * Types of users in the application
 */
export type UserRole = 'admin' | 'sync-pro' | 'sync' | 'trial' | 'free' | 'template-buyer';

/**
 * Service for authorization-related operations
 */
export const AuthorizationService = {
  /**
   * Check if user has a specific permission
   */
  hasPermission: (permission: Permission, user: any | null, profile: any | null): boolean => {
    if (!user || !profile) return false;
    
    // Check if user is admin (admins have all permissions)
    if (profile.role === 'admin') return true;

    // For specific roles, we have hardcoded permissions until we implement
    // a database-backed permission system
    switch (permission) {
      case Permission.VIEW_DASHBOARD:
        return true; // All authenticated users can view dashboard
        
      case Permission.MANAGE_PROJECTS:
        return ['sync-pro', 'sync', 'trial'].includes(profile.role);
        
      case Permission.EDIT_PROFILE:
        return true; // All authenticated users can edit their profile
        
      case Permission.VIEW_ANALYTICS:
        return ['sync-pro', 'sync'].includes(profile.role);
        
      case Permission.MANAGE_USERS:
        return profile.role === 'admin';
        
      case Permission.VIEW_ADMIN_PANEL:
        return profile.role === 'admin';
        
      case Permission.ACCESS_PREMIUM_FEATURES:
        return ['sync-pro', 'admin'].includes(profile.role);
        
      default:
        return false;
    }
  },
  
  /**
   * Check if user has any of the given permissions
   */
  hasAnyPermission: (permissions: Permission[], user: any | null, profile: any | null): boolean => {
    if (!permissions.length) return false;
    return permissions.some(permission => 
      AuthorizationService.hasPermission(permission, user, profile)
    );
  },
  
  /**
   * Check if user has all of the given permissions
   */
  hasAllPermissions: (permissions: Permission[], user: any | null, profile: any | null): boolean => {
    if (!permissions.length) return false;
    return permissions.every(permission => 
      AuthorizationService.hasPermission(permission, user, profile)
    );
  },
  
  /**
   * Check if user is admin
   */
  isAdmin: (user: any | null, profile: any | null): boolean => {
    return !!profile && profile.role === 'admin';
  },
  
  /**
   * Check if user has an active paid subscription
   */
  hasPaidSubscription: (user: any | null, profile: any | null): boolean => {
    return !!profile && (
      profile.role === 'admin' || 
      profile.role === 'sync-pro' || 
      profile.role === 'sync'
    );
  },
  
  /**
   * Get all permissions for a user
   */
  getUserPermissions: (user: any | null, profile: any | null): Permission[] => {
    if (!user || !profile) return [];
    
    const permissions: Permission[] = [];
    
    // Add permissions based on user role
    if (profile.role === 'admin') {
      // Admins have all permissions
      return Object.values(Permission);
    }
    
    // Add basic permissions for all authenticated users
    permissions.push(Permission.VIEW_DASHBOARD);
    permissions.push(Permission.EDIT_PROFILE);
    
    // Add role-specific permissions
    if (['sync-pro', 'sync', 'trial'].includes(profile.role)) {
      permissions.push(Permission.MANAGE_PROJECTS);
    }
    
    if (['sync-pro', 'sync'].includes(profile.role)) {
      permissions.push(Permission.VIEW_ANALYTICS);
    }
    
    if (['sync-pro', 'admin'].includes(profile.role)) {
      permissions.push(Permission.ACCESS_PREMIUM_FEATURES);
    }
    
    return permissions;
  }
};
