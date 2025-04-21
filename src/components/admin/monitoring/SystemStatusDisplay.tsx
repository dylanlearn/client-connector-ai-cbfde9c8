
import React from 'react';
import { Card } from '@/components/ui/card';

interface SystemStatusDisplayProps {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  metrics: Record<string, string | number>;
}

const SystemStatusDisplay: React.FC<SystemStatusDisplayProps> = ({ 
  name, 
  status,
  metrics
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      case 'outage': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card className="p-3 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium capitalize">{name}</h4>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {status}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        {Object.entries(metrics).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="text-muted-foreground">{key}:</span>
            <span className="font-mono">{value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SystemStatusDisplay;
