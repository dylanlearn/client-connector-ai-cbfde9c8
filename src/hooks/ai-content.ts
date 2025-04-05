
import { useState } from 'react';
import { useToast } from './use-toast';

export interface UseAIContentOptions {
  showToasts?: boolean;
  autoRetry?: boolean;
}

export interface ContentRequest {
  prompt: string;
  systemPrompt?: string;
  options?: Record<string, any>;
}

export interface UseAIContentReturn {
  generate: (prompt: string | ContentRequest) => Promise<string>;
  isGenerating: boolean;
  content: string | null;
  error: Error | null;
  clearContent: () => void;
  clearError: () => void;
}

export const useAIContent = (options: UseAIContentOptions = {}): UseAIContentReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { showToasts = false } = options;

  const generate = async (promptOrRequest: string | ContentRequest): Promise<string> => {
    setIsGenerating(true);
    try {
      // This would normally call an AI API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const prompt = typeof promptOrRequest === 'string' 
        ? promptOrRequest 
        : promptOrRequest.prompt;
        
      const generatedContent = `AI generated content for: ${prompt}`;
      
      setContent(generatedContent);
      
      if (showToasts) {
        toast({
          title: "Content Generated",
          description: "AI content was successfully generated",
          variant: "default"
        });
      }
      
      return generatedContent;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(errorObj);
      
      if (showToasts) {
        toast({
          title: "Generation Failed",
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
    clearContent: () => setContent(null),
    clearError: () => setError(null),
  };
};
