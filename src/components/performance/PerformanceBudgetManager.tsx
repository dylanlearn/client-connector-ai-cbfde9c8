
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MetricsDisplay } from './MetricsDisplay';
import { BudgetForm } from './BudgetForm';

interface PerformanceBudgetManagerProps {
  wireframeId: string;
}

export const PerformanceBudgetManager: React.FC<PerformanceBudgetManagerProps> = ({ wireframeId }) => {
  const { data: budgets, isLoading } = useQuery({
    queryKey: ['performance-budgets', wireframeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('performance_budgets')
        .select(`
          *,
          performance_metrics (*)
        `)
        .eq('wireframe_id', wireframeId);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Budget</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <BudgetForm wireframeId={wireframeId} />
          <MetricsDisplay budgets={budgets} isLoading={isLoading} />
        </div>
      </CardContent>
    </Card>
  );
};
