
import { supabase } from "@/integrations/supabase/client";
import { User, UserPresence, CursorPosition } from "@/types/collaboration";

/**
 * Service for handling user presence in collaborative documents
 */
export const PresenceService = {
  /**
   * Update user presence
   */
  async updatePresence(documentId: string, userId: string, presence: Partial<UserPresence>) {
    try {
      // First try to update an existing presence
      const { data: existingPresence, error: lookupError } = await supabase
        .from('user_presence')
        .select('*')
        .eq('document_id', documentId)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (lookupError) throw lookupError;

      if (existingPresence) {
        // Update existing presence
        const { error } = await supabase
          .from('user_presence')
          .update({
            status: presence.status || existingPresence.status,
            focus_element: presence.focusElement || existingPresence.focus_element,
            cursor_position: presence.cursorPosition || existingPresence.cursor_position,
            last_active: new Date().toISOString()
          })
          .eq('id', existingPresence.id);
          
        if (error) throw error;
      } else {
        // Insert new presence
        const { error } = await supabase
          .from('user_presence')
          .insert({
            user_id: userId,
            document_id: documentId,
            status: presence.status || 'active',
            focus_element: presence.focusElement,
            cursor_position: presence.cursorPosition,
            last_active: new Date().toISOString()
          });
          
        if (error) throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error updating presence:', error);
      throw error;
    }
  },

  /**
   * Get active users in a document
   */
  async getActiveUsers(documentId: string) {
    try {
      const { data, error } = await supabase
        .from('user_presence')
        .select('*')
        .eq('document_id', documentId)
        .gte('last_active', new Date(Date.now() - 5 * 60 * 1000).toISOString()); // Active in the last 5 minutes

      if (error) throw error;
      
      // Convert to our client-side User type
      const users: Record<string, User> = {};
      data.forEach(item => {
        users[item.user_id] = {
          id: item.user_id,
          name: `User ${item.user_id.substring(0, 4)}`, // In a real app, fetch actual user names
          color: `hsl(${Math.random() * 360}, 80%, 60%)`, // Generate a random color
          avatar: null,
          presence: {
            status: item.status,
            focusElement: item.focus_element,
            cursorPosition: item.cursor_position,
            lastActive: item.last_active
          }
        };
      });
      
      return users;
    } catch (error) {
      console.error('Error fetching active users:', error);
      throw error;
    }
  },

  /**
   * Subscribe to user presence changes
   */
  subscribeToPresence(documentId: string, onPresenceChange: (users: Record<string, User>) => void) {
    const channel = supabase
      .channel(`presence-${documentId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'user_presence',
          filter: `document_id=eq.${documentId}`
        },
        (payload) => {
          console.log('Presence change:', payload);
          // Refresh users on any change
          this.getActiveUsers(documentId).then(onPresenceChange);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};
