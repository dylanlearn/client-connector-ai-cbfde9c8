
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WireframeFeedbackController, FeedbackUpdateOptions } from '@/services/ai/wireframe/feedback/wireframe-feedback-controller';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

interface UseWireframeFeedbackProcessorOptions {
  onWireframeUpdate?: (wireframe: WireframeData) => void;
  showToasts?: boolean;
  createNewVersion?: boolean;
}

export function useWireframeFeedbackProcessor(options: UseWireframeFeedbackProcessorOptions = {}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const processFeedback = useCallback(async (
    wireframeId: string,
    feedbackText: string,
    processingOptions: Partial<FeedbackUpdateOptions> = {}
  ) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Configure update options
      const updateOptions: FeedbackUpdateOptions = {
        createNewVersion: options.createNewVersion,
        applyChanges: true,
        saveChanges: true,
        ...processingOptions
      };
      
      // Process the feedback and get the result
      const result = await WireframeFeedbackController.processWireframeFeedback(
        wireframeId,
        feedbackText,
        updateOptions
      );
      
      setLastResult(result);
      
      // Show success or error toast if enabled
      if (options.showToasts) {
        if (result.success) {
          toast({
            title: "Feedback Applied",
            description: result.message || "Changes applied successfully",
            variant: "default",
          });
        } else {
          toast({
            title: "Couldn't Apply Feedback",
            description: result.message || "No changes could be applied based on the feedback",
            variant: "destructive",
          });
        }
      }
      
      // Call the update callback if provided, successful and has wireframe
      if (result.success && options.onWireframeUpdate && result.wireframe) {
        options.onWireframeUpdate(result.wireframe);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Error in processFeedback:', err);
      setError(errorMessage);
      
      if (options.showToasts) {
        toast({
          title: "Feedback Processing Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsProcessing(false);
    }
  }, [options, toast]);
  
  return {
    processFeedback,
    isProcessing,
    lastResult,
    error,
    resetResult: () => setLastResult(null),
    resetError: () => setError(null)
  };
}
