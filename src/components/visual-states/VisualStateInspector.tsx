
import React, { useState, useEffect } from 'react';
import { useVisualState, ComponentState } from '@/contexts/VisualStateContext';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface VisualStateInspectorProps {
  className?: string;
}

/**
 * A panel for controlling and inspecting component visual states
 */
const VisualStateInspector: React.FC<VisualStateInspectorProps> = ({
  className,
}) => {
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
  
  // Track if we're in idle playback mode
  const [isIdlePlayback, setIsIdlePlayback] = useState(false);
  
  // Set up state cycling for playback
  useEffect(() => {
    if (!isIdlePlayback) return;
    
    const states: ComponentState[] = ['default', 'hover', 'active', 'focus', 'disabled'];
    let stateIndex = states.indexOf(previewState);
    
    const interval = setInterval(() => {
      stateIndex = (stateIndex + 1) % states.length;
      setPreviewState(states[stateIndex]);
    }, transitionDuration + 1000); // Add extra time to view the state
    
    return () => clearInterval(interval);
  }, [isIdlePlayback, previewState, setPreviewState, transitionDuration]);
  
  // Handle state changes
  const handleStateChange = (state: ComponentState) => {
    setPreviewState(state);
    setIsIdlePlayback(false);
  };
  
  // Toggle playback
  const togglePlayback = () => {
    setIsIdlePlayback(!isIdlePlayback);
  };
  
  return (
    <div className={cn("p-4 border rounded-md bg-background", className)}>
      <h3 className="font-medium text-lg mb-4">Visual State Inspector</h3>
      
      <Tabs defaultValue="state" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="state">States</TabsTrigger>
          <TabsTrigger value="transition">Transitions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="state" className="space-y-4">
          <div className="space-y-2">
            <Label>Current State</Label>
            <RadioGroup 
              value={previewState} 
              onValueChange={(value) => handleStateChange(value as ComponentState)}
              className="flex flex-wrap gap-3 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="state-default" />
                <label htmlFor="state-default" className="text-sm cursor-pointer">Default</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hover" id="state-hover" />
                <label htmlFor="state-hover" className="text-sm cursor-pointer">Hover</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="state-active" />
                <label htmlFor="state-active" className="text-sm cursor-pointer">Active</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="focus" id="state-focus" />
                <label htmlFor="state-focus" className="text-sm cursor-pointer">Focus</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="disabled" id="state-disabled" />
                <label htmlFor="state-disabled" className="text-sm cursor-pointer">Disabled</label>
              </div>
            </RadioGroup>
          </div>
          
          <button
            className={cn(
              "px-4 py-2 rounded-md text-sm w-full transition",
              isIdlePlayback 
                ? "bg-primary/20 text-primary hover:bg-primary/30" 
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            onClick={togglePlayback}
          >
            {isIdlePlayback ? "Stop Animation" : "Play State Cycle"}
          </button>
        </TabsContent>
        
        <TabsContent value="transition" className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="duration-slider">Duration: {transitionDuration}ms</Label>
            </div>
            <Slider 
              id="duration-slider"
              min={0} 
              max={2000} 
              step={50} 
              value={[transitionDuration]} 
              onValueChange={(values) => setTransitionDuration(values[0])} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timing-function">Timing Function</Label>
            <select 
              id="timing-function"
              className="w-full border rounded p-2"
              value={transitionTimingFunction}
              onChange={(e) => setTransitionTimingFunction(e.target.value)}
            >
              <option value="ease">ease</option>
              <option value="ease-in">ease-in</option>
              <option value="ease-out">ease-out</option>
              <option value="ease-in-out">ease-in-out</option>
              <option value="linear">linear</option>
              <option value="step-start">step-start</option>
              <option value="step-end">step-end</option>
              <option value="cubic-bezier(0.25, 0.1, 0.25, 1)">cubic-bezier (standard)</option>
              <option value="cubic-bezier(0.42, 0, 1, 1)">cubic-bezier (accelerate)</option>
              <option value="cubic-bezier(0, 0, 0.58, 1)">cubic-bezier (decelerate)</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="delay-slider">Delay: {transitionDelay}ms</Label>
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
          
          <div className="relative mt-6 pt-6 border-t">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <div className="w-16 h-16 bg-primary rounded-full animate-ping" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Current: <span className="font-mono">{`transition: all ${transitionDuration}ms ${transitionTimingFunction} ${transitionDelay}ms`}</span>
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VisualStateInspector;
