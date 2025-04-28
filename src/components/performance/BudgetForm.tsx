
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BudgetFormTokens } from './BudgetFormTokens';
import { supabase } from '@/integrations/supabase/client';

export interface BudgetFormData {
  name: string;
  metric_name: string;
  target_value: string;
  unit: string;
  metric_type: string;
  importance: string;
  color_token?: string;
}

interface BudgetFormProps {
  wireframeId: string;
  projectId: string;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({ wireframeId, projectId }) => {
  const { toast } = useToast();
  
  const form = useForm<BudgetFormData>({
    defaultValues: {
      name: '',
      metric_name: '',
      target_value: '',
      unit: 'ms',
      metric_type: 'load_time',
      importance: 'high',
    }
  });
  
  const onSubmit = async (data: BudgetFormData) => {
    try {
      // First create the budget
      const { data: budgetData, error: budgetError } = await supabase
        .from('performance_budgets')
        .insert([
          { 
            name: data.name, 
            wireframe_id: wireframeId,
            description: `Performance budget for ${data.metric_name}`
          }
        ])
        .select();
      
      if (budgetError) throw budgetError;
      
      if (budgetData && budgetData.length > 0) {
        // Then create the metric
        const { error: metricError } = await supabase
          .from('performance_metrics')
          .insert([
            { 
              budget_id: budgetData[0].id,
              metric_name: data.metric_name,
              target_value: parseFloat(data.target_value),
              unit: data.unit,
              metric_type: data.metric_type,
              importance: data.importance
            }
          ]);
        
        if (metricError) throw metricError;
        
        toast({
          title: "Success",
          description: "Performance budget created successfully"
        });
        
        form.reset();
      }
    } catch (error) {
      console.error('Error creating performance budget:', error);
      toast({
        title: "Error",
        description: "Failed to create performance budget",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <h3 className="font-medium text-lg">Add Performance Budget</h3>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Name</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Homepage load time" {...field} />
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
                    <Input placeholder="E.g., First Contentful Paint" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="target_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Value</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="E.g., 1000" {...field} />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ms">Milliseconds (ms)</SelectItem>
                        <SelectItem value="s">Seconds (s)</SelectItem>
                        <SelectItem value="kb">Kilobytes (KB)</SelectItem>
                        <SelectItem value="mb">Megabytes (MB)</SelectItem>
                        <SelectItem value="count">Count</SelectItem>
                        <SelectItem value="score">Score</SelectItem>
                        <SelectItem value="percent">Percentage (%)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
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
                      <SelectItem value="resource_size">Resource Size</SelectItem>
                      <SelectItem value="request_count">Request Count</SelectItem>
                      <SelectItem value="performance_score">Performance Score</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="importance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Importance</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select importance" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <BudgetFormTokens projectId={projectId} form={form} />
            
            <Button type="submit" className="w-full">Add Performance Budget</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
