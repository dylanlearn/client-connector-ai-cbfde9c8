
import { supabase } from "@/integrations/supabase/client";
import { UserViewPreferences, ViewRole } from "@/types/feedback";

export const ViewPreferencesService = {
  async getUserPreferences(): Promise<UserViewPreferences | null> {
    const { data, error } = await supabase
      .from('user_view_preferences')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateViewRole(viewRole: ViewRole) {
    const { data, error } = await supabase
      .from('user_view_preferences')
      .upsert({ 
        view_role: viewRole,
        user_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updatePreferences(preferences: Partial<UserViewPreferences>) {
    const { data, error } = await supabase
      .from('user_view_preferences')
      .upsert({ 
        ...preferences,
        user_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
