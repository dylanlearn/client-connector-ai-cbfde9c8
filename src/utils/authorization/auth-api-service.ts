
import { supabase } from "@/integrations/supabase/client";
import { Permission } from "./auth-service";

/**
 * Service for authorization-related API operations
 */
export const AuthApiService = {
  /**
   * Fetch user permissions from the database
   */
  fetchUserPermissions: async (userId: string): Promise<Permission[]> => {
    try {
      const { data, error } = await supabase
        .rpc('get_user_permissions', { p_user_id: userId });
        
      if (error) {
        console.error('Error fetching permissions:', error);
        return [];
      }
      
      return data as Permission[];
    } catch (error) {
      console.error('Error in fetchUserPermissions:', error);
      return [];
    }
  },
  
  /**
   * Check if user has a specific permission (using database)
   */
  checkPermission: async (userId: string, permission: Permission): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .rpc('user_has_permission', { 
          p_user_id: userId, 
          p_permission: permission 
        });
        
      if (error) {
        console.error('Error checking permission:', error);
        return false;
      }
      
      return data as boolean;
    } catch (error) {
      console.error('Error in checkPermission:', error);
      return false;
    }
  }
};
