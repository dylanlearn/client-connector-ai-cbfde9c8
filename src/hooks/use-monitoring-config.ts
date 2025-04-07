
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { MonitoringConfiguration } from "@/utils/monitoring/types";

/**
 * Hook for managing monitoring configurations
 */
export function useMonitoringConfig(onConfigUpdateCallback?: () => void) {
  const [configurations, setConfigurations] = useState<MonitoringConfiguration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Fetch monitoring configurations
  const fetchConfigurations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('monitoring_configuration')
        .select('*')
        .order('component');
        
      if (error) {
        throw error;
      }
      
      setConfigurations(data || []);
    } catch (error: any) {
      console.error('Error fetching monitoring configurations:', error);
      setError(error.message || 'Error loading configurations');
      toast({
        title: "Error loading configurations",
        description: "There was a problem loading the monitoring configurations.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update a specific field in a configuration
  const updateConfigField = (index: number, field: keyof MonitoringConfiguration, value: any) => {
    const updatedConfigs = [...configurations];
    updatedConfigs[index] = {
      ...updatedConfigs[index],
      [field]: value
    };
    setConfigurations(updatedConfigs);
  };

  // Save updated configurations to the database
  const saveConfigurations = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      // Update each configuration in sequence
      for (const config of configurations) {
        const updateData = {
          warning_threshold: config.warning_threshold,
          critical_threshold: config.critical_threshold,
          check_interval: config.check_interval,
          enabled: config.enabled,
          notification_enabled: config.notification_enabled
        };

        const { error } = await supabase
          .from('monitoring_configuration')
          .update(updateData)
          .eq('id', config.id);
          
        if (error) throw error;
      }
      
      toast({
        title: "Configurations saved",
        description: "Monitoring configurations have been updated successfully.",
        variant: "default"
      });
      
      // Notify parent component if callback provided
      if (onConfigUpdateCallback) {
        onConfigUpdateCallback();
      }
    } catch (error: any) {
      console.error('Error saving monitoring configurations:', error);
      setError(error.message || 'Error saving configurations');
      toast({
        title: "Error saving configurations",
        description: "There was a problem saving the monitoring configurations.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch configurations on mount
  useEffect(() => {
    fetchConfigurations();
  }, []);

  return {
    configurations,
    isLoading,
    isSaving,
    error,
    updateConfigField,
    saveConfigurations,
    refreshConfigurations: fetchConfigurations
  };
}
