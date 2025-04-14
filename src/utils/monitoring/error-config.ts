
import { supabase } from '@/integrations/supabase/client';

// Interface for error handling configuration
interface ErrorHandlingConfig {
  silent: boolean;
  retryCount: number;
  logToConsole: boolean;
  sendToServer: boolean;
  showToast: boolean;
}

// Default config for error handling
const DEFAULT_CONFIG: ErrorHandlingConfig = {
  silent: false,
  retryCount: 3,
  logToConsole: true,
  sendToServer: true,
  showToast: true
};

// Cache for error config to avoid repeat queries
const configCache: Record<string, ErrorHandlingConfig> = {};

/**
 * Get error handling configuration for a specific component and error type
 */
export async function getErrorHandlingConfig(
  componentName: string, 
  errorType: string
): Promise<ErrorHandlingConfig> {
  const cacheKey = `${componentName}:${errorType}`;
  
  // Return from cache if available
  if (configCache[cacheKey]) {
    return configCache[cacheKey];
  }
  
  try {
    // Try to fetch custom config from database
    const { data, error } = await supabase
      .from('error_handling_config')
      .select('*')
      .eq('component_name', componentName)
      .eq('error_type', errorType)
      .single();
      
    if (error || !data) {
      return DEFAULT_CONFIG;
    }
    
    // Store in cache
    const config: ErrorHandlingConfig = {
      silent: data.silent || DEFAULT_CONFIG.silent,
      retryCount: data.retry_count || DEFAULT_CONFIG.retryCount,
      logToConsole: data.log_to_console !== undefined ? data.log_to_console : DEFAULT_CONFIG.logToConsole,
      sendToServer: data.send_to_server !== undefined ? data.send_to_server : DEFAULT_CONFIG.sendToServer,
      showToast: data.show_toast !== undefined ? data.show_toast : DEFAULT_CONFIG.showToast
    };
    
    configCache[cacheKey] = config;
    return config;
  } catch (err) {
    console.error('Error fetching error handling config:', err);
    return DEFAULT_CONFIG;
  }
}

/**
 * Clear the error config cache
 */
export function clearErrorConfigCache(): void {
  Object.keys(configCache).forEach(key => {
    delete configCache[key];
  });
}
