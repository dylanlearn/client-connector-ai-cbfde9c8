
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Components to monitor
const MONITORING_COMPONENTS = [
  'api',
  'database',
  'memory',
  'cpu',
  'storage'
];

/**
 * Generate simulated monitoring data for testing
 */
export const generateMonitoringData = async (): Promise<boolean> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Authentication required", {
        description: "You must be logged in to generate monitoring data"
      });
      return false;
    }
    
    // Call the monitoring-simulation edge function
    const { data, error } = await supabase.functions.invoke('monitoring-simulation', {
      body: {
        action: 'generate_metrics',
        components: MONITORING_COMPONENTS,
        userId: user.id
      }
    });
    
    if (error) {
      console.error('Error generating monitoring data:', error);
      toast.error("Failed to generate monitoring data", {
        description: error.message
      });
      return false;
    }
    
    console.log('Generated monitoring data:', data);
    
    toast.success("Monitoring data generated", {
      description: `Generated data for ${data.results.length} components`
    });
    
    return true;
  } catch (error) {
    console.error('Error in generateMonitoringData:', error);
    toast.error("Failed to generate monitoring data", {
      description: error.message
    });
    return false;
  }
};

/**
 * Clear old monitoring data
 */
export const clearMonitoringData = async (): Promise<boolean> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Authentication required", {
        description: "You must be logged in to clear monitoring data"
      });
      return false;
    }
    
    // Call the monitoring-simulation edge function
    const { data, error } = await supabase.functions.invoke('monitoring-simulation', {
      body: {
        action: 'clear_metrics',
        userId: user.id
      }
    });
    
    if (error) {
      console.error('Error clearing monitoring data:', error);
      toast.error("Failed to clear monitoring data", {
        description: error.message
      });
      return false;
    }
    
    console.log('Cleared monitoring data:', data);
    
    toast.success("Monitoring data cleared", {
      description: `Cleared data from ${data.results.length} tables`
    });
    
    return true;
  } catch (error) {
    console.error('Error in clearMonitoringData:', error);
    toast.error("Failed to clear monitoring data", {
      description: error.message
    });
    return false;
  }
};

/**
 * Get monitoring configuration for all components
 */
export const getMonitoringConfigurations = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('monitoring_configuration')
      .select('*')
      .order('component');
      
    if (error) {
      console.error('Error fetching monitoring configurations:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getMonitoringConfigurations:', error);
    return [];
  }
};

/**
 * Update a monitoring component configuration
 */
export const updateMonitoringConfiguration = async (
  component: string,
  config: {
    warning_threshold?: number;
    critical_threshold?: number;
    enabled?: boolean;
    check_interval?: number;
    notification_enabled?: boolean;
  }
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('monitoring_configuration')
      .update(config)
      .eq('component', component);
      
    if (error) {
      console.error('Error updating monitoring configuration:', error);
      toast.error("Failed to update configuration", {
        description: error.message
      });
      return false;
    }
    
    toast.success("Configuration updated", {
      description: `Updated configuration for ${component}`
    });
    
    return true;
  } catch (error) {
    console.error('Error in updateMonitoringConfiguration:', error);
    toast.error("Failed to update configuration", {
      description: error.message
    });
    return false;
  }
};
