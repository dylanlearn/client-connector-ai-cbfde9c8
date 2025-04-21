
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ComponentState, useVisualState } from '@/contexts/VisualStateContext';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useStateTransitions } from '@/hooks/use-state-transitions';
import { Play, Pause, RotateCcw, Clock, Settings } from 'lucide-react';

interface StatePreviewSystemProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  showControls?: boolean;
}

/**
 * A system for previewing and controlling component states and their transitions
 */
export const StatePreviewSystem: React.FC<StatePreviewSystemProps> = ({
  children,
  title,
  className,
  showControls = true
}) => {
  const globalVisualState = useVisualState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Initialize state transitions with values from VisualStateContext
  const {
    currentState,
    changeState,
    transitionValues,
    updateTransition,
    getTransitionStyles,
    stateHistory,
    resetStateHistory
  } = useStateTransitions({
    initialState: globalVisualState.previewState,
    duration: globalVisualState.transitionDuration,
    delay: globalVisualState.transitionDelay,
    timing: globalVisualState.transitionTimingFunction,
  });
  
  // Update global visual state when local state changes
  useEffect(() => {
    globalVisualState.setPreviewState(currentState);
    globalVisualState.setTransitionDuration(transitionValues.duration);
    globalVisualState.setTransitionDelay(transitionValues.delay);
    globalVisualState.setTransitionTimingFunction(transitionValues.timing);
  }, [currentState, transitionValues, globalVisualState]);
  
  // Handle auto play of state sequence
  useEffect(() => {
    if (!isPlaying) return;
    
    const states: ComponentState[] = ['default', 'hover', 'active', 'focus', 'disabled'];
    let currentIndex = states.indexOf(currentState);
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % states.length;
      changeState(states[currentIndex]);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isPlaying, currentState, changeState]);
  
  // Toggle play/pause for state sequence
  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);
  
  // Reset state to default
  const handleReset = useCallback(() => {
    resetStateHistory();
    setIsPlaying(false);
  }, [resetStateHistory]);
  
  // Calculate timing function preview path
  const getTimingFunctionPath = useCallback((timingFunction: string): string => {
    switch(timingFunction) {
      case 'linear': return 'M0,100 L100,0';
      case 'ease': return 'M0,100 C25,100 25,0 100,0';
      case 'ease-in': return 'M0,100 C50,100 75,0 100,0';
      case 'ease-out': return 'M0,100 C25,100 50,0 100,0';
      case 'ease-in-out': return 'M0,100 C25,100 75,0 100,0';
      default: return 'M0,100 C25,100 25,0 100,0'; // default to ease
    }
  }, []);
  
  // Render timeline of state changes
  const renderTimeline = useCallback(() => {
    const now = Date.now();
    const timespan = 10000; // 10 seconds of history
    const startTime = now - timespan;
    
    return (
      <div className="relative h-10 mt-4 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden" ref={timelineRef}>
        {stateHistory.map((item, index) => {
          // Calculate position based on timestamp
          const position = ((item.timestamp - startTime) / timespan) * 100;
          if (position < 0) return null;
          
          // Get color based on state
          const getStateColor = (state: ComponentState): string => {
            switch(state) {
              case 'default': return 'bg-gray-400';
              case 'hover': return 'bg-blue-400';
              case 'active': return 'bg-green-400';
              case 'focus': return 'bg-purple-400';
              case 'disabled': return 'bg-red-400';
              default: return 'bg-gray-400';
            }
          };
          
          return (
            <div 
              key={index}
              className={cn(
                "absolute w-1 h-full", 
                getStateColor(item.state)
              )}
              style={{ left: `${Math.min(100, position)}%` }}
              title={`${item.state} at ${new Date(item.timestamp).toLocaleTimeString()}`}
            />
          );
        })}
        
        {/* Current time indicator */}
        <div 
          className="absolute h-full border-l-2 border-primary opacity-75"
          style={{ left: '100%' }}
        />
        
        {/* Timeline labels */}
        <div className="absolute bottom-0 left-0 text-xs text-gray-500 px-1">
          -10s
        </div>
        <div className="absolute bottom-0 right-0 text-xs text-gray-500 px-1">
          now
        </div>
      </div>
    );
  }, [stateHistory]);
  
  // State indicator badges
  const renderStateIndicator = () => {
    const states: ComponentState[] = ['default', 'hover', 'active', 'focus', 'disabled'];
    
    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {states.map(state => (
          <Button
            key={state}
            size="sm"
            variant={currentState === state ? "default" : "outline"}
            onClick={() => changeState(state)}
            className={cn(
              "text-xs capitalize",
              currentState === state ? "border-2" : ""
            )}
          >
            {state}
          </Button>
        ))}
      </div>
    );
  };
  
  return (
    <Card className={cn("state-preview-system", className)}>
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-base flex items-center justify-between">
          <div>{title || 'Component State Preview'}</div>
          {showControls && (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={togglePlay}
                title={isPlaying ? 'Pause' : 'Play states'}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleReset}
                title="Reset"
              >
                <RotateCcw size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAdvanced(!showAdvanced)}
                title="Advanced settings"
              >
                <Settings size={16} />
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-3">
        {showControls && renderStateIndicator()}
        
        <div className="preview-content border p-4 rounded-md flex justify-center items-center">
          <div style={getTransitionStyles()}>
            {children}
          </div>
        </div>
        
        {showControls && showAdvanced && (
          <div className="mt-4 space-y-3">
            <Tabs defaultValue="duration">
              <TabsList>
                <TabsTrigger value="duration">Duration</TabsTrigger>
                <TabsTrigger value="timing">Easing</TabsTrigger>
                <TabsTrigger value="delay">Delay</TabsTrigger>
              </TabsList>
              
              <TabsContent value="duration" className="mt-3">
                <div className="flex items-center gap-3">
                  <Clock size={16} />
                  <div className="flex-1">
                    <Slider
                      value={[transitionValues.duration]}
                      min={0}
                      max={2000}
                      step={10}
                      onValueChange={(values) => updateTransition({ duration: values[0] })}
                    />
                  </div>
                  <div className="w-16 text-right text-sm">
                    {transitionValues.duration}ms
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="timing" className="mt-3">
                <div className="space-y-3">
                  <Select
                    value={transitionValues.timing}
                    onValueChange={(value) => updateTransition({ timing: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timing function" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">Linear</SelectItem>
                      <SelectItem value="ease">Ease</SelectItem>
                      <SelectItem value="ease-in">Ease In</SelectItem>
                      <SelectItem value="ease-out">Ease Out</SelectItem>
                      <SelectItem value="ease-in-out">Ease In Out</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="h-16 w-full border rounded-md p-2">
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path
                        d={getTimingFunctionPath(transitionValues.timing)}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="delay" className="mt-3">
                <div className="flex items-center gap-3">
                  <Clock size={16} />
                  <div className="flex-1">
                    <Slider
                      value={[transitionValues.delay]}
                      min={0}
                      max={1000}
                      step={10}
                      onValueChange={(values) => updateTransition({ delay: values[0] })}
                    />
                  </div>
                  <div className="w-16 text-right text-sm">
                    {transitionValues.delay}ms
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-play"
                checked={isPlaying}
                onCheckedChange={togglePlay}
              />
              <Label htmlFor="auto-play">Auto-play states</Label>
            </div>
          </div>
        )}
        
        {showControls && renderTimeline()}
      </CardContent>
      
      <CardFooter className="p-3 pt-0 text-xs text-gray-500 flex items-center justify-between">
        <div>
          Current: <span className="font-medium capitalize">{currentState}</span>
        </div>
        <div>
          {transitionValues.duration}ms {transitionValues.timing} {transitionValues.delay > 0 ? `(${transitionValues.delay}ms delay)` : ''}
        </div>
      </CardFooter>
    </Card>
  );
};

export default StatePreviewSystem;
