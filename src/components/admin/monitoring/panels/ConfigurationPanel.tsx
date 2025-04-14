
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfigurationItem } from '../controls/ConfigurationItem';
import { MonitoringConfiguration } from '@/utils/monitoring/types';

interface ConfigurationPanelProps {
  config: MonitoringConfiguration;
  updateConfig: (newConfig: Partial<MonitoringConfiguration>) => Promise<boolean>;
}

export function ConfigurationPanel({ config, updateConfig }: ConfigurationPanelProps) {
  const handleConfigChange = (key: string, value: any) => {
    // Handle nested properties like components.api
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      updateConfig({
        [parent]: {
          ...config[parent as keyof MonitoringConfiguration],
          [child]: value
        }
      });
    } else {
      updateConfig({ [key]: value });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ConfigurationItem
          label="Monitoring Status"
          description="Enable or disable the monitoring system"
          type="toggle"
          value={config.enabled}
          configKey="enabled"
          onChange={handleConfigChange}
        />
        
        <ConfigurationItem
          label="Log Level"
          description="Set the log verbosity level"
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
          description="Percentage of operations to monitor (0.1-1.0)"
          type="number"
          value={config.samplingRate}
          configKey="samplingRate"
          onChange={handleConfigChange}
          min={0.1}
          max={1.0}
        />
        
        <ConfigurationItem
          label="Data Retention (days)"
          description="Number of days to retain monitoring data"
          type="number"
          value={config.retentionPeriod}
          configKey="retentionPeriod"
          onChange={handleConfigChange}
          min={1}
          max={365}
        />
        
        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-medium mb-4">Component Monitoring</h3>
          
          {Object.entries(config.components).map(([component, enabled]) => (
            <ConfigurationItem
              key={component}
              label={`${component.charAt(0).toUpperCase() + component.slice(1)} Monitoring`}
              description={`Enable monitoring for ${component} components`}
              type="toggle"
              value={enabled}
              configKey={`components.${component}`}
              onChange={handleConfigChange}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
