
import React from 'react';
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

interface RiskAssessmentFormProps {
  wireframeId: string;
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
}

export const RiskAssessmentForm = ({ wireframeId }: RiskAssessmentFormProps) => {
  const form = useForm<RiskAssessmentFormData>();

  const onSubmit = async (data: RiskAssessmentFormData) => {
    try {
      const { error } = await supabase
        .from('wireframe_risk_assessments')
        .insert({
          wireframe_id: wireframeId,
          risk_level: data.risk_level,
          risk_factors: data.risk_factors,
          mitigation_plan: data.mitigation_plan,
          status: 'identified'
        });

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
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <Button type="submit">Create Risk Assessment</Button>
        </form>
      </Form>
    </Card>
  );
};
