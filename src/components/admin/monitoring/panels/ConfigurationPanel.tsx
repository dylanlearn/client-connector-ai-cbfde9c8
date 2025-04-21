
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonitoringControls } from '../controls/MonitoringControls';

interface ConfigurationPanelProps {
  redisConnected?: boolean;
  onSaveChanges?: () => Promise<void>;
}

export function ConfigurationPanel({ redisConnected, onSaveChanges }: ConfigurationPanelProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'hour' | 'day' | 'week'>('day');
  const [autoRefresh, setAutoRefresh] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monitoring Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <MonitoringControls 
          redisConnected={redisConnected} 
          onConfigUpdate={onSaveChanges}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onPeriodChange={setSelectedPeriod}
          selectedPeriod={selectedPeriod}
          autoRefresh={autoRefresh}
          onAutoRefreshToggle={setAutoRefresh}
        />
      </CardContent>
    </Card>
  );
}
