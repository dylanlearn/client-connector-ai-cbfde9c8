
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type SystemStatus } from '@/utils/monitoring/system-status';
import SystemStatusDisplay from './SystemStatusDisplay';

interface SystemStatusPanelProps {
  systemStatus: SystemStatus;
  lastUpdated?: string;
}

const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({ systemStatus, lastUpdated }) => {
  if (!systemStatus) return null;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">System Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(systemStatus.components).map(([name, data]) => (
            <SystemStatusDisplay 
              key={name}
              name={name}
              status={data.status}
              metrics={data.metrics}
            />
          ))}
        </div>
        
        {lastUpdated && (
          <div className="mt-4 text-xs text-muted-foreground">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemStatusPanel;
