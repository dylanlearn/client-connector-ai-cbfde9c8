
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RiskList } from './RiskList';
import { RiskAssessmentForm } from './RiskAssessmentForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DesignSystemIntegrationPanel } from '../design/DesignSystemIntegrationPanel';

interface RiskAssessmentManagerProps {
  wireframeId: string;
  projectId: string;
}

export const RiskAssessmentManager: React.FC<RiskAssessmentManagerProps> = ({ wireframeId, projectId }) => {
  const { data: assessments, isLoading } = useQuery({
    queryKey: ['risk-assessments', wireframeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wireframe_risk_assessments')
        .select(`
          *,
          risk_assessment_templates (
            *,
            risk_categories (*)
          )
        `)
        .eq('wireframe_id', wireframeId);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Implementation Risk Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="risks" className="space-y-6">
          <TabsList>
            <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
            <TabsTrigger value="design-system">Design System</TabsTrigger>
          </TabsList>
          
          <TabsContent value="risks" className="space-y-6">
            <RiskAssessmentForm wireframeId={wireframeId} projectId={projectId} />
            <RiskList assessments={assessments} isLoading={isLoading} />
          </TabsContent>
          
          <TabsContent value="design-system">
            <DesignSystemIntegrationPanel wireframeId={wireframeId} projectId={projectId} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
