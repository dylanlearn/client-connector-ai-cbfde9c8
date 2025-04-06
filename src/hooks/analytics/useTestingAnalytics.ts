import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { PromptABTestingService, PromptVariant, PromptTest } from '@/services/ai/content/prompt-testing/ab-testing-service';
import { Severity, ServiceName, UnifiedObservability } from '@/utils/monitoring/unified-observability';

interface UseTestingAnalyticsOptions {
  contentType: string;
  defaultPrompt: string;
  defaultSystemPrompt?: string;
  trackingEnabled?: boolean;
}

interface UseTestingAnalyticsReturn {
  promptVariant: PromptVariant | null;
  activeTest: PromptTest | null;
  isLoading: boolean;
  recordSuccess: (latencyMs: number, tokenUsage?: number) => Promise<void>;
  recordFailure: (errorType?: string) => Promise<void>;
  recordMetric: (metricName: string, value: number) => Promise<void>;
}

/**
 * Enhanced hook for using A/B tested prompts with advanced analytics
 */
export function useTestingAnalytics({
  contentType,
  defaultPrompt,
  defaultSystemPrompt,
  trackingEnabled = true
}: UseTestingAnalyticsOptions): UseTestingAnalyticsReturn {
  const [promptVariant, setPromptVariant] = useState<PromptVariant | null>(null);
  const [activeTest, setActiveTest] = useState<PromptTest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [correlationId, setCorrelationId] = useState<string>('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchPromptVariant = async () => {
      setIsLoading(true);
      
      const newCorrelationId = UnifiedObservability.createCorrelationId();
      setCorrelationId(newCorrelationId);
      
      try {
        if (trackingEnabled) {
          await UnifiedObservability.logEvent(
            ServiceName.A_B_TESTING,
            'variant_selection_started',
            Severity.INFO,
            `Starting variant selection for ${contentType}`,
            { contentType, userId: user?.id },
            user?.id,
            newCorrelationId
          );
        }
        
        const test = await PromptABTestingService.getActiveTest(contentType);
        
        if (test) {
          setActiveTest(test);
          
          const variant = await PromptABTestingService.selectVariant(contentType, user?.id);
          
          if (variant) {
            setPromptVariant(variant);
            
            if (trackingEnabled) {
              await UnifiedObservability.logEvent(
                ServiceName.A_B_TESTING,
                'variant_selected',
                Severity.INFO,
                `Selected variant "${variant.name}" for ${contentType}`,
                { 
                  contentType, 
                  variantId: variant.id, 
                  variantName: variant.name,
                  testId: test.id,
                  testName: test.name
                },
                user?.id,
                newCorrelationId
              );
            }
          } else {
            setPromptVariant(createDefaultVariant(defaultPrompt, defaultSystemPrompt));
            
            if (trackingEnabled) {
              await UnifiedObservability.logEvent(
                ServiceName.A_B_TESTING,
                'default_variant_used',
                Severity.INFO,
                `Using default variant for ${contentType}`,
                { contentType, reason: 'no_variant_available' },
                user?.id,
                newCorrelationId
              );
            }
          }
        } else {
          setPromptVariant(createDefaultVariant(defaultPrompt, defaultSystemPrompt));
          
          if (trackingEnabled) {
            await UnifiedObservability.logEvent(
              ServiceName.A_B_TESTING,
              'default_variant_used',
              Severity.INFO,
              `Using default variant for ${contentType}`,
              { contentType, reason: 'no_active_test' },
              user?.id,
              newCorrelationId
            );
          }
        }
      } catch (error) {
        console.error('Error fetching prompt variant:', error);
        
        if (trackingEnabled) {
          await UnifiedObservability.logEvent(
            ServiceName.A_B_TESTING,
            'variant_selection_error',
            Severity.ERROR,
            `Error selecting variant for ${contentType}`,
            { contentType, error: String(error) },
            user?.id,
            newCorrelationId
          );
        }
        
        setPromptVariant(createDefaultVariant(defaultPrompt, defaultSystemPrompt));
      } finally {
        setIsLoading(false);
      }
    };

    if (trackingEnabled) {
      fetchPromptVariant();
    } else {
      setPromptVariant(createDefaultVariant(defaultPrompt, defaultSystemPrompt));
      setIsLoading(false);
    }
  }, [contentType, defaultPrompt, defaultSystemPrompt, user?.id, trackingEnabled]);

  const recordSuccess = useCallback(async (latencyMs: number, tokenUsage?: number) => {
    if (!trackingEnabled || !activeTest || !promptVariant || promptVariant.id === 'default' || !user?.id) return;
    
    try {
      await PromptABTestingService.recordSuccess(
        activeTest.id,
        promptVariant.id,
        user.id,
        latencyMs,
        tokenUsage
      );
      
      await UnifiedObservability.logEvent(
        ServiceName.A_B_TESTING,
        'generation_success',
        Severity.INFO,
        `Successful generation with variant "${promptVariant.name}"`,
        {
          testId: activeTest.id,
          variantId: promptVariant.id,
          latencyMs,
          tokenUsage
        },
        user.id,
        correlationId
      );
    } catch (error) {
      console.error('Error recording success:', error);
      
      await UnifiedObservability.logEvent(
        ServiceName.A_B_TESTING,
        'record_success_error',
        Severity.ERROR,
        `Error recording success for variant "${promptVariant.name}"`,
        { error: String(error) },
        user.id,
        correlationId
      );
    }
  }, [activeTest, promptVariant, user?.id, correlationId, trackingEnabled]);

  const recordFailure = useCallback(async (errorType?: string) => {
    if (!trackingEnabled || !activeTest || !promptVariant || promptVariant.id === 'default' || !user?.id) return;
    
    try {
      await PromptABTestingService.recordFailure(
        activeTest.id,
        promptVariant.id,
        user.id,
        errorType
      );
      
      await UnifiedObservability.logEvent(
        ServiceName.A_B_TESTING,
        'generation_failure',
        Severity.WARNING,
        `Failed generation with variant "${promptVariant.name}"`,
        {
          testId: activeTest.id,
          variantId: promptVariant.id,
          errorType: errorType || 'unknown'
        },
        user.id,
        correlationId
      );
    } catch (error) {
      console.error('Error recording failure:', error);
      
      await UnifiedObservability.logEvent(
        ServiceName.A_B_TESTING,
        'record_failure_error',
        Severity.ERROR,
        `Error recording failure for variant "${promptVariant.name}"`,
        { error: String(error) },
        user.id,
        correlationId
      );
    }
  }, [activeTest, promptVariant, user?.id, correlationId, trackingEnabled]);
  
  const recordMetric = useCallback(async (metricName: string, value: number) => {
    if (!trackingEnabled || !activeTest || !promptVariant || promptVariant.id === 'default' || !user?.id) return;
    
    try {
      await UnifiedObservability.logEvent(
        ServiceName.A_B_TESTING,
        'custom_metric',
        Severity.INFO,
        `Recorded metric "${metricName}" for variant "${promptVariant.name}"`,
        {
          testId: activeTest.id,
          variantId: promptVariant.id,
          metricName,
          value
        },
        user.id,
        correlationId
      );
    } catch (error) {
      console.error('Error recording metric:', error);
    }
  }, [activeTest, promptVariant, user?.id, correlationId, trackingEnabled]);

  return {
    promptVariant,
    activeTest,
    isLoading,
    recordSuccess,
    recordFailure,
    recordMetric
  };
}

function createDefaultVariant(promptText: string, systemPrompt?: string): PromptVariant {
  return {
    id: 'default',
    name: 'Default',
    promptText,
    systemPrompt,
    isControl: true,
    weight: 1
  };
}
