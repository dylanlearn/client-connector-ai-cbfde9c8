
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RiskList } from './RiskList';
import { RiskAssessmentForm } from './RiskAssessmentForm';

interface RiskAssessmentManagerProps {
  wireframeId: string;
}

export const RiskAssessmentManager: React.FC<RiskAssessmentManagerProps> = ({ wireframeId }) => {
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
        <div className="space-y-6">
          <RiskAssessmentForm wireframeId={wireframeId} />
          <RiskList assessments={assessments} isLoading={isLoading} />
        </div>
      </CardContent>
    </Card>
  );
};
