
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export interface TriggerPoint {
  position: number;  // percentage of scroll (0-100)
  label: string;
}

export interface ScrollTriggerEffectProps {
  triggers: TriggerPoint[];
  height?: number;
}

const ScrollTriggerEffect: React.FC<ScrollTriggerEffectProps> = ({
  triggers,
  height = 400
}) => {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [activeLabel, setActiveLabel] = useState<string>("");
  
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight - container.clientHeight;
    const percentage = Math.round((scrollTop / scrollHeight) * 100);
    
    setScrollPercentage(percentage);
    
    // Find active trigger
    const activeTrigger = [...triggers]
      .sort((a, b) => b.position - a.position)
      .find(trigger => percentage >= trigger.position);
    
    if (activeTrigger) {
      setActiveLabel(activeTrigger.label);
    } else {
      setActiveLabel("");
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="font-medium">Scroll Progress: {scrollPercentage}%</div>
        <div className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full">
          {activeLabel || "Not triggered"}
        </div>
      </div>
      
      <Progress value={scrollPercentage} />
      
      <div 
        className="overflow-auto border rounded-md p-4"
        style={{ height }}
        onScroll={handleScroll}
      >
        <div className="space-y-96">
          <div className="text-center p-4">Scroll down to trigger effects</div>
          {triggers.map((trigger, index) => (
            <Card 
              key={index} 
              className={`transition-all ${scrollPercentage >= trigger.position ? 'bg-primary/10 shadow-lg' : ''}`}
            >
              <CardContent className="p-6">
                <h3 className="text-xl font-bold">
                  {trigger.label} ({trigger.position}%)
                </h3>
                <p>This section activates at {trigger.position}% scroll</p>
              </CardContent>
            </Card>
          ))}
          <div className="text-center p-4 text-muted-foreground">End of content</div>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        <p>Demonstration of scroll-based triggers. As you scroll down, elements will activate when you reach their defined threshold.</p>
      </div>
    </div>
  );
};

export default ScrollTriggerEffect;
