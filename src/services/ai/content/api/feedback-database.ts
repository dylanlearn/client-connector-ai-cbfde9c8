
import { supabase } from '@/integrations/supabase/client';
import { RPCClient } from '@/utils/supabase/rpc-client';

export interface FeedbackRecord {
  id: string;
  content_id: string;
  rating: number;
  feedback_text?: string;
  user_id?: string;
  created_at: string;
}

export async function submitFeedback(
  contentId: string,
  rating: number,
  feedbackText?: string,
  userId?: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const { error } = await supabase
      .from('content_feedback')
      .insert({
        content_id: contentId,
        rating,
        feedback_text: feedbackText,
        user_id: userId
      });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to submit feedback';
    return { 
      success: false, 
      message 
    };
  }
}

export async function getFeedbackStats(contentId: string): Promise<{
  average_rating: number;
  total_ratings: number;
  rating_distribution: Record<string, number>;
} | null> {
  try {
    const result = await RPCClient.call('get_content_feedback_stats', { 
      content_id: contentId 
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    return null;
  }
}
