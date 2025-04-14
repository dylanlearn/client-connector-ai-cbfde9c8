
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { MonitoringConfiguration } from '@/utils/monitoring/types';

const defaultConfig: MonitoringConfiguration = {
  enabled: true,
  logLevel: 'info',
  samplingRate: 0.5,
  alertChannels: ['email'],
  retentionPeriod: 30,
  components: {
    api: true,
    ui: true,
    database: true,
    auth: true,
    storage: true
  }
};

export function useMonitoringConfig(projectId?: string) {
  const [config, setConfig] = useState<MonitoringConfiguration>(defaultConfig);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Fetch configuration
  const fetchConfig = useCallback(async () => {
    if (!projectId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('monitoring_config')
        .select('*')
        .eq('project_id', projectId)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setConfig(data.config as MonitoringConfiguration);
      }
    } catch (err) {
      console.error('Error fetching monitoring config:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch monitoring configuration'));
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  // Update configuration
  const updateConfig = useCallback(async (newConfig: Partial<MonitoringConfiguration>) => {
    if (!projectId) return false;
    
    try {
      const updatedConfig = { ...config, ...newConfig };
      
      const { error } = await supabase
        .from('monitoring_config')
        .upsert({
          project_id: projectId,
          config: updatedConfig
        });
        
      if (error) throw error;
      
      setConfig(updatedConfig);
      
      toast({
        title: 'Configuration Updated',
        description: 'Monitoring configuration has been saved successfully',
      });
      
      return true;
    } catch (err) {
      console.error('Error updating monitoring config:', err);
      
      toast({
        title: 'Update Failed',
        description: err instanceof Error ? err.message : 'Failed to update configuration',
        variant: 'destructive',
      });
      
      return false;
    }
  }, [config, projectId, toast]);

  // Load configuration on component mount
  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return {
    config,
    isLoading,
    error,
    updateConfig,
    reloadConfig: fetchConfig
  };
}
