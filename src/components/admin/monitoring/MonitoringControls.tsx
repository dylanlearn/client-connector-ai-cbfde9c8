
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SaveButton } from './controls/SaveButton';
import { LoadingState } from './controls/LoadingState';
import { ErrorMessage } from './controls/ErrorMessage';
import { useMonitoringConfig } from '@/hooks/use-monitoring-config';
import { ConfigurationItem } from './controls/ConfigurationItem';

export function MonitoringControls() {
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
    } catch (err) {
      console.error('Error saving monitoring configuration:', err);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleToggleMonitoring = async () => {
    if (!config) return;
    
    const updatedConfig = { 
      ...config,
      enabled: !config.enabled 
    };
    
    await updateConfig(updatedConfig);
  };
  
  const handleConfigChange = (field: string, value: any) => {
    if (!config) return;
    
    updateConfig({
      ...config,
      [field]: value
    });
  };
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error) {
    return (
      <ErrorMessage 
        message={error.message} 
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
          <ConfigurationItem
            label="Log Level"
            description="Minimum log level to collect"
            type="select"
            options={[
              { label: 'Debug', value: 'debug' },
              { label: 'Info', value: 'info' },
              { label: 'Warning', value: 'warn' },
              { label: 'Error', value: 'error' }
            ]}
            value={config.logLevel}
            configKey="logLevel"
            onChange={handleConfigChange}
          />
          
          <ConfigurationItem
            label="Sampling Rate"
            description="Percentage of requests to monitor (0.1 = 10%)"
            type="number"
            value={config.samplingRate}
            configKey="samplingRate"
            onChange={handleConfigChange}
            min={0}
            max={1}
          />
          
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
