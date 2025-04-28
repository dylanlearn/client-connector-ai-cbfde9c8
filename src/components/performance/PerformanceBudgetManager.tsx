
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MetricsDisplay } from './MetricsDisplay';
import { BudgetForm } from './BudgetForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DesignSystemIntegrationPanel } from '../design/DesignSystemIntegrationPanel';

interface PerformanceBudgetManagerProps {
  wireframeId: string;
  projectId: string;
}

export const PerformanceBudgetManager: React.FC<PerformanceBudgetManagerProps> = ({ wireframeId, projectId }) => {
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
        <Tabs defaultValue="budget" className="space-y-6">
          <TabsList>
            <TabsTrigger value="budget">Budgets</TabsTrigger>
            <TabsTrigger value="design-system">Design System</TabsTrigger>
          </TabsList>
          
          <TabsContent value="budget" className="space-y-6">
            <BudgetForm wireframeId={wireframeId} projectId={projectId} />
            <MetricsDisplay budgets={budgets} isLoading={isLoading} />
          </TabsContent>
          
          <TabsContent value="design-system">
            <DesignSystemIntegrationPanel wireframeId={wireframeId} projectId={projectId} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
