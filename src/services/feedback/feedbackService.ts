
import { supabase } from "@/integrations/supabase/client";
import { FeedbackItem, FeedbackComment, FeedbackStatus, FeedbackPriority } from "@/types/feedback";

export const FeedbackService = {
  async createFeedback(feedback: Omit<FeedbackItem, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('feedback_items')
      .insert(feedback)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getFeedbackByWireframe(wireframeId: string) {
    const { data, error } = await supabase
      .from('feedback_items')
      .select(`
        *,
        comments:feedback_comments(*)
      `)
      .eq('wireframe_id', wireframeId);

    if (error) throw error;
    return data;
  },

  async updateFeedbackStatus(id: string, status: FeedbackStatus) {
    const { data, error } = await supabase
      .from('feedback_items')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateFeedbackPriority(id: string, priority: FeedbackPriority) {
    const { data, error } = await supabase
      .from('feedback_items')
      .update({ priority })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async assignFeedback(id: string, assignedTo: string) {
    const { data, error } = await supabase
      .from('feedback_items')
      .update({ assigned_to: assignedTo })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async addComment(comment: Omit<FeedbackComment, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('feedback_comments')
      .insert(comment)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
