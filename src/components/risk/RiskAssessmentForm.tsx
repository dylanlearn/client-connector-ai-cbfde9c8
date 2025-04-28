
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface RiskAssessmentFormProps {
  wireframeId: string;
}

export const RiskAssessmentForm: React.FC<RiskAssessmentFormProps> = ({ wireframeId }) => {
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [riskLevel, setRiskLevel] = useState<string>('medium');
  const [riskFactors, setRiskFactors] = useState<string>('');
  const [mitigationPlan, setMitigationPlan] = useState<string>('');

  // Fetch risk assessment templates
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['risk-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('risk_assessment_templates')
        .select(`
          *,
          risk_categories (*)
        `);
      
      if (error) throw error;
      return data;
    }
  });

  // Create risk assessment mutation
  const createAssessmentMutation = useMutation({
    mutationFn: async (data: any) => {
      const { data: assessment, error } = await supabase
        .from('wireframe_risk_assessments')
        .insert({
          wireframe_id: wireframeId,
          template_id: data.templateId,
          risk_level: data.riskLevel,
          risk_factors: { description: data.riskFactors },
          mitigation_plan: data.mitigationPlan ? { strategy: data.mitigationPlan } : null,
          status: 'open'
        });
      
      if (error) throw error;
      return assessment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risk-assessments', wireframeId] });
      // Reset form
      setSelectedTemplate('');
      setRiskLevel('medium');
      setRiskFactors('');
      setMitigationPlan('');
      toast({ 
        title: "Risk Assessment Created",
        description: "Risk assessment has been created successfully" 
      });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error Creating Assessment",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAssessmentMutation.mutate({
      templateId: selectedTemplate,
      riskLevel,
      riskFactors,
      mitigationPlan
    });
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    // Pre-fill some fields based on the selected template
    const template = templates?.find(t => t.id === templateId);
    if (template && template.risk_factors) {
      const factors = template.risk_factors.factors
        ?.map((f: any) => f.name)
        ?.join(', ');
      setRiskFactors(`Consider: ${factors}`);
    }
  };

  if (templatesLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const riskLevels = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  return (
    <Card>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template">Risk Template</Label>
            <Select 
              value={selectedTemplate} 
              onValueChange={handleTemplateChange}
            >
              <SelectTrigger id="template">
                <SelectValue placeholder="Select risk template" />
              </SelectTrigger>
              <SelectContent>
                {templates?.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name} ({template.risk_categories?.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="riskLevel">Risk Level</Label>
            <Select 
              value={riskLevel} 
              onValueChange={setRiskLevel}
            >
              <SelectTrigger id="riskLevel">
                <SelectValue placeholder="Select risk level" />
              </SelectTrigger>
              <SelectContent>
                {riskLevels.map(level => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="riskFactors">Risk Factors</Label>
            <Textarea
              id="riskFactors"
              placeholder="Describe the risk factors"
              value={riskFactors}
              onChange={(e) => setRiskFactors(e.target.value)}
              rows={3}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mitigationPlan">Mitigation Plan (Optional)</Label>
            <Textarea
              id="mitigationPlan"
              placeholder="Describe mitigation strategies"
              value={mitigationPlan}
              onChange={(e) => setMitigationPlan(e.target.value)}
              rows={3}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={createAssessmentMutation.isPending}
          >
            {createAssessmentMutation.isPending ? 'Submitting...' : 'Submit Risk Assessment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
