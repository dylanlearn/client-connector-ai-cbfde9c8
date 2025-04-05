
import { supabase } from "@/integrations/supabase/client";
import { InteractionEvent } from "@/types/interactions";

export const InteractionService = {
  /**
   * Fetch all interaction events for a user
   */
  async getInteractions(userId: string, limit: number = 100) {
    try {
      const { data, error } = await supabase
        .from('interaction_events')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      return data as InteractionEvent[] || [];
    } catch (err) {
      console.error('Error fetching interactions:', err);
      return [];
    }
  },
  
  /**
   * Store an interaction event
   */
  async storeInteraction(interaction: Omit<InteractionEvent, 'id' | 'timestamp'>) {
    try {
      const { data, error } = await supabase
        .from('interaction_events')
        .insert(interaction);
        
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error storing interaction:', err);
      throw err;
    }
  }
};
