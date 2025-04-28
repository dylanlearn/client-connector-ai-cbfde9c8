
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface RiskAssessmentFormProps {
  wireframeId: string;
}

interface RiskTemplate {
  id: string;
  name: string;
  description: string;
  risk_factors: {
    factors: Array<{
      name: string;
      weight: number;
      criteria: string[];
    }>;
  };
  mitigation_strategies: {
    strategies: Array<{
      factor: string;
      suggestions: string[];
    }>;
  };
  category_id: string;
}

interface RiskCategory {
  id: string;
  name: string;
  description: string;
}

export const RiskAssessmentForm: React.FC<RiskAssessmentFormProps> = ({ wireframeId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [templates, setTemplates] = useState<RiskTemplate[]>([]);
  const [categories, setCategories] = useState<RiskCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [riskLevel, setRiskLevel] = useState<string>('medium');
  const [mitigationPlan, setMitigationPlan] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<RiskTemplate | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch risk categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('risk_categories')
          .select('*')
          .order('name');

        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);

        // Fetch risk templates
        const { data: templatesData, error: templatesError } = await supabase
          .from('risk_assessment_templates')
          .select('*')
          .order('name');

        if (templatesError) throw templatesError;
        setTemplates(templatesData || []);

        if (templatesData && templatesData.length > 0) {
          const categoryId = templatesData[0].category_id;
          setSelectedCategoryId(categoryId || '');
        }
      } catch (error) {
        console.error('Error fetching risk data:', error);
        toast.error('Failed to load risk assessment data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      const categoryTemplates = templates.filter(t => t.category_id === selectedCategoryId);
      if (categoryTemplates.length > 0) {
        setSelectedTemplateId(categoryTemplates[0].id);
      }
    }
  }, [selectedCategoryId, templates]);

  useEffect(() => {
    if (selectedTemplateId) {
      const template = templates.find(t => t.id === selectedTemplateId);
      setSelectedTemplate(template || null);
    } else {
      setSelectedTemplate(null);
    }
  }, [selectedTemplateId, templates]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTemplateId || !riskLevel) {
      toast.error('Please select a template and risk level');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const template = templates.find(t => t.id === selectedTemplateId);
      if (!template) throw new Error('Selected template not found');

      const { error } = await supabase
        .from('wireframe_risk_assessments')
        .insert({
          wireframe_id: wireframeId,
          template_id: selectedTemplateId,
          risk_level: riskLevel,
          risk_factors: template.risk_factors,
          mitigation_plan: {
            plan: mitigationPlan,
            recommended_strategies: template.mitigation_strategies
          },
          status: 'open',
        });

      if (error) throw error;

      toast.success('Risk assessment created successfully');
      setMitigationPlan('');
    } catch (error) {
      console.error('Error creating risk assessment:', error);
      toast.error('Failed to create risk assessment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-6">Loading risk assessment data...</div>;
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Risk Category</Label>
            <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select risk category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="template">Risk Template</Label>
            <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
              <SelectTrigger>
                <SelectValue placeholder="Select risk template" />
              </SelectTrigger>
              <SelectContent>
                {templates
                  .filter(template => !selectedCategoryId || template.category_id === selectedCategoryId)
                  .map(template => (
                    <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedTemplate && (
            <div className="space-y-4 border rounded-md p-4 bg-muted/30">
              <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Risk Factors:</h4>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  {selectedTemplate.risk_factors?.factors?.map((factor, index) => (
                    <li key={index}>
                      <span className="font-medium">{factor.name}</span> (Weight: {factor.weight})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Risk Level Assessment</Label>
            <RadioGroup value={riskLevel} onValueChange={setRiskLevel} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="text-green-600 font-medium">Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="text-yellow-600 font-medium">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="text-orange-600 font-medium">High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="critical" id="critical" />
                <Label htmlFor="critical" className="text-red-600 font-medium">Critical</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mitigationPlan">Mitigation Plan</Label>
            <Textarea
              id="mitigationPlan"
              placeholder="Describe how you plan to mitigate these risks"
              value={mitigationPlan}
              onChange={(e) => setMitigationPlan(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="pt-2">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Creating...' : 'Create Risk Assessment'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
