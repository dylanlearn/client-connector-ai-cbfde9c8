
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface MetricsDisplayProps {
  budgets: any[];
  isLoading: boolean;
}

export const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ budgets, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!budgets?.length) {
    return (
      <Alert>
        <AlertTitle>No metrics configured</AlertTitle>
        <AlertDescription>
          Configure performance budgets to start tracking metrics.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {budgets.map((budget) => (
        <div key={budget.id} className="space-y-2">
          <h3 className="font-medium">{budget.name}</h3>
          {budget.performance_metrics?.map((metric: any) => (
            <div key={metric.id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{metric.metric_name}</span>
                <span>{metric.target_value}{metric.unit}</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
