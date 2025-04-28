
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface BudgetFormProps {
  wireframeId: string;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({ wireframeId }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    metricType: 'load_time',
    metricName: '',
    targetValue: '',
    unit: 'ms'
  });

  const createBudgetMutation = useMutation({
    mutationFn: async (data: any) => {
      // First create the budget
      const { data: budget, error: budgetError } = await supabase
        .from('performance_budgets')
        .insert({
          wireframe_id: wireframeId,
          name: data.name,
          description: `Performance budget for ${data.metricName}`
        })
        .select()
        .single();
      
      if (budgetError) throw budgetError;
      
      // Then create the metric
      const { data: metric, error: metricError } = await supabase
        .from('performance_metrics')
        .insert({
          budget_id: budget.id,
          metric_type: data.metricType,
          metric_name: data.metricName,
          target_value: parseFloat(data.targetValue),
          warning_threshold: parseFloat(data.targetValue) * 1.2,
          critical_threshold: parseFloat(data.targetValue) * 1.5,
          unit: data.unit
        });
      
      if (metricError) throw metricError;
      
      return { budget, metric };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performance-budgets', wireframeId] });
      setFormData({
        name: '',
        metricType: 'load_time',
        metricName: '',
        targetValue: '',
        unit: 'ms'
      });
      toast({ 
        title: "Budget Created",
        description: "Performance budget has been created successfully" 
      });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error Creating Budget",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    // Set default units based on metric type
    if (name === 'metricType') {
      let defaultUnit = 'ms';
      if (value === 'resource') defaultUnit = 'kb';
      else if (value === 'interaction') defaultUnit = 'ms';
      setFormData(prev => ({ ...prev, unit: defaultUnit }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBudgetMutation.mutate(formData);
  };

  const metricTypes = [
    { value: 'load_time', label: 'Load Time' },
    { value: 'interaction', label: 'Interaction Responsiveness' },
    { value: 'resource', label: 'Resource Usage' }
  ];

  const unitOptions = {
    'load_time': [
      { value: 'ms', label: 'Milliseconds' },
      { value: 's', label: 'Seconds' }
    ],
    'interaction': [
      { value: 'ms', label: 'Milliseconds' },
      { value: 'fps', label: 'Frames Per Second' }
    ],
    'resource': [
      { value: 'kb', label: 'Kilobytes' },
      { value: 'mb', label: 'Megabytes' },
      { value: 'count', label: 'Request Count' }
    ]
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Budget Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="E.g., Critical Path Load Time"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="metricType">Metric Type</Label>
              <Select 
                value={formData.metricType} 
                onValueChange={(value) => handleSelectChange('metricType', value)}
              >
                <SelectTrigger id="metricType">
                  <SelectValue placeholder="Select metric type" />
                </SelectTrigger>
                <SelectContent>
                  {metricTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="metricName">Metric Name</Label>
              <Input
                id="metricName"
                name="metricName"
                placeholder="E.g., First Contentful Paint"
                value={formData.metricName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="targetValue">Target Value</Label>
              <Input
                id="targetValue"
                name="targetValue"
                type="number"
                step="0.01"
                min="0"
                placeholder="E.g., 1000"
                value={formData.targetValue}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select 
                value={formData.unit} 
                onValueChange={(value) => handleSelectChange('unit', value)}
              >
                <SelectTrigger id="unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {unitOptions[formData.metricType as keyof typeof unitOptions]?.map(unit => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={createBudgetMutation.isPending}
          >
            {createBudgetMutation.isPending ? 'Adding...' : 'Add Performance Budget'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
