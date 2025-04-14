
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SaveButton } from './controls/SaveButton';
import { LoadingState } from './controls/LoadingState';
import { ErrorMessage } from './controls/ErrorMessage';
import { useMonitoringConfig } from '@/hooks/use-monitoring-config';
import { ConfigurationItem } from './controls/ConfigurationItem';
import { MonitoringControlsProps } from './controls/MonitoringControls.props';

export function MonitoringControls({ redisConnected, onConfigUpdate }: MonitoringControlsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { 
    config, 
    updateConfig, 
    isLoading, 
    error 
  } = useMonitoringConfig();
  
  const handleSaveChanges = async () => {
    if (!config) return;
    
    setIsSaving(true);
    try {
      await updateConfig(config);
      if (onConfigUpdate) {
        await onConfigUpdate();
      }
    } catch (err) {
      console.error('Error saving monitoring configuration:', err);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleToggleMonitoring = async () => {
    if (!config) return;
    
    await updateConfig({
      enabled: !config.enabled 
    });
  };
  
  const handleConfigChange = (field: string, value: any) => {
    if (!config) return;
    
    updateConfig({
      [field]: value
    });
  };
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error) {
    return (
      <ErrorMessage 
        message={error.message || "Unknown error"} 
        title="Configuration Error" 
      />
    );
  }
  
  if (!config) {
    return (
      <ErrorMessage 
        message="Unable to load monitoring configuration" 
        title="Configuration Error" 
      />
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Monitoring Controls</CardTitle>
        <Button 
          onClick={handleToggleMonitoring}
          variant={config.enabled ? 'default' : 'outline'}
          size="sm"
        >
          {config.enabled ? 'Enabled' : 'Disabled'}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(config)
            .filter(([key]) => key !== 'enabled' && typeof config[key] !== 'object')
            .map(([key, value]) => (
              <ConfigurationItem
                key={key}
                label={key}
                value={value as string | number | boolean}
                configKey={key}
                onChange={handleConfigChange}
                type={typeof value === 'number' ? 'number' : 
                      typeof value === 'boolean' ? 'boolean' : 'text'}
              />
            ))}
          
          <div className="flex justify-end">
            <SaveButton 
              isSaving={isSaving}
              onSave={handleSaveChanges}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
