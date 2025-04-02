
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { PromptABTestingService, PromptVariant } from '@/services/ai/content/prompt-testing/ab-testing-service';

interface UsePromptTestingOptions {
  contentType: string;
  defaultPrompt: string;
  defaultSystemPrompt?: string;
}

interface UsePromptTestingReturn {
  promptVariant: PromptVariant | null;
  isLoading: boolean;
  recordSuccess: (latencyMs: number, tokenUsage?: number) => Promise<void>;
  recordFailure: (errorType?: string) => Promise<void>;
}

/**
 * Hook for using A/B tested prompts in components
 */
export function usePromptTesting({
  contentType,
  defaultPrompt,
  defaultSystemPrompt
}: UsePromptTestingOptions): UsePromptTestingReturn {
  const [promptVariant, setPromptVariant] = useState<PromptVariant | null>(null);
  const [testId, setTestId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Fetch the appropriate prompt variant on mount
  useEffect(() => {
    const fetchPromptVariant = async () => {
      setIsLoading(true);
      try {
        // Get the active test for this content type
        const test = await PromptABTestingService.getActiveTest(contentType);
        
        if (test) {
          setTestId(test.id);
          // Select a variant for this user
          const variant = await PromptABTestingService.selectVariant(contentType, user?.id);
          
          if (variant) {
            setPromptVariant(variant);
          } else {
            // Use default if no variant is available
            setPromptVariant({
              id: 'default',
              name: 'Default',
              promptText: defaultPrompt,
              systemPrompt: defaultSystemPrompt,
              isControl: true,
              weight: 1
            });
          }
        } else {
          // Use default if no test is available
          setPromptVariant({
            id: 'default',
            name: 'Default',
            promptText: defaultPrompt,
            systemPrompt: defaultSystemPrompt,
            isControl: true,
            weight: 1
          });
        }
      } catch (error) {
        console.error('Error fetching prompt variant:', error);
        // Fallback to default
        setPromptVariant({
          id: 'default',
          name: 'Default',
          promptText: defaultPrompt,
          systemPrompt: defaultSystemPrompt,
          isControl: true,
          weight: 1
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromptVariant();
  }, [contentType, defaultPrompt, defaultSystemPrompt, user?.id]);

  // Record a successful generation
  const recordSuccess = useCallback(async (latencyMs: number, tokenUsage?: number) => {
    if (!testId || !promptVariant || promptVariant.id === 'default' || !user?.id) return;
    
    await PromptABTestingService.recordSuccess(
      testId,
      promptVariant.id,
      user.id,
      latencyMs,
      tokenUsage
    );
  }, [testId, promptVariant, user?.id]);

  // Record a failed generation
  const recordFailure = useCallback(async (errorType?: string) => {
    if (!testId || !promptVariant || promptVariant.id === 'default' || !user?.id) return;
    
    await PromptABTestingService.recordFailure(
      testId,
      promptVariant.id,
      user.id,
      errorType
    );
  }, [testId, promptVariant, user?.id]);

  return {
    promptVariant,
    isLoading,
    recordSuccess,
    recordFailure
  };
}
