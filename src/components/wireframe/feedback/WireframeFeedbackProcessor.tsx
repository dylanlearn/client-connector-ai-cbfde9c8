
import React, { useState } from 'react';
import { useWireframeFeedbackProcessor } from '@/hooks/wireframe/use-wireframe-feedback-processor';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { cn } from '@/lib/utils';

interface WireframeFeedbackProcessorProps {
  wireframeId: string;
  onWireframeUpdate?: (wireframe: WireframeData) => void;
  className?: string;
  createNewVersion?: boolean;
}

const WireframeFeedbackProcessor: React.FC<WireframeFeedbackProcessorProps> = ({
  wireframeId,
  onWireframeUpdate,
  className,
  createNewVersion = false,
}) => {
  const [feedbackText, setFeedbackText] = useState('');
  const { 
    processFeedback, 
    isProcessing, 
    lastResult, 
    error, 
    resetResult 
  } = useWireframeFeedbackProcessor({
    onWireframeUpdate,
    showToasts: true,
    createNewVersion
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedbackText.trim()) return;
    
    await processFeedback(wireframeId, feedbackText);
  };
  
  const handleReset = () => {
    setFeedbackText('');
    resetResult();
  };
  
  return (
    <div className={cn('wireframe-feedback-processor', className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Feedback-Driven Updates
          </CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Enter your feedback about the wireframe (e.g., 'Make the hero section more prominent', 'Add a navigation bar at the top', etc.)"
                  className="min-h-[120px] resize-y"
                  disabled={isProcessing}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Be specific about what you want to change, which sections you're referring to, and what elements need modification.
                </p>
              </div>
              
              {lastResult && (
                <div className={cn(
                  "p-3 rounded-md text-sm",
                  lastResult.success ? "bg-green-50 text-green-700 border border-green-200" : 
                                       "bg-amber-50 text-amber-700 border border-amber-200"
                )}>
                  <div className="flex items-start gap-2">
                    {lastResult.success ? 
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" /> : 
                      <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    }
                    <div>
                      <p className="font-medium">{lastResult.success ? 'Changes Applied' : 'No Changes Applied'}</p>
                      <p>{lastResult.message || lastResult.changes?.description || 'Feedback processed'}</p>
                      
                      {lastResult.success && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {lastResult.changes.addedSections.length > 0 && (
                            <Badge variant="outline" className="bg-green-100">
                              {lastResult.changes.addedSections.length} section(s) added
                            </Badge>
                          )}
                          {lastResult.changes.modifiedSections.length > 0 && (
                            <Badge variant="outline" className="bg-blue-100">
                              {lastResult.changes.modifiedSections.length} section(s) modified
                            </Badge>
                          )}
                          {lastResult.changes.removedSections.length > 0 && (
                            <Badge variant="outline" className="bg-red-100">
                              {lastResult.changes.removedSections.length} section(s) removed
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Error Processing Feedback</p>
                    <p>{error}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={handleReset}
              disabled={isProcessing || (!lastResult && !feedbackText)}
            >
              Reset
            </Button>
            
            <Button 
              type="submit" 
              disabled={isProcessing || !feedbackText.trim()}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Apply Feedback
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default WireframeFeedbackProcessor;
