
import { supabase } from "@/integrations/supabase/client";
import { FeedbackComment } from "../feedback-types";

/**
 * Comments operations for feedback analysis
 */
export const FeedbackComments = {
  /**
   * Add a comment to feedback
   */
  addComment: async (
    feedbackId: string, 
    comment: string
  ): Promise<string | null> => {
    try {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      
      const { data, error } = await supabase
        .from('feedback_comments')
        .insert({
          feedback_id: feedbackId,
          comment,
          user_id: userId
        })
        .select('id')
        .single();

      if (error) {
        console.error("Error adding feedback comment:", error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error("Exception adding feedback comment:", error);
      return null;
    }
  },

  /**
   * Get comments for feedback
   */
  getComments: async (feedbackId: string): Promise<FeedbackComment[]> => {
    try {
      const { data, error } = await supabase
        .from('feedback_comments')
        .select(`
          id,
          comment,
          created_at,
          user_id,
          profiles:user_id (name, avatar_url)
        `)
        .eq('feedback_id', feedbackId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching feedback comments:", error);
        return [];
      }

      return data.map(item => ({
        id: item.id,
        comment: item.comment,
        createdAt: item.created_at,
        userId: item.user_id,
        userName: item.profiles ? item.profiles.name : 'Unknown User',
        userAvatar: item.profiles ? item.profiles.avatar_url : undefined
      }));
    } catch (error) {
      console.error("Exception fetching feedback comments:", error);
      return [];
    }
  }
};
