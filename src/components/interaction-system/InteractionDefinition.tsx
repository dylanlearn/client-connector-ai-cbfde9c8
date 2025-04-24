
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TransitionState } from '../visual-states/types/transition-types';

interface InteractionDefinitionProps {
  onInteractionChange?: (definition: InteractionDefinition) => void;
  className?: string;
}

export interface InteractionDefinition {
  eventType: 'click' | 'hover' | 'focus' | 'blur';
  targetState: TransitionState;
  animation?: string;
  dataEffect?: {
    type: 'update' | 'fetch' | 'submit';
    target: string;
    payload?: any;
  };
}

export const InteractionDefinition: React.FC<InteractionDefinitionProps> = ({
  onInteractionChange,
  className
}) => {
  const [definition, setDefinition] = React.useState<InteractionDefinition>({
    eventType: 'click',
    targetState: 'active',
  });

  const handleChange = (field: keyof InteractionDefinition, value: any) => {
    const newDefinition = { ...definition, [field]: value };
    setDefinition(newDefinition);
    onInteractionChange?.(newDefinition);
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Interaction Definition</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Event Type</Label>
          <Select 
            onValueChange={(value) => handleChange('eventType', value)}
            defaultValue={definition.eventType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="click">Click</SelectItem>
              <SelectItem value="hover">Hover</SelectItem>
              <SelectItem value="focus">Focus</SelectItem>
              <SelectItem value="blur">Blur</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Target State</Label>
          <Select 
            onValueChange={(value) => handleChange('targetState', value as TransitionState)}
            defaultValue={definition.targetState}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select target state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="initial">Initial</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="hover">Hover</SelectItem>
              <SelectItem value="focus">Focus</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
              <SelectItem value="loading">Loading</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Animation</Label>
          <Input 
            placeholder="Enter animation name"
            onChange={(e) => handleChange('animation', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
