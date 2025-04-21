
import React, { useRef, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ScrollTrigger {
  position: number; // Percentage position (0-100)
  label: string;
}

interface ScrollTriggerEffectProps {
  height?: number;
  triggers: ScrollTrigger[];
}

const ScrollTriggerEffect: React.FC<ScrollTriggerEffectProps> = ({ 
  height = 400, 
  triggers = [] 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [triggeredItems, setTriggeredItems] = useState<string[]>([]);
  
  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const element = containerRef.current;
    const maxScroll = element.scrollHeight - element.clientHeight;
    const currentPercent = (element.scrollTop / maxScroll) * 100;
    
    setScrollPercent(currentPercent);
    
    // Check which triggers have been activated
    const activatedTriggers = triggers
      .filter(trigger => currentPercent >= trigger.position)
      .map(trigger => trigger.label);
      
    setTriggeredItems(activatedTriggers);
  };
  
  // Sort triggers by position
  const sortedTriggers = [...triggers].sort((a, b) => a.position - b.position);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm">
          Scroll Position: {Math.round(scrollPercent)}%
        </div>
        <div className="flex gap-2">
          {triggeredItems.length > 0 ? (
            triggeredItems.map(trigger => (
              <Badge key={trigger} variant="default">
                {trigger} Triggered
              </Badge>
            ))
          ) : (
            <Badge variant="outline">No Triggers Active</Badge>
          )}
        </div>
      </div>
      
      <Progress value={scrollPercent} className="h-2" />
      
      <Card className="overflow-hidden border border-border">
        <div
          ref={containerRef}
          className="overflow-auto scrollbar-thin"
          style={{ height }}
          onScroll={handleScroll}
        >
          <div className="relative p-4" style={{ height: height * 2 }}>
            <div className="absolute inset-x-0 h-full">
              {/* Trigger markers */}
              {sortedTriggers.map((trigger, index) => (
                <div
                  key={index}
                  className="absolute left-0 right-0 p-4 transition-all duration-500"
                  style={{ 
                    top: `${trigger.position}%`, 
                    transform: triggeredItems.includes(trigger.label) 
                      ? 'translateX(0)' 
                      : 'translateX(-10px)',
                    opacity: triggeredItems.includes(trigger.label) ? 1 : 0.5
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full ${
                      triggeredItems.includes(trigger.label) 
                        ? 'bg-primary' 
                        : 'bg-muted'
                    }`} />
                    <div className="text-sm font-medium">
                      {trigger.label} ({trigger.position}%)
                    </div>
                  </div>
                  
                  {triggeredItems.includes(trigger.label) && (
                    <div className="mt-2 p-3 bg-primary/5 rounded-md border border-primary/10 animate-fadeIn">
                      <p className="text-sm">
                        This content appears when you scroll to the {trigger.position}% mark.
                        Different sections can reveal as the user scrolls through the page.
                      </p>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Bottom reached indicator */}
              <div
                className="absolute left-0 right-0 bottom-0 p-4 transition-all duration-1000"
                style={{
                  opacity: scrollPercent > 95 ? 1 : 0,
                  transform: scrollPercent > 95 ? 'translateY(0)' : 'translateY(20px)',
                }}
              >
                <div className="p-3 bg-green-100 rounded-md border border-green-200">
                  <p className="text-sm font-medium text-green-800">
                    You've reached the bottom of the content!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="text-sm text-muted-foreground">
        <p>
          Scroll down in the box above to trigger different events at {sortedTriggers.map(t => `${t.position}%`).join(', ')} 
          scroll positions.
        </p>
      </div>
    </div>
  );
};

export default ScrollTriggerEffect;
