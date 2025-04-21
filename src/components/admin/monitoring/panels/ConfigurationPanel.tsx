
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonitoringControls } from '../controls/MonitoringControls';

interface ConfigurationPanelProps {
  redisConnected?: boolean;
  onSaveChanges?: () => Promise<void>;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onPeriodChange?: (period: 'hour' | 'day' | 'week') => void;
  selectedPeriod?: 'hour' | 'day' | 'week';
  autoRefresh?: boolean;
  onAutoRefreshToggle?: (enabled: boolean) => void;
}

export function ConfigurationPanel({ 
  redisConnected, 
  onSaveChanges,
  onRefresh,
  isRefreshing = false,
  selectedPeriod = 'day',
  onPeriodChange,
  autoRefresh = false,
  onAutoRefreshToggle
}: ConfigurationPanelProps) {
  const [localIsRefreshing, setLocalIsRefreshing] = useState(false);
  const [localSelectedPeriod, setLocalSelectedPeriod] = useState<'hour' | 'day' | 'week'>(selectedPeriod);
  const [localAutoRefresh, setLocalAutoRefresh] = useState(autoRefresh);

  const handleRefresh = () => {
    setLocalIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => setLocalIsRefreshing(false), 1000);
    
    if (onRefresh) {
      onRefresh();
    }
  };
  
  const handlePeriodChange = (period: 'hour' | 'day' | 'week') => {
    setLocalSelectedPeriod(period);
    if (onPeriodChange) {
      onPeriodChange(period);
    }
  };
  
  const handleAutoRefreshToggle = (enabled: boolean) => {
    setLocalAutoRefresh(enabled);
    if (onAutoRefreshToggle) {
      onAutoRefreshToggle(enabled);
    }
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
          isRefreshing={isRefreshing || localIsRefreshing}
          onPeriodChange={handlePeriodChange}
          selectedPeriod={localSelectedPeriod}
          autoRefresh={localAutoRefresh}
          onAutoRefreshToggle={handleAutoRefreshToggle}
        />
      </CardContent>
    </Card>
  );
}
