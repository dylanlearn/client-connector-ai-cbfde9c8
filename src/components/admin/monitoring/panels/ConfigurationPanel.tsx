
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SaveButton } from '../controls/SaveButton';
import { LoadingState } from '../controls/LoadingState';
import { ErrorMessage } from '../controls/ErrorMessage';
import { MonitoringConfiguration } from '@/utils/monitoring/types';

interface ConfigurationPanelProps {
  config?: MonitoringConfiguration;
  updateConfig?: (config: Partial<MonitoringConfiguration>) => Promise<boolean>;
}

export function ConfigurationPanel({ config, updateConfig }: ConfigurationPanelProps) {
  const [localConfig, setLocalConfig] = useState<MonitoringConfiguration | null>(config || null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSaveChanges = async () => {
    if (!localConfig || !updateConfig) return;
    
    setIsSaving(true);
    try {
      await updateConfig(localConfig);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save configuration'));
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleToggleSetting = (key: keyof MonitoringConfiguration) => {
    if (!localConfig) return;
    
    setLocalConfig({
      ...localConfig,
      [key]: !localConfig[key]
    });
  };
  
  const handleUpdateSamplingRate = (value: string) => {
    if (!localConfig) return;
    
    const rate = parseFloat(value);
    if (isNaN(rate) || rate < 0 || rate > 1) return;
    
    setLocalConfig({
      ...localConfig,
      samplingRate: rate
    });
  };

  if (!localConfig) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Monitoring Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <ErrorMessage 
              message={error.message} 
              title="Configuration Error" 
              className="mb-4"
            />
          )}
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="monitoring-enabled" className="font-medium">Enable Monitoring</Label>
                <p className="text-sm text-muted-foreground">
                  Collect and analyze system performance and error data
                </p>
              </div>
              <Switch 
                id="monitoring-enabled"
                checked={localConfig.enabled}
                onCheckedChange={() => handleToggleSetting('enabled')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sampling-rate" className="font-medium">Sampling Rate</Label>
                <p className="text-sm text-muted-foreground">
                  Percentage of requests to monitor (0.1 = 10%)
                </p>
              </div>
              <Input
                id="sampling-rate"
                type="number"
                value={localConfig.samplingRate}
                onChange={(e) => handleUpdateSamplingRate(e.target.value)}
                min="0"
                max="1"
                step="0.1"
                className="w-24"
              />
            </div>
            
            <div className="pt-4 flex justify-end">
              <SaveButton 
                isSaving={isSaving}
                onSave={handleSaveChanges}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
