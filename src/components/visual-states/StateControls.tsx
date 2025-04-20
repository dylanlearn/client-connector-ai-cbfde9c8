
import React from 'react';
import { useVisualState, ComponentState } from '@/contexts/VisualStateContext';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const StateControls: React.FC = () => {
  const {
    previewState,
    setPreviewState,
    transitionDuration,
    setTransitionDuration,
    transitionTimingFunction,
    setTransitionTimingFunction,
    transitionDelay,
    setTransitionDelay
  } = useVisualState();

  const states: ComponentState[] = ['default', 'hover', 'active', 'focus', 'disabled'];
  const timingFunctions = [
    'linear',
    'ease',
    'ease-in',
    'ease-out',
    'ease-in-out',
    'cubic-bezier(0.4, 0, 0.2, 1)', // Tailwind's DEFAULT
    'cubic-bezier(0.4, 0, 1, 1)',   // Tailwind's IN
    'cubic-bezier(0, 0, 0.2, 1)',   // Tailwind's OUT
    'cubic-bezier(0.4, 0, 0.6, 1)'  // Tailwind's IN-OUT
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* State Selection */}
      <div>
        <h3 className="text-base font-medium mb-3">Component State</h3>
        <RadioGroup
          value={previewState}
          onValueChange={(value) => setPreviewState(value as ComponentState)}
          className="flex flex-wrap gap-2 md:gap-4"
        >
          {states.map((state) => (
            <div key={state} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={state} 
                id={`state-${state}`} 
                className="text-blue-600" 
              />
              <Label htmlFor={`state-${state}`} className="capitalize">
                {state}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Transition Duration */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="duration">Transition Duration: {transitionDuration}ms</Label>
        </div>
        <Slider
          id="duration"
          min={0}
          max={1000}
          step={50}
          value={[transitionDuration]}
          onValueChange={(value) => setTransitionDuration(value[0])}
          className="w-full"
        />
      </div>

      {/* Transition Delay */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="delay">Transition Delay: {transitionDelay}ms</Label>
        </div>
        <Slider
          id="delay"
          min={0}
          max={500}
          step={10}
          value={[transitionDelay]}
          onValueChange={(value) => setTransitionDelay(value[0])}
          className="w-full"
        />
      </div>

      {/* Timing Function */}
      <div>
        <Label htmlFor="timing-function" className="block mb-2">
          Timing Function
        </Label>
        <Select
          value={transitionTimingFunction}
          onValueChange={setTransitionTimingFunction}
        >
          <SelectTrigger id="timing-function" className="w-full">
            <SelectValue placeholder="Select timing function" />
          </SelectTrigger>
          <SelectContent>
            {timingFunctions.map(fn => (
              <SelectItem key={fn} value={fn}>
                {fn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
