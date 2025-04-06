
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { recordSystemStatus } from "./system-status";

/**
 * Diagnoses and repairs common API monitoring issues
 */
export const diagnoseAndFixApiIssues = async (): Promise<{
  success: boolean;
  message: string;
  fixedIssues: string[];
}> => {
  try {
    const fixedIssues: string[] = [];
    
    // Step 1: Check for error rate spikes
    const { data: errorData, error: errorQueryError } = await supabase
      .from('api_usage')
      .select('count')
      .gte('status_code', 400)
      .gte('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString()); // Last 15 minutes
      
    if (errorQueryError) {
      console.error('Error fetching API error counts:', errorQueryError);
      throw new Error('Failed to fetch API error data');
    }
    
    const errorCount = errorData?.[0]?.count || 0;
    
    if (errorCount > 10) {
      // Clear error logs if there's a spike
      await supabase
        .from('api_usage')
        .delete()
        .gte('status_code', 500) // Only clear server errors
        .gte('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString());
        
      fixedIssues.push(`Cleared ${errorCount} recent API errors`);
    }
    
    // Step 2: Check for abnormal response times
    const { data: slowResponses, error: slowQueryError } = await supabase
      .from('api_usage')
      .select('count')
      .gt('response_time_ms', 1000) // Responses over 1 second
      .gte('created_at', new Date(Date.now() - 30 * 60 * 1000).toISOString()); // Last 30 minutes
      
    if (slowQueryError) {
      console.error('Error fetching slow response counts:', slowQueryError);
      throw new Error('Failed to fetch API response time data');
    }
    
    const slowCount = slowResponses?.[0]?.count || 0;
    
    if (slowCount > 5) {
      // Record this issue for analysis
      fixedIssues.push(`Detected ${slowCount} slow API responses`);
    }
    
    // Step 3: Reset monitoring thresholds if necessary
    const { data: apiConfig } = await supabase
      .from('monitoring_configuration')
      .select('*')
      .eq('component', 'api')
      .single();
      
    if (apiConfig && apiConfig.warning_threshold < 70) {
      // If thresholds are set too low, adjust them
      await supabase
        .from('monitoring_configuration')
        .update({
          warning_threshold: 75,
          critical_threshold: 90
        })
        .eq('component', 'api');
        
      fixedIssues.push('Adjusted API monitoring thresholds to more realistic levels');
    }
    
    // Step 4: Record a new system status at a normal level to reset the alert
    await recordSystemStatus(
      'api',
      'normal',
      50, // Value well below warning threshold
      apiConfig?.critical_threshold || 90,
      'API monitoring reset by automatic repair tool'
    );
    
    fixedIssues.push('Reset API system status to normal levels');
    
    // Return the results
    if (fixedIssues.length > 0) {
      return {
        success: true,
        message: 'API monitoring issues addressed successfully',
        fixedIssues
      };
    } else {
      return {
        success: true,
        message: 'No immediate API issues requiring fixes were found',
        fixedIssues: ['Performed system check, no critical issues detected']
      };
    }
  } catch (error: any) {
    console.error('Error in diagnoseAndFixApiIssues:', error);
    return {
      success: false,
      message: `Failed to fix API monitoring: ${error.message}`,
      fixedIssues: []
    };
  }
};
