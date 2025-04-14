
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getErrorHandlingConfig } from '../monitoring/error-config';
import { ClientErrorLogger } from '../monitoring/client-error-logger';

/**
 * A wrapper for Supabase RPC calls with standardized error handling
 */
export class RPCClient {
  /**
   * Call a Supabase RPC procedure with standardized error handling
   */
  static async call<T = any>(
    procedureName: string, 
    params?: Record<string, any>,
    options?: {
      componentName?: string;
      userId?: string;
      showToast?: boolean;
    }
  ): Promise<T | null> {
    const componentName = options?.componentName || 'RPCClient';
    
    try {
      const { data, error } = await supabase.rpc(procedureName, params || {});
      
      if (error) {
        // Get error handling configuration
        const config = await getErrorHandlingConfig('Database', 'rpc-error');
        
        // Log the error
        ClientErrorLogger.logError(
          `RPC Error (${procedureName}): ${error.message}`,
          componentName,
          options?.userId,
          { 
            code: error.code,
            details: error.details,
            hint: error.hint,
            params
          }
        );
        
        // Show toast notification if configured
        if (options?.showToast || config.shouldShowToUser) {
          toast.error(`Database operation failed`, {
            description: config.customMessage || 'Please try again later',
            duration: 5000,
          });
        }
        
        return null;
      }
      
      return data as T;
    } catch (error) {
      // Handle unexpected errors
      ClientErrorLogger.logError(
        error instanceof Error ? error : new Error(`Unknown RPC error in ${procedureName}`),
        componentName,
        options?.userId,
        { procedure: procedureName, params }
      );
      
      if (options?.showToast) {
        toast.error('An unexpected error occurred', {
          description: 'Please try again later',
          duration: 5000,
        });
      }
      
      return null;
    }
  }
  
  /**
   * Batch insert records with error handling
   */
  static async batchInsert<T>(
    table: string,
    records: Array<Partial<T>>,
    options?: {
      componentName?: string;
      userId?: string;
      showToast?: boolean;
    }
  ): Promise<{ count: number, error: string | null }> {
    if (!records.length) {
      return { count: 0, error: null };
    }
    
    try {
      const result = await this.call<{ count: number }>('batch_insert', {
        table_name: table,
        records: records
      }, options);
      
      return result ? { ...result, error: null } : { count: 0, error: 'Failed to insert records' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { count: 0, error: errorMessage };
    }
  }
}
