
import { User } from "@supabase/supabase-js";
import { UserProfile, UserRole } from "@/utils/auth-utils";

// Define all permissions in the system
export enum Permission {
  // Content access permissions
  VIEW_DASHBOARD = "view_dashboard",
  VIEW_PROJECTS = "view_projects",
  VIEW_ADMIN_PANEL = "view_admin_panel",
  VIEW_ANALYTICS = "view_analytics",
  
  // Action permissions
  CREATE_PROJECT = "create_project",
  EDIT_PROJECT = "edit_project",
  DELETE_PROJECT = "delete_project",
  MANAGE_USERS = "manage_users",
  ACCESS_API = "access_api",
  USE_AI_FEATURES = "use_ai_features",
}

// Define permission sets for each role
const rolePermissions: Record<UserRole, Permission[]> = {
  'admin': [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_PROJECTS,
    Permission.VIEW_ADMIN_PANEL,
    Permission.VIEW_ANALYTICS,
    Permission.CREATE_PROJECT,
    Permission.EDIT_PROJECT,
    Permission.DELETE_PROJECT,
    Permission.MANAGE_USERS,
    Permission.ACCESS_API,
    Permission.USE_AI_FEATURES,
  ],
  'sync-pro': [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_PROJECTS,
    Permission.VIEW_ANALYTICS,
    Permission.CREATE_PROJECT,
    Permission.EDIT_PROJECT,
    Permission.DELETE_PROJECT,
    Permission.ACCESS_API,
    Permission.USE_AI_FEATURES,
  ],
  'sync': [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_PROJECTS,
    Permission.CREATE_PROJECT,
    Permission.EDIT_PROJECT,
    Permission.DELETE_PROJECT,
    Permission.ACCESS_API,
  ],
  'trial': [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_PROJECTS,
    Permission.CREATE_PROJECT,
    Permission.EDIT_PROJECT,
  ],
  'template-buyer': [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_PROJECTS,
  ],
  'free': [
    Permission.VIEW_DASHBOARD,
  ],
  'pro': [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_PROJECTS,
    Permission.VIEW_ANALYTICS,
    Permission.CREATE_PROJECT,
    Permission.EDIT_PROJECT,
    Permission.DELETE_PROJECT,
    Permission.ACCESS_API,
  ],
};

/**
 * Authorization service for checking user permissions
 */
export class AuthorizationService {
  /**
   * Check if a user has a specific permission
   */
  static hasPermission(permission: Permission, user: User | null, profile: UserProfile | null): boolean {
    // No user or profile means no permissions
    if (!user || !profile) {
      return false;
    }

    // Get user role
    const role = profile.role || 'free';
    
    // Special case: Admins have all permissions
    if (role === 'admin') {
      return true;
    }

    // Check if the role has the specific permission
    return rolePermissions[role]?.includes(permission) || false;
  }

  /**
   * Check if user has any of the given permissions
   */
  static hasAnyPermission(permissions: Permission[], user: User | null, profile: UserProfile | null): boolean {
    return permissions.some(permission => this.hasPermission(permission, user, profile));
  }

  /**
   * Check if user has all of the given permissions
   */
  static hasAllPermissions(permissions: Permission[], user: User | null, profile: UserProfile | null): boolean {
    return permissions.every(permission => this.hasPermission(permission, user, profile));
  }

  /**
   * Get all permissions for a user based on their role
   */
  static getUserPermissions(user: User | null, profile: UserProfile | null): Permission[] {
    if (!user || !profile || !profile.role) {
      return [];
    }

    const role = profile.role;
    return rolePermissions[role] || [];
  }

  /**
   * Check if a user is an admin
   */
  static isAdmin(user: User | null, profile: UserProfile | null): boolean {
    if (!profile) return false;
    return profile.role === 'admin';
  }

  /**
   * Check if a user has an active paid subscription
   */
  static hasPaidSubscription(user: User | null, profile: UserProfile | null): boolean {
    if (!profile) return false;
    return profile.role === 'sync' || profile.role === 'sync-pro' || profile.role === 'admin';
  }
}
