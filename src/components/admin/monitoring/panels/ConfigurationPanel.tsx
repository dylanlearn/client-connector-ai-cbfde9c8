
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonitoringControls } from '../MonitoringControls';

interface ConfigurationPanelProps {
  redisConnected?: boolean;
  onSaveChanges?: () => Promise<void>;
}

export function ConfigurationPanel({ redisConnected, onSaveChanges }: ConfigurationPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monitoring Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <MonitoringControls 
          redisConnected={redisConnected} 
          onConfigUpdate={onSaveChanges} 
        />
      </CardContent>
    </Card>
  );
}
