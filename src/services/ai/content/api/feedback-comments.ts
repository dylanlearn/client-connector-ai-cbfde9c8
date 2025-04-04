
import { supabase } from "@/integrations/supabase/client";
import { FeedbackComment } from "../feedback-types";

/**
 * Operations for handling feedback comments
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
      // Get the current user ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to add comments');
      }
      
      const { data, error } = await supabase
        .from('feedback_comments')
        .insert({
          feedback_id: feedbackId,
          user_id: user.id,
          comment
        })
        .select('id')
        .single();
      
      if (error) {
        console.error('Error adding comment:', error);
        return null;
      }
      
      return data.id;
    } catch (error) {
      console.error('Error adding comment:', error);
      return null;
    }
  },

  /**
   * Get comments for feedback
   */
  getComments: async (feedbackId: string): Promise<FeedbackComment[]> => {
    try {
      // First, we need to fetch the comments directly without joining to profiles
      const { data, error } = await supabase
        .from('feedback_comments')
        .select(`
          id,
          comment,
          created_at,
          user_id
        `)
        .eq('feedback_id', feedbackId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching comments:', error);
        return [];
      }
      
      // Then we'll transform the data to the expected format
      // and add user email info if we can find it
      const comments: FeedbackComment[] = [];
      
      for (const item of data || []) {
        // Try to get the user email if available
        let userEmail: string | undefined = undefined;
        
        if (item.user_id) {
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', item.user_id)
            .single();
            
          if (!userError && userData) {
            userEmail = userData.email;
          }
        }
        
        comments.push({
          id: item.id,
          comment: item.comment,
          createdAt: item.created_at,
          userId: item.user_id,
          userEmail
        });
      }
      
      return comments;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }
};
