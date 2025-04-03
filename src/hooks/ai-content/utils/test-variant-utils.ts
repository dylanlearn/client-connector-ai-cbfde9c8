
import { AIGeneratorService } from '@/services/ai';
import { ContentRequest } from '../types';

/**
 * Fetches and selects the appropriate test variant for the given content type and user
 * @param contentType The type of content being generated
 * @param userId The user ID
 * @param enableABTesting Whether A/B testing is enabled
 * @returns An object containing the test information, or undefined if no test is active
 */
export async function getTestVariant(
  contentType: string, 
  userId?: string,
  enableABTesting = true
): Promise<{
  activeTestId?: string;
  testVariantId?: string;
} | undefined> {
  if (!enableABTesting || !userId) {
    return undefined;
  }
  
  try {
    const test = await AIGeneratorService.getActivePromptTest(contentType);
    if (!test) {
      return undefined;
    }
    
    const activeTestId = test.id;
    const variant = await AIGeneratorService.selectPromptVariant(contentType, userId);
    
    if (!variant) {
      return { activeTestId };
    }
    
    return {
      activeTestId,
      testVariantId: variant.id
    };
  } catch (error) {
    console.error("Error getting A/B test variant:", error);
    return undefined;
  }
}

/**
 * Records test success with latency information
 * @param activeTestId The active test ID
 * @param testVariantId The test variant ID
 * @param userId The user ID
 * @param latencyMs The latency in milliseconds
 */
export async function recordTestSuccess(
  activeTestId?: string,
  testVariantId?: string,
  userId?: string,
  latencyMs?: number
): Promise<void> {
  if (!activeTestId || !testVariantId || !userId) {
    return;
  }
  
  try {
    await AIGeneratorService.recordPromptTestSuccess(
      activeTestId,
      testVariantId,
      userId,
      latencyMs || 0
    );
  } catch (error) {
    console.error("Failed to record test success:", error);
  }
}

/**
 * Records test failure with error information
 * @param activeTestId The active test ID
 * @param testVariantId The test variant ID
 * @param userId The user ID
 * @param errorType The type of error that occurred
 */
export async function recordTestFailure(
  activeTestId?: string,
  testVariantId?: string,
  userId?: string,
  errorType?: string
): Promise<void> {
  if (!activeTestId || !testVariantId || !userId) {
    return;
  }
  
  try {
    await AIGeneratorService.recordPromptTestFailure(
      activeTestId,
      testVariantId,
      userId,
      errorType || 'UnknownError'
    );
  } catch (error) {
    console.error("Failed to record test failure:", error);
  }
}
