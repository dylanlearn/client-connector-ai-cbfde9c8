
import React, { useState, useEffect, useCallback } from 'react';
import { useVisualState, ComponentState } from '@/contexts/VisualStateContext';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Pause, Play, RotateCcw } from 'lucide-react';

export interface StateTransitionPreviewProps {
  children: React.ReactNode;
  className?: string;
  transitionSequence?: ComponentState[];
  autoPlay?: boolean;
  intervalDuration?: number;
}

/**
 * Component for previewing state transitions for a component or set of components.
 * Supports automatic playback of transition sequences or manual stepping.
 */
export function StateTransitionPreview({
  children,
  className,
  transitionSequence = ['default', 'hover', 'active', 'focus', 'disabled', 'default'],
  autoPlay = false,
  intervalDuration = 2000,
}: StateTransitionPreviewProps) {
  const { 
    setPreviewState, 
    transitionDuration, 
    transitionDelay,
    setIsAnimating 
  } = useVisualState();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const totalDuration = transitionDuration + transitionDelay;

  // When the current index changes, update the preview state
  useEffect(() => {
    setPreviewState(transitionSequence[currentIndex]);
    
    // Indicate animation is happening during transition
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, totalDuration);
    
    return () => clearTimeout(timer);
  }, [currentIndex, setPreviewState, transitionSequence, setIsAnimating, totalDuration]);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % transitionSequence.length);
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [isPlaying, intervalDuration, transitionSequence.length]);

  // Navigate to the next state in the sequence
  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % transitionSequence.length);
  }, [transitionSequence.length]);

  // Reset to the initial state
  const handleReset = useCallback(() => {
    setCurrentIndex(0);
  }, []);

  // Toggle play/pause
  const togglePlayback = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={togglePlayback}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleReset}
              aria-label="Reset"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-1">
            {transitionSequence.map((state, index) => (
              <React.Fragment key={`${state}-${index}`}>
                <div 
                  className={cn(
                    "px-3 py-1 text-xs rounded-md capitalize", 
                    currentIndex === index 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {state}
                </div>
                {index < transitionSequence.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                )}
              </React.Fragment>
            ))}
          </div>

          <Button 
            variant="outline" 
            size="sm"
            onClick={handleNext}
            aria-label="Next state"
          >
            Next
          </Button>
        </div>

        <div className="p-4 border rounded-lg flex items-center justify-center min-h-[200px]">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

export default StateTransitionPreview;
