
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Clock, Bell, BellOff } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Switch } from '@/components/ui/switch';
import { MonitoringControlsProps } from './MonitoringControls.props';

export function MonitoringControls({ 
  onRefresh, 
  isRefreshing, 
  onPeriodChange,
  selectedPeriod,
  autoRefresh,
  onAutoRefreshToggle,
  redisConnected,
  onConfigUpdate
}: MonitoringControlsProps) {
  return (
    <div className="flex items-center gap-4 p-2 border rounded-md bg-background">
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="relative"
      >
        <RefreshCcw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
        Refresh
      </Button>

      <div className="flex items-center gap-2 border-l pl-4">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <ToggleGroup type="single" value={selectedPeriod} onValueChange={(value) => {
          if (value) onPeriodChange(value as 'hour' | 'day' | 'week');
        }}>
          <ToggleGroupItem value="hour" size="sm">1h</ToggleGroupItem>
          <ToggleGroupItem value="day" size="sm">24h</ToggleGroupItem>
          <ToggleGroupItem value="week" size="sm">7d</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex items-center gap-2 border-l pl-4">
        {autoRefresh ? <Bell className="h-4 w-4 text-primary" /> : <BellOff className="h-4 w-4 text-muted-foreground" />}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Auto-refresh</span>
          <Switch checked={autoRefresh} onCheckedChange={onAutoRefreshToggle} />
        </div>
      </div>
    </div>
  );
}
