
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface BudgetFormProps {
  wireframeId: string;
}

export const BudgetForm: React.FC<BudgetFormProps> = ({ wireframeId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [budgetName, setBudgetName] = useState('');
  const [budgetDescription, setBudgetDescription] = useState('');
  const [metricType, setMetricType] = useState<string>('load_time');
  const [metricName, setMetricName] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [unit, setUnit] = useState('ms');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!budgetName || !metricName || !targetValue) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create the performance budget
      const { data: budgetData, error: budgetError } = await supabase
        .from('performance_budgets')
        .insert({
          wireframe_id: wireframeId,
          name: budgetName,
          description: budgetDescription,
        })
        .select()
        .single();

      if (budgetError) throw budgetError;

      // Create the performance metric
      const targetValueNum = parseFloat(targetValue);
      const { error: metricError } = await supabase
        .from('performance_metrics')
        .insert({
          budget_id: budgetData.id,
          metric_type: metricType,
          metric_name: metricName,
          target_value: targetValueNum,
          warning_threshold: targetValueNum * 1.2, // 20% over target
          critical_threshold: targetValueNum * 1.5, // 50% over target
          unit: unit,
        });

      if (metricError) throw metricError;

      toast.success('Performance budget created successfully');
      
      // Reset form
      setBudgetName('');
      setBudgetDescription('');
      setMetricName('');
      setTargetValue('');
      setMetricType('load_time');
      setUnit('ms');
    } catch (error) {
      console.error('Error creating performance budget:', error);
      toast.error('Failed to create performance budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="budgetName">Budget Name *</Label>
            <Input
              id="budgetName"
              placeholder="e.g., Homepage Performance"
              value={budgetName}
              onChange={(e) => setBudgetName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="budgetDescription">Description</Label>
            <Textarea
              id="budgetDescription"
              placeholder="Describe this performance budget"
              value={budgetDescription}
              onChange={(e) => setBudgetDescription(e.target.value)}
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="metricType">Metric Type *</Label>
              <Select value={metricType} onValueChange={setMetricType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select metric type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="load_time">Load Time</SelectItem>
                  <SelectItem value="interaction">Interaction</SelectItem>
                  <SelectItem value="resource">Resource Usage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="metricName">Metric Name *</Label>
              <Input
                id="metricName"
                placeholder="e.g., First Contentful Paint"
                value={metricName}
                onChange={(e) => setMetricName(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetValue">Target Value *</Label>
              <Input
                id="targetValue"
                type="number"
                placeholder="Target value"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                required
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ms">Milliseconds (ms)</SelectItem>
                  <SelectItem value="s">Seconds (s)</SelectItem>
                  <SelectItem value="kb">Kilobytes (KB)</SelectItem>
                  <SelectItem value="mb">Megabytes (MB)</SelectItem>
                  <SelectItem value="score">Score</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="pt-2">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Creating...' : 'Create Performance Budget'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
