
import { supabase } from "@/integrations/supabase/client";
import { DesignAnalytics, UserPreference, InteractionEvent } from "@/types/analytics";

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

// Use a more direct approach for querying interaction events
export const fetchInteractionEvents = async (
  userId: string,
  eventType?: string,
  pageUrl?: string,
  limit: number = 1000
): Promise<InteractionEvent[]> => {
  try {
    let query = `
      SELECT * FROM interaction_events 
      WHERE user_id = '${userId}'
    `;
    
    if (eventType) {
      query += ` AND event_type = '${eventType}'`;
    }
    
    if (pageUrl) {
      query += ` AND page_url = '${pageUrl}'`;
    }
    
    query += ` ORDER BY timestamp DESC LIMIT ${limit}`;
    
    const { data, error } = await supabase.rpc('stored_procedure', { 
      sql: `SELECT * FROM query_interaction_events($1)`,
      params: [query]
    });
    
    if (error) throw error;
    return (data as unknown) as InteractionEvent[];
  } catch (error) {
    console.error('Error fetching interaction events:', error);
    return [];
  }
};

// Direct approach for storing interactions
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
    // Use SQL to insert directly
    const { error } = await supabase.rpc('stored_procedure', {
      sql: `SELECT insert_interaction_event($1, $2, $3, $4, $5, $6, $7, $8)`,
      params: [
        userId,
        eventType,
        pageUrl,
        position.x,
        position.y,
        elementSelector,
        sessionId,
        metadata || {}
      ]
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
