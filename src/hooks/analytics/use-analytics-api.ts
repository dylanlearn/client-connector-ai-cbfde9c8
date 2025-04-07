
import { supabase } from "@/integrations/supabase/client";
import { DesignAnalytics, UserPreference, InteractionEvent } from "@/types/analytics";
import { RpcClient } from "@/utils/supabase/rpc-client";

// Use a direct approach for tables not in the generated types
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

// Use direct table queries for interaction events
export const fetchInteractionEvents = async (
  userId: string,
  eventType?: string,
  pageUrl?: string,
  limit: number = 1000
): Promise<InteractionEvent[]> => {
  try {
    let query = supabase
      .from('interaction_events')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (eventType) {
      query = query.eq('event_type', eventType);
    }
    
    if (pageUrl) {
      query = query.eq('page_url', pageUrl);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return (data as InteractionEvent[]) || [];
  } catch (error) {
    console.error('Error fetching interaction events:', error);
    return [];
  }
};

// Use RPC function for batch inserts instead of direct inserts
export const storeInteractionEvent = async (
  userId: string,
  eventType: 'click' | 'hover' | 'scroll' | 'view',
  pageUrl: string,
  position: { x: number, y: number },
  elementSelector: string,
  sessionId: string,
  metadata?: Record<string, any>
): Promise<void> => {
  try {
    const { error } = await supabase.rpc('insert_interaction_event', {
      p_user_id: userId,
      p_event_type: eventType,
      p_page_url: pageUrl,
      p_x_position: position.x,
      p_y_position: position.y,
      p_element_selector: elementSelector,
      p_session_id: sessionId,
      p_metadata: metadata || {}
    });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error storing interaction event:', error);
    throw error;
  }
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

export const subscribeToInteractionEvents = (
  userId: string,
  onUpdate: () => void
) => {
  const interactionChannel = supabase.channel('interaction-events-changes')
    .on('postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'interaction_events',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('New interaction event:', payload);
        onUpdate();
      }
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(interactionChannel);
  };
};

// Use the new RPC function for interaction analysis
export const analyzeInteractionPatterns = async (
  userId: string,
  eventType?: string,
  pageUrl?: string,
  limit: number = 1000
): Promise<any> => {
  return RpcClient.interactionAnalytics.analyzePatterns(userId, eventType, pageUrl, limit);
};
