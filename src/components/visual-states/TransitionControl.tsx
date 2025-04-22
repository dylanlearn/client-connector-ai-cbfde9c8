
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TransitionConfig, TransitionState } from './types/transition-types';
import { useTransitionManager } from '@/hooks/use-transition-manager';

interface TransitionControlProps {
  onTransitionChange?: (style: React.CSSProperties) => void;
}

export const TransitionControl: React.FC<TransitionControlProps> = ({
  onTransitionChange
}) => {
  const {
    transitions,
    currentState,
    addTransition,
    updateTransition,
    removeTransition,
    setCurrentState,
    getTransitionStyle
  } = useTransitionManager();

  const states: TransitionState[] = ['initial', 'active', 'hover', 'focus', 'disabled', 'loading'];

  const handleAddTransition = () => {
    addTransition({
      name: `Transition ${transitions.length + 1}`,
      duration: 300,
      timing: 'ease',
      dependencies: [],
      active: true
    });
  };

  const handleStateChange = (newState: TransitionState) => {
    setCurrentState(newState);
    const style = getTransitionStyle(newState);
    onTransitionChange?.(style);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transition Control</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Current State</Label>
          <div className="flex flex-wrap gap-2">
            {states.map(state => (
              <Button
                key={state}
                variant={state === currentState ? 'default' : 'outline'}
                onClick={() => handleStateChange(state)}
              >
                {state}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Transitions</Label>
            <Button onClick={handleAddTransition} variant="outline" size="sm">
              Add Transition
            </Button>
          </div>
          
          <div className="space-y-2">
            {transitions.map(transition => (
              <Card key={transition.id} className="p-2">
                <div className="space-y-2">
                  <Input
                    value={transition.name}
                    onChange={(e) => updateTransition(transition.id, { name: e.target.value })}
                    className="text-sm"
                  />
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={transition.duration}
                      onChange={(e) => updateTransition(transition.id, { duration: Number(e.target.value) })}
                      className="w-20"
                    />
                    <Input
                      value={transition.timing}
                      onChange={(e) => updateTransition(transition.id, { timing: e.target.value })}
                    />
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removeTransition(transition.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
