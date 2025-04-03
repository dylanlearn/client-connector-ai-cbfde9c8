
import { supabase } from "@/integrations/supabase/client";
import { ClientError } from "./types";
import { toast } from "sonner";

/**
 * Fetch client errors for the error dashboard
 */
export const fetchClientErrors = async (
  limit: number = 100,
  resolved?: boolean,
  userId?: string
): Promise<ClientError[]> => {
  try {
    let query = supabase
      .from('client_errors')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (resolved !== undefined) {
      query = query.eq('resolved', resolved);
    }
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching client errors:', error);
      toast.error("Failed to load error data");
      return [];
    }
    
    return data as ClientError[];
  } catch (error) {
    console.error('Error in fetchClientErrors:', error);
    return [];
  }
};

/**
 * Mark a client error as resolved
 */
export const resolveClientError = async (
  errorId: string,
  resolutionNotes?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('client_errors')
      .update({
        resolved: true,
        resolution_notes: resolutionNotes || 'Marked as resolved'
      })
      .eq('id', errorId);
      
    if (error) {
      console.error('Error resolving client error:', error);
      toast.error("Failed to resolve error");
      return false;
    }
    
    toast.success("Error marked as resolved");
    return true;
  } catch (error) {
    console.error('Error in resolveClientError:', error);
    return false;
  }
};

/**
 * Get client error statistics
 */
export const getErrorStatistics = async (): Promise<{
  total: number,
  resolved: number,
  unresolved: number,
  byComponent: Record<string, number>
}> => {
  try {
    // Get total count
    const { count: total, error: totalError } = await supabase
      .from('client_errors')
      .select('*', { count: 'exact', head: true });
      
    // Get resolved count
    const { count: resolved, error: resolvedError } = await supabase
      .from('client_errors')
      .select('*', { count: 'exact', head: true })
      .eq('resolved', true);
      
    // Get component breakdown
    const { data: componentData, error: componentError } = await supabase
      .from('client_errors')
      .select('component_name, id');
      
    if (totalError || resolvedError || componentError) {
      console.error('Error fetching error statistics', totalError || resolvedError || componentError);
      return { total: 0, resolved: 0, unresolved: 0, byComponent: {} };
    }
    
    // Calculate component breakdown
    const byComponent: Record<string, number> = {};
    componentData?.forEach(error => {
      const component = error.component_name || 'Unknown';
      byComponent[component] = (byComponent[component] || 0) + 1;
    });
    
    return {
      total: total || 0,
      resolved: resolved || 0,
      unresolved: (total || 0) - (resolved || 0),
      byComponent
    };
  } catch (error) {
    console.error('Error in getErrorStatistics:', error);
    return { total: 0, resolved: 0, unresolved: 0, byComponent: {} };
  }
};
