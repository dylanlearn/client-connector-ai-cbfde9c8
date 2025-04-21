
import React from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface WireframeLoadingStateProps {
  message?: string;
  progress?: number;
  steps?: {
    label: string;
    status: 'pending' | 'loading' | 'complete' | 'error';
  }[];
}

const WireframeLoadingState: React.FC<WireframeLoadingStateProps> = ({
  message = "Generating wireframe...",
  progress,
  steps
}) => {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
          {/* Changed size="xl" to size="lg" */}
          <LoadingSpinner size="lg" />
          <h3 className="text-lg font-medium">{message}</h3>
          
          {progress !== undefined && (
            <div className="w-full max-w-md">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                {Math.round(progress)}% complete
              </p>
            </div>
          )}
          
          {steps && steps.length > 0 && (
            <div className="w-full max-w-md mt-4 text-left space-y-2">
              {steps.map((step, index) => (
                <div 
                  key={`step-${index}`} 
                  className="flex items-center gap-2 text-sm"
                >
                  {step.status === 'pending' && (
                    <div className="h-4 w-4 rounded-full border-2 border-muted"></div>
                  )}
                  {step.status === 'loading' && (
                    <LoadingSpinner size="sm" />
                  )}
                  {step.status === 'complete' && (
                    <div className="h-4 w-4 rounded-full bg-primary"></div>
                  )}
                  {step.status === 'error' && (
                    <div className="h-4 w-4 rounded-full bg-destructive"></div>
                  )}
                  <span className={
                    step.status === 'complete' ? 'text-primary' :
                    step.status === 'error' ? 'text-destructive' :
                    step.status === 'loading' ? 'font-medium' : 'text-muted-foreground'
                  }>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WireframeLoadingState;
