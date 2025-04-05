
import { supabase } from "@/integrations/supabase/client";

export const UserService = {
  /**
   * Get user profile
   */
  async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      return null;
    }
  },
  
  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updates: Record<string, any>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
        
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error updating user profile:', err);
      throw err;
    }
  }
};
