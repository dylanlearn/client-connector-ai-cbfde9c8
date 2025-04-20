
import React, { useState, useEffect } from 'react';
import StatefulComponent from './StatefulComponent';
import { ComponentState, useVisualState } from '@/contexts/VisualStateContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const StateTransitionPreview: React.FC = () => {
  const { transitionDuration, transitionTimingFunction } = useVisualState();
  const [currentState, setCurrentState] = useState<ComponentState>('default');
  const [isPlaying, setIsPlaying] = useState(false);
  const states: ComponentState[] = ['default', 'hover', 'active', 'focus', 'disabled'];

  // Auto-play transition sequence
  useEffect(() => {
    if (!isPlaying) return;
    
    let currentIndex = states.indexOf(currentState);
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % states.length;
      setCurrentState(states[currentIndex]);
    }, transitionDuration + 500); // Add buffer time so the transition completes
    
    return () => clearInterval(interval);
  }, [isPlaying, currentState, transitionDuration]);

  const togglePlay = () => {
    if (!isPlaying) {
      setCurrentState('default');
      setTimeout(() => setIsPlaying(true), 100);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium">
              Current State: <span className="capitalize">{currentState}</span>
            </h3>
            <Button 
              onClick={togglePlay} 
              variant="outline" 
              size="sm"
            >
              {isPlaying ? 'Stop' : 'Play Sequence'}
            </Button>
          </div>
          
          <div className="flex flex-col gap-4 p-4 border border-gray-200 rounded-md">
            {/* Button Example */}
            <StatefulComponent
              forceState={currentState}
              defaultStyles="px-4 py-2 bg-blue-500 text-white rounded"
              hoverStyles="bg-blue-600"
              activeStyles="bg-blue-700"
              focusStyles="ring-2 ring-blue-300 outline-none"
              disabledStyles="bg-blue-300 cursor-not-allowed"
            >
              <button className="w-full">Button Example</button>
            </StatefulComponent>
            
            {/* Card Example */}
            <StatefulComponent
              forceState={currentState}
              defaultStyles="border border-gray-200 rounded-md p-4 bg-white shadow-sm"
              hoverStyles="shadow-md border-gray-300"
              activeStyles="bg-gray-50"
              focusStyles="ring-2 ring-blue-200 outline-none"
              disabledStyles="opacity-60 bg-gray-50"
            >
              <div className="text-center">
                <p className="font-medium">Card Example</p>
              </div>
            </StatefulComponent>
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-base font-medium mb-4">
            Manual State Control
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {states.map(state => (
              <Button 
                key={state}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentState(state);
                }}
                variant={state === currentState ? "default" : "outline"}
                className="capitalize"
              >
                {state}
              </Button>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>Transition: {transitionDuration}ms {transitionTimingFunction}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
