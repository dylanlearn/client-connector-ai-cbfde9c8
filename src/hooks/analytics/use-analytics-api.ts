
import { supabase } from "@/integrations/supabase/client";
import { DesignAnalytics, UserPreference } from "@/types/analytics";

export const fetchAnalyticsData = async (userId: string, designOptionIds: string[]) => {
  if (!designOptionIds.length) return [];
  
  const { data, error } = await supabase
    .from('design_analytics')
    .select('*')
    .in('design_option_id', designOptionIds)
    .order('selection_count', { ascending: false });

  if (error) throw error;
  return data as DesignAnalytics[];
};

export const fetchUserPreferences = async (userId: string) => {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('design_preferences')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data as UserPreference[];
};

export const getUserDesignOptionIds = async (userId: string) => {
  if (!userId) return [];
  
  const { data, error } = await supabase
    .from('design_preferences')
    .select('design_option_id')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data ? data.map(pref => pref.design_option_id) : [];
};

export const subscribeToUserPreferences = (
  userId: string, 
  onUpdate: () => void
) => {
  const preferencesChannel = supabase.channel('user-preferences-changes')
    .on('postgres_changes',
      { 
        event: '*', 
        schema: 'public', 
        table: 'design_preferences', 
        filter: `user_id=eq.${userId}` 
      },
      (payload) => {
        console.log('User preferences update:', payload);
        onUpdate();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(preferencesChannel);
  };
};
