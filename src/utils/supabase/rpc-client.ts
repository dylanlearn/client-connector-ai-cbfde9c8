
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RPCOptions {
  componentName?: string;
  showToast?: boolean;
  errorMessage?: string;
  successMessage?: string;
}

/**
 * A utility class for making RPC calls to Supabase
 */
export class RPCClient {
  /**
   * Call a Supabase RPC function with standardized error handling
   * 
   * @param functionName The name of the RPC function to call
   * @param params Parameters to pass to the function
   * @param options Additional options
   */
  static async call<T = any>(
    functionName: string,
    params: Record<string, any> = {},
    options: RPCOptions = {}
  ): Promise<T> {
    const { 
      componentName = 'RPCClient', 
      showToast = false,
      errorMessage = `Error calling ${functionName}`,
      successMessage
    } = options;
    
    try {
      const { data, error } = await supabase.rpc(functionName, params);
      
      if (error) {
        console.error(`[${componentName}] RPC error in ${functionName}:`, error);
        
        if (showToast) {
          toast.error(errorMessage, {
            description: error.message
          });
        }
        
        throw error;
      }
      
      if (showToast && successMessage) {
        toast.success(successMessage);
      }
      
      return data as T;
    } catch (error) {
      console.error(`[${componentName}] Error calling ${functionName}:`, error);
      
      if (showToast) {
        toast.error(errorMessage, {
          description: error instanceof Error ? error.message : 'An unexpected error occurred'
        });
      }
      
      throw error;
    }
  }
}
