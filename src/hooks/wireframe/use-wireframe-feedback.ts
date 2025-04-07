
import { useState, useCallback } from 'react';
import { WireframeService } from '@/services/ai/wireframe/wireframe-service';
import { AIWireframe } from '@/services/ai/wireframe/wireframe-types';

export function useWireframeFeedback(
  wireframes: AIWireframe[],
  setWireframes: (wireframes: AIWireframe[]) => void,
  toast: any
) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const provideFeedback = useCallback(async (
    wireframeId: string,
    feedback: string,
    rating?: number
  ) => {
    setIsSubmitting(true);
    
    try {
      await WireframeService.updateWireframeFeedback(wireframeId, feedback, rating);
      
      // Update the wireframe in the list with new feedback
      setWireframes(wireframes.map(wireframe => {
        if (wireframe.id === wireframeId) {
          return {
            ...wireframe,
            feedback,
            rating: rating !== undefined ? rating : wireframe.rating
          };
        }
        return wireframe;
      }));
      
      toast({
        title: "Feedback submitted",
        description: "Thanks for your feedback!"
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit feedback";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [wireframes, setWireframes, toast]);

  const deleteWireframe = useCallback(async (wireframeId: string) => {
    try {
      await WireframeService.deleteWireframe(wireframeId);
      
      // Remove the wireframe from the list
      setWireframes(wireframes.filter(wireframe => wireframe.id !== wireframeId));
      
      toast({
        title: "Wireframe deleted",
        description: "The wireframe has been removed"
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete wireframe";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      return false;
    }
  }, [wireframes, setWireframes, toast]);

  return {
    isSubmitting,
    provideFeedback,
    deleteWireframe
  };
}
