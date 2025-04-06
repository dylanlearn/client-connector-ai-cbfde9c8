
import { useState } from 'react';
import { useToast } from './use-toast';
import { CreativeEnhancementService, CreativeStyleProfile } from '@/services/ai/creative-enhancement-service';

export interface UseEnhancedAIOptions {
  showToasts?: boolean;
  autoRetry?: boolean;
  styleProfile?: string;
  creativityLevel?: number;
}

export interface EnhancedContentRequest {
  prompt: string;
  systemPrompt?: string;
  styleProfile?: string;
  context?: Record<string, any>;
}

export interface UseEnhancedAIReturn {
  generate: (promptRequest: string | EnhancedContentRequest) => Promise<string>;
  isGenerating: boolean;
  content: string | null;
  error: Error | null;
  currentProfile: CreativeStyleProfile;
  setStyleProfile: (profileName: string) => void;
  clearContent: () => void;
  clearError: () => void;
}

/**
 * Hook for generating AI content with enhanced creativity, articulation and decisiveness
 */
export const useEnhancedAI = (options: UseEnhancedAIOptions = {}): UseEnhancedAIReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [styleProfile, setStyleProfile] = useState<string>(options.styleProfile || 'default');
  const { toast } = useToast();
  const { showToasts = false } = options;

  // Get the current creative profile
  const currentProfile = CreativeEnhancementService.getStyleProfile(styleProfile);

  const generate = async (promptRequest: string | EnhancedContentRequest): Promise<string> => {
    setIsGenerating(true);
    try {
      let prompt: string;
      let systemPrompt: string | undefined;
      let context: Record<string, any> | undefined;
      let profileName = styleProfile;
      
      // Parse the request
      if (typeof promptRequest === 'string') {
        prompt = promptRequest;
      } else {
        prompt = promptRequest.prompt;
        systemPrompt = promptRequest.systemPrompt;
        profileName = promptRequest.styleProfile || profileName;
        context = promptRequest.context;
      }

      // Apply creative enhancements
      const enhancedPrompt = CreativeEnhancementService.enhancePrompt(
        prompt,
        profileName,
        context
      );
      
      // Apply system prompt enhancement if provided
      const enhancedSystemPrompt = systemPrompt 
        ? CreativeEnhancementService.enhanceSystemPrompt(systemPrompt, profileName)
        : undefined;
      
      // This would normally call an AI API - in a real implementation,
      // we'd call supabase edge functions or OpenAI directly
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate generated content for demonstration
      const generatedContent = `Enhanced AI content for: ${enhancedPrompt}`;
      
      setContent(generatedContent);
      
      if (showToasts) {
        toast({
          title: `${currentProfile.name} Content Generated`,
          description: "Enhanced AI content was successfully generated",
          variant: "default"
        });
      }
      
      return generatedContent;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(errorObj);
      
      if (showToasts) {
        toast({
          title: "Enhanced Generation Failed",
          description: errorObj.message,
          variant: "destructive"
        });
      }
      
      throw errorObj;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generate,
    isGenerating,
    content,
    error,
    currentProfile,
    setStyleProfile,
    clearContent: () => setContent(null),
    clearError: () => setError(null),
  };
};
