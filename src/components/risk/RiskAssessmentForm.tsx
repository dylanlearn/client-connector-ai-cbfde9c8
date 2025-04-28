
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, AlertCircle, AlertOctagon, Info } from 'lucide-react';
import { DesignSystemService, DesignToken } from '@/services/design-system/design-system-service';

interface RiskAssessmentFormProps {
  wireframeId: string;
  projectId: string;
}

interface RiskAssessmentFormData {
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  risk_factors: {
    description: string;
    impact: string;
  };
  mitigation_plan: {
    steps: string;
    resources: string;
  };
  design_token_id?: string; // New field for design token integration
}

const RiskLevelIcons = {
  low: <Info className="h-4 w-4" />,
  medium: <AlertCircle className="h-4 w-4" />,
  high: <AlertTriangle className="h-4 w-4" />,
  critical: <AlertOctagon className="h-4 w-4" />
};

export const RiskAssessmentForm = ({ wireframeId, projectId }: RiskAssessmentFormProps) => {
  const form = useForm<RiskAssessmentFormData>();
  const [colorTokens, setColorTokens] = useState<DesignToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (projectId) {
      loadTokens();
    }
  }, [projectId]);
  
  const loadTokens = async () => {
    setIsLoading(true);
    try {
      const data = await DesignSystemService.getDesignTokens(projectId);
      setColorTokens(data.filter(t => t.category === 'color'));
    } catch (error) {
      console.error('Error fetching design tokens:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: RiskAssessmentFormData) => {
    try {
      // Add design token to risk assessment
      const formData = {
        wireframe_id: wireframeId,
        risk_level: data.risk_level,
        risk_factors: data.risk_factors,
        mitigation_plan: data.mitigation_plan,
        status: 'identified',
        design_token_id: data.design_token_id
      };
      
      const { error } = await supabase
        .from('wireframe_risk_assessments')
        .insert(formData);

      if (error) throw error;

      toast.success('Risk assessment created successfully');
      form.reset();
    } catch (error) {
      toast.error('Failed to create risk assessment');
      console.error('Error creating risk assessment:', error);
    }
  };

  return (
    <Card className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="risk_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Risk Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center text-blue-500">
                        {RiskLevelIcons.low}
                        <span className="ml-2">Low</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center text-yellow-500">
                        {RiskLevelIcons.medium}
                        <span className="ml-2">Medium</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center text-orange-500">
                        {RiskLevelIcons.high}
                        <span className="ml-2">High</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="critical">
                      <div className="flex items-center text-red-500">
                        {RiskLevelIcons.critical}
                        <span className="ml-2">Critical</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Design Token Integration - Use color to highlight risk level */}
          <FormField
            control={form.control}
            name="design_token_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Risk Color (Optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select color token" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {colorTokens.map(token => (
                      <SelectItem key={token.id} value={token.id}>
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ 
                              backgroundColor: typeof token.value === 'string' ? token.value : undefined
                            }}
                          />
                          {token.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className="my-4" />

          <FormField
            control={form.control}
            name="risk_factors.description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Risk Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the potential risks..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="risk_factors.impact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Impact Assessment</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="What is the potential impact of this risk?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className="my-4" />

          <FormField
            control={form.control}
            name="mitigation_plan.steps"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mitigation Steps</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the steps to mitigate the risks..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="mitigation_plan.resources"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Required Resources</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="What resources are needed for mitigation?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Create Risk Assessment</Button>
        </form>
      </Form>
    </Card>
  );
};
