
export interface MonitoringControlsProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  onPeriodChange: (period: 'hour' | 'day' | 'week') => void;
  selectedPeriod: 'hour' | 'day' | 'week';
  autoRefresh: boolean;
  onAutoRefreshToggle: (enabled: boolean) => void;
  redisConnected?: boolean;
  onConfigUpdate?: () => Promise<void>;
}
