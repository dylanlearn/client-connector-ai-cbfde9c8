import { useState, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { AIDesignService } from '@/services/ai';
import { useDesignMemory } from './useDesignMemory';
import { useToneAdaptation } from './useToneAdaptation';

export type SuggestionType = 'color' | 'layout' | 'component' | 'typography' | 'interaction';

export interface DesignSuggestion {
  id: string;
  type: SuggestionType;
  title: string;
  description: string;
  options: DesignSuggestionOption[];
  followUpQuestions?: string[];
  imageUrl?: string;
}

export interface DesignSuggestionOption {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  value: any;
}

export interface FeedbackRequest {
  suggestionId: string;
  message: string;
  options?: {
    refine: boolean;
    moreOptions: boolean;
    differentDirection: boolean;
  };
}

/**
 * Hook for generating and managing interactive design suggestions
 */
export function useInteractiveDesignSuggestions() {
  const [suggestions, setSuggestions] = useState<DesignSuggestion[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState<DesignSuggestion | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const feedbackHistoryRef = useRef<Record<string, string[]>>({});
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { storeSuggestion, submitFeedback } = useDesignMemory();
  const { adaptMessageTone } = useToneAdaptation();

  /**
   * Generate a new interactive design suggestion
   */
  const generateSuggestion = useCallback(async (
    type: SuggestionType,
    prompt: string,
    context: Record<string, any> = {}
  ): Promise<DesignSuggestion | null> => {
    if (!user) {
      toast({
        title: adaptMessageTone("Authentication required"),
        description: adaptMessageTone("Please log in to use the design suggestions feature."),
        variant: "destructive"
      });
      return null;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      // Generate the suggestion based on type
      let result;
      
      switch(type) {
        case 'color':
          result = await AIDesignService.suggestColorPalette({
            industry: context.industry || '',
            mood: context.mood || '',
            preferences: context.preferences || [],
            existingColors: context.existingColors || []
          });
          break;
        case 'layout':
          result = await AIDesignService.recommendLayouts({
            industry: context.industry || '',
            contentType: context.contentType || '',
            preferences: context.preferences || []
          });
          break;
        case 'component':
          result = await AIDesignService.suggestComponents(
            prompt,
            context.features || []
          );
          break;
        case 'typography':
          result = await AIDesignService.suggestTypography({
            formal: context.formal || 0,
            technical: context.technical || 0, 
            friendly: context.friendly || 0,
            creative: context.creative || 0
          });
          break;
        case 'interaction':
          // For now, since suggestInteractions doesn't exist, create a fallback
          // This would need to be implemented in AIDesignService eventually
          result = {
            title: `Interaction Suggestion`,
            description: `Here are some interaction suggestions based on your requirements`,
            options: [
              {
                title: "Basic Hover Effect",
                description: "Simple color change on hover",
                value: { type: "hover", style: "basic" }
              },
              {
                title: "Scale Animation",
                description: "Element grows slightly on hover",
                value: { type: "hover", style: "scale" }
              }
            ]
          };
          break;
        default:
          throw new Error(`Unsupported suggestion type: ${type}`);
      }
      
      // Create a new suggestion object
      const newSuggestion: DesignSuggestion = {
        id: `suggestion-${Date.now()}`,
        type,
        title: result.title || `${type.charAt(0).toUpperCase() + type.slice(1)} Suggestion`,
        description: result.description || adaptMessageTone(`Here are some ${type} suggestions based on your requirements`),
        options: result.options.map((opt: any, index: number) => ({
          id: `option-${Date.now()}-${index}`,
          title: opt.title || `Option ${index + 1}`,
          description: opt.description,
          imageUrl: opt.imageUrl,
          value: opt.value
        })),
        followUpQuestions: result.followUpQuestions || [
          adaptMessageTone(`Would you like to see more ${type} options?`),
          adaptMessageTone(`Do you want to refine these ${type} suggestions?`),
          adaptMessageTone(`Is there a specific aspect of ${type} you want to focus on?`)
        ]
      };
      
      // Store the suggestion for future reference
      await storeSuggestion(
        prompt,
        result,
        [],
        { type, context }
      );
      
      // Update state
      setSuggestions(prev => [...prev, newSuggestion]);
      setActiveSuggestion(newSuggestion);
      
      toast({
        title: adaptMessageTone("Suggestions ready"),
        description: adaptMessageTone(`Your ${type} suggestions have been created.`)
      });
      
      return newSuggestion;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to generate suggestion');
      setError(error);
      
      toast({
        title: adaptMessageTone("Suggestion generation failed"),
        description: error.message,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [user, toast, storeSuggestion, adaptMessageTone]);

  /**
   * Process feedback on a suggestion and potentially generate a refined suggestion
   */
  const processFeedback = useCallback(async (
    feedback: FeedbackRequest
  ): Promise<DesignSuggestion | null> => {
    if (!user) {
      toast({
        title: adaptMessageTone("Authentication required"),
        description: adaptMessageTone("Please log in to provide feedback on suggestions."),
        variant: "destructive"
      });
      return null;
    }
    
    // Find the suggestion
    const suggestion = suggestions.find(s => s.id === feedback.suggestionId);
    if (!suggestion) {
      toast({
        title: adaptMessageTone("Suggestion not found"),
        description: adaptMessageTone("The suggestion you're providing feedback for couldn't be found."),
        variant: "destructive"
      });
      return null;
    }
    
    // Record feedback history
    if (!feedbackHistoryRef.current[suggestion.id]) {
      feedbackHistoryRef.current[suggestion.id] = [];
    }
    feedbackHistoryRef.current[suggestion.id].push(feedback.message);
    
    // Store feedback
    await submitFeedback(
      suggestion.id,
      'comment',
      undefined,
      feedback.message,
      { options: feedback.options }
    );
    
    // Generate a refined suggestion if requested
    if (feedback.options?.refine) {
      return generateSuggestion(
        suggestion.type,
        `Refined ${suggestion.type} based on feedback: ${feedback.message}`,
        { previousSuggestion: suggestion, feedback: feedback.message }
      );
    }
    
    // Generate more options if requested
    if (feedback.options?.moreOptions) {
      return generateSuggestion(
        suggestion.type,
        `More ${suggestion.type} options similar to previous suggestions`,
        { previousSuggestion: suggestion, feedback: feedback.message }
      );
    }
    
    // Generate completely different suggestions if requested
    if (feedback.options?.differentDirection) {
      return generateSuggestion(
        suggestion.type,
        `Different direction for ${suggestion.type} based on feedback: ${feedback.message}`,
        { avoidPrevious: suggestion, feedback: feedback.message }
      );
    }
    
    return null;
  }, [user, toast, suggestions, generateSuggestion, submitFeedback, adaptMessageTone]);
  
  /**
   * Set a suggestion as active to focus on it
   */
  const setFocusedSuggestion = useCallback((suggestionId: string) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (suggestion) {
      setActiveSuggestion(suggestion);
    }
  }, [suggestions]);
  
  /**
   * Reset all suggestions
   */
  const resetSuggestions = useCallback(() => {
    setSuggestions([]);
    setActiveSuggestion(null);
    feedbackHistoryRef.current = {};
  }, []);

  return {
    suggestions,
    activeSuggestion,
    isGenerating,
    error,
    generateSuggestion,
    processFeedback,
    setFocusedSuggestion,
    resetSuggestions
  };
}
