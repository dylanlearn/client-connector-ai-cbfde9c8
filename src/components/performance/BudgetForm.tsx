
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
import { Input } from '@/components/ui/input';

interface BudgetFormProps {
  wireframeId: string;
}

interface BudgetFormData {
  name: string;
  description?: string;
  metric_name: string;
  target_value: number;
  unit: string;
  metric_type: 'load_time' | 'interaction' | 'resource_usage';
}

export const BudgetForm = ({ wireframeId }: BudgetFormProps) => {
  const form = useForm<BudgetFormData>();

  const onSubmit = async (data: BudgetFormData) => {
    try {
      // First create the budget
      const { data: budget, error: budgetError } = await supabase
        .from('performance_budgets')
        .insert({
          wireframe_id: wireframeId,
          name: data.name,
          description: data.description
        })
        .select()
        .single();

      if (budgetError) throw budgetError;

      // Then create the associated metric
      const { error: metricError } = await supabase
        .from('performance_metrics')
        .insert({
          budget_id: budget.id,
          metric_name: data.metric_name,
          metric_type: data.metric_type,
          target_value: data.target_value,
          unit: data.unit
        });

      if (metricError) throw metricError;

      toast.success('Performance budget created successfully');
      form.reset();
    } catch (error) {
      toast.error('Failed to create performance budget');
      console.error('Error creating budget:', error);
    }
  };

  return (
    <Card className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Name</FormLabel>
                <FormControl>
                  <Input placeholder="Main page load time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="metric_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Metric Name</FormLabel>
                <FormControl>
                  <Input placeholder="Time to First Byte" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="target_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Value</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Input placeholder="ms" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Create Budget</Button>
        </form>
      </Form>
    </Card>
  );
};
