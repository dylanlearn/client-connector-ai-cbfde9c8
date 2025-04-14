
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface MonitoringConfiguration {
  enabled: boolean;
  errorThreshold: number;
  warnThreshold: number;
  notificationsEnabled: boolean;
  checkInterval: number;
  [key: string]: string | number | boolean;
}

export function useMonitoringConfig() {
  const [config, setConfig] = useState<MonitoringConfiguration>({
    enabled: true,
    errorThreshold: 10,
    warnThreshold: 5,
    notificationsEnabled: true,
    checkInterval: 60,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchConfig = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Simulated config from backend
      const serverConfig = {
        enabled: true,
        errorThreshold: 10, 
        warnThreshold: 5,
        notificationsEnabled: true,
        checkInterval: 60
      };
      
      setConfig(serverConfig);
    } catch (err) {
      console.error('Error fetching monitoring config:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching configuration'));
      toast.error("Failed to load monitoring configuration");
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateConfig = async (newConfig: Partial<MonitoringConfiguration>) => {
    try {
      // Merge with existing config
      const updatedConfig = { ...config, ...newConfig };
      setConfig(updatedConfig);
      
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      toast.success("Monitoring configuration updated");
      return true;
    } catch (err) {
      console.error('Error updating monitoring config:', err);
      toast.error("Failed to update configuration");
      return false;
    }
  };
  
  const reloadConfig = async () => {
    await fetchConfig();
  };
  
  // Load configuration on mount
  useEffect(() => {
    fetchConfig();
  }, []);
  
  return {
    config,
    isLoading,
    error,
    updateConfig,
    reloadConfig
  };
}
