
import { supabase } from "@/integrations/supabase/client";
import { ClientError } from "./types";

/**
 * Fetch client errors with filtering
 */
export async function fetchClientErrors(
  limit: number = 50, 
  resolved?: boolean
): Promise<ClientError[]> {
  try {
    let query = supabase
      .from('client_errors')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
      
    if (resolved !== undefined) {
      query = query.eq('resolved', resolved);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching client errors:', error);
      return [];
    }
    
    return data as ClientError[];
  } catch (error) {
    console.error('Error in fetchClientErrors:', error);
    return [];
  }
}

/**
 * Mark a client error as resolved
 */
export async function resolveClientError(
  errorId: string,
  resolutionNotes: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('client_errors')
      .update({
        resolved: true,
        resolution_notes: resolutionNotes
      })
      .eq('id', errorId);
      
    if (error) {
      console.error('Error resolving client error:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in resolveClientError:', error);
    return false;
  }
}

/**
 * Get error statistics
 */
export async function getErrorStatistics() {
  try {
    const { data: allErrors, error } = await supabase
      .from('client_errors')
      .select('id, resolved, component_name');
      
    if (error) {
      throw error;
    }
    
    // Calculate basic statistics
    const total = allErrors.length;
    const resolved = allErrors.filter(e => e.resolved).length;
    const unresolved = total - resolved;
    
    // Group by component
    const byComponent: Record<string, number> = {};
    allErrors.forEach(error => {
      const component = error.component_name || 'unknown';
      byComponent[component] = (byComponent[component] || 0) + 1;
    });
    
    return {
      total,
      resolved,
      unresolved,
      byComponent
    };
  } catch (error) {
    console.error('Error getting error statistics:', error);
    return {
      total: 0,
      resolved: 0,
      unresolved: 0,
      byComponent: {}
    };
  }
}
