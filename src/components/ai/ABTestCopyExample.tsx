
import React, { useState, useEffect } from 'react';
import { useTestingAnalytics } from '@/hooks/analytics/useTestingAnalytics';
import { Skeleton } from '@/components/ui/skeleton';

interface ABTestCopyExampleProps {
  contentType: string;
  defaultText: string;
}

/**
 * A component that demonstrates how to implement different copy variants using A/B testing
 */
export const ABTestCopyExample: React.FC<ABTestCopyExampleProps> = ({ 
  contentType, 
  defaultText 
}) => {
  const [displayText, setDisplayText] = useState<string>(defaultText);
  const [renderTime, setRenderTime] = useState<number>(0);
  
  // Use the testing analytics hook to get the appropriate prompt variant for this user
  const { 
    promptVariant, 
    isLoading, 
    recordSuccess, 
    recordFailure, 
    recordMetric 
  } = useTestingAnalytics({
    contentType,
    defaultPrompt: defaultText,
    trackingEnabled: true
  });

  // When the variant loads, update the display text and record metrics
  useEffect(() => {
    if (promptVariant && !isLoading) {
      const startTime = performance.now();
      
      try {
        // Use the variant's prompt text as our display text
        setDisplayText(promptVariant.promptText);
        
        // Calculate render time
        const endTime = performance.now();
        const latency = endTime - startTime;
        setRenderTime(latency);
        
        // Record success with the render time as latency
        recordSuccess(latency);
        
        // Optionally record a custom metric (like character count)
        recordMetric('characterCount', promptVariant.promptText.length);
      } catch (error) {
        // Record failure if something went wrong
        recordFailure(error instanceof Error ? error.message : 'Unknown error');
      }
    }
  }, [promptVariant, isLoading, recordSuccess, recordFailure, recordMetric]);

  if (isLoading) {
    return <Skeleton className="h-6 w-full" />;
  }

  return (
    <div className="space-y-2">
      <p>{displayText}</p>
      <p className="text-xs text-muted-foreground">
        {promptVariant?.id !== 'default' && (
          <>Variant: {promptVariant?.name} | Render time: {renderTime.toFixed(2)}ms</>
        )}
      </p>
    </div>
  );
};
