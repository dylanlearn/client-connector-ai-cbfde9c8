
import React from 'react';
import { useVisualState, ComponentState } from '@/contexts/VisualStateContext';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface StateControlsProps {
  className?: string;
}

/**
 * Control panel for managing visual state transitions and previews.
 * Allows adjusting timing, easing functions, and state selection.
 */
export function StateControls({ className }: StateControlsProps) {
  const {
    previewState,
    setPreviewState,
    transitionDuration,
    setTransitionDuration,
    transitionTimingFunction,
    setTransitionTimingFunction,
    transitionDelay,
    setTransitionDelay,
  } = useVisualState();

  // Available component states
  const componentStates: ComponentState[] = ['default', 'hover', 'active', 'focus', 'disabled'];

  // Common easing functions
  const easingFunctions = [
    { value: 'ease', label: 'Ease' },
    { value: 'linear', label: 'Linear' },
    { value: 'ease-in', label: 'Ease In' },
    { value: 'ease-out', label: 'Ease Out' },
    { value: 'ease-in-out', label: 'Ease In Out' },
    { value: 'cubic-bezier(0.4, 0, 0.2, 1)', label: 'Material Standard' },
    { value: 'cubic-bezier(0.8, 0, 0.2, 1)', label: 'Gentle Bounce' },
    { value: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', label: 'Swift' },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-3">
        <Label>Component State</Label>
        <div className="flex flex-wrap gap-2">
          {componentStates.map((state) => (
            <button
              key={state}
              type="button"
              onClick={() => setPreviewState(state)}
              className={cn(
                'px-3 py-1.5 text-sm rounded-md capitalize transition-colors',
                previewState === state
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              {state}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <Label htmlFor="duration-slider">Transition Duration: {transitionDuration}ms</Label>
        </div>
        <Slider
          id="duration-slider"
          min={0}
          max={1500}
          step={50}
          value={[transitionDuration]}
          onValueChange={(values) => setTransitionDuration(values[0])}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <Label htmlFor="delay-slider">Transition Delay: {transitionDelay}ms</Label>
        </div>
        <Slider
          id="delay-slider"
          min={0}
          max={1000}
          step={50}
          value={[transitionDelay]}
          onValueChange={(values) => setTransitionDelay(values[0])}
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="timing-function">Timing Function</Label>
        <Select
          value={transitionTimingFunction}
          onValueChange={setTransitionTimingFunction}
        >
          <SelectTrigger id="timing-function" className="w-full">
            <SelectValue placeholder="Select timing function" />
          </SelectTrigger>
          <SelectContent>
            {easingFunctions.map((easing) => (
              <SelectItem key={easing.value} value={easing.value}>
                {easing.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default StateControls;
