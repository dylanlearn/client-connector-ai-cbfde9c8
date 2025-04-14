
import { supabase } from '@/integrations/supabase/client';
import { ClientError } from './types';

// Fetch client errors with filtering options
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
    
    return data as ClientError[] || [];
  } catch (error) {
    console.error('Error in fetchClientErrors:', error);
    return [];
  }
}

// Resolve a client error
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

// Get error statistics
export async function getErrorStatistics(): Promise<{
  total: number;
  resolved: number;
  unresolved: number;
  byComponent: Record<string, number>;
}> {
  try {
    // Get total errors count
    const { count: totalCount, error: totalError } = await supabase
      .from('client_errors')
      .select('*', { count: 'exact', head: true });
    
    // Get resolved errors count
    const { count: resolvedCount, error: resolvedError } = await supabase
      .from('client_errors')
      .select('*', { count: 'exact', head: true })
      .eq('resolved', true);
    
    // Get unique components
    const { data: componentsData, error: componentsError } = await supabase
      .from('client_errors')
      .select('componentName')
      .not('componentName', 'is', null);
    
    if (totalError || resolvedError || componentsError) {
      console.error('Error getting error statistics');
      return {
        total: 0,
        resolved: 0,
        unresolved: 0,
        byComponent: {}
      };
    }
    
    // Calculate component statistics
    const byComponent: Record<string, number> = {};
    if (componentsData) {
      componentsData.forEach(item => {
        const component = item.componentName || 'unknown';
        byComponent[component] = (byComponent[component] || 0) + 1;
      });
    }
    
    return {
      total: totalCount || 0,
      resolved: resolvedCount || 0,
      unresolved: (totalCount || 0) - (resolvedCount || 0),
      byComponent
    };
  } catch (error) {
    console.error('Error in getErrorStatistics:', error);
    return {
      total: 0,
      resolved: 0,
      unresolved: 0,
      byComponent: {}
    };
  }
}
