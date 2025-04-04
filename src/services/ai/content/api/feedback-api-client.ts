
import { supabase } from "@/integrations/supabase/client";
import { 
  FeedbackAnalysisResult,
  ActionItem
} from "../feedback-types";

// Maximum number of retries for API calls
const MAX_RETRIES = 3;
// Delay between retries in milliseconds (starting value, will be exponentially increased)
const RETRY_DELAY = 1000;

/**
 * API client for feedback analysis operations
 */
export const FeedbackApiClient = {
  /**
   * Call the analyze-feedback edge function
   */
  callAnalyzeFeedbackFunction: async (feedbackText: string): Promise<FeedbackAnalysisResult> => {
    let retries = 0;
    let lastError: Error | null = null;

    while (retries < MAX_RETRIES) {
      try {
        // Call the edge function to analyze the feedback
        const { data, error } = await supabase.functions.invoke<any>(
          'analyze-feedback',
          {
            body: { feedbackText }
          }
        );

        if (error) {
          console.error('Error from analyze-feedback function:', error);
          throw new Error(error.message || 'Failed to analyze feedback');
        }

        if (!data) {
          throw new Error('No analysis data returned');
        }

        // Make sure action items have valid priorities
        const validatedActionItems: ActionItem[] = (data.actionItems || []).map((item: any) => {
          // Validate priority is one of the allowed values
          let priority: 'high' | 'medium' | 'low' = 'medium';
          if (item.priority === 'high' || item.priority === 'medium' || item.priority === 'low') {
            priority = item.priority;
          }
          
          return {
            task: item.task,
            priority,
            urgency: Number(item.urgency) || 5
          };
        });

        return {
          summary: data.summary || '',
          actionItems: validatedActionItems,
          toneAnalysis: data.toneAnalysis || {
            positive: 0,
            neutral: 1,
            negative: 0,
            urgent: false,
            critical: false,
            vague: false
          }
        };
      } catch (error: any) {
        lastError = error;
        retries++;
        
        // If we've reached max retries, break out
        if (retries >= MAX_RETRIES) break;
        
        // Exponential backoff - wait longer between each retry
        const delay = RETRY_DELAY * Math.pow(2, retries - 1);
        console.log(`Retry ${retries}/${MAX_RETRIES} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    console.error('All retries failed for feedback analysis:', lastError);
    throw lastError || new Error('Failed to analyze feedback after multiple attempts');
  }
};
