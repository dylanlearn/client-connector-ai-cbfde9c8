
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BudgetFormTokens } from './BudgetFormTokens';

interface BudgetFormProps {
  wireframeId: string;
  projectId: string;
}

interface BudgetFormData {
  name: string;
  description?: string;
  metric_name: string;
  target_value: number;
  unit: string;
  metric_type: 'load_time' | 'interaction' | 'resource_usage';
  color_token?: string; // New field for design token integration
}

export const BudgetForm = ({ wireframeId, projectId }: BudgetFormProps) => {
  const form = useForm<BudgetFormData>();

  const onSubmit = async (data: BudgetFormData) => {
    try {
      // First create the budget
      const { data: budget, error: budgetError } = await supabase
        .from('performance_budgets')
        .insert({
          wireframe_id: wireframeId,
          name: data.name,
          description: data.description,
          color_token: data.color_token // Store token reference
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Details about this performance budget" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              name="metric_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metric Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select metric type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="load_time">Load Time</SelectItem>
                      <SelectItem value="interaction">Interaction</SelectItem>
                      <SelectItem value="resource_usage">Resource Usage</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
          
          {/* Design Token Integration */}
          <BudgetFormTokens projectId={projectId} form={form} />

          <Button type="submit">Create Budget</Button>
        </form>
      </Form>
    </Card>
  );
};
