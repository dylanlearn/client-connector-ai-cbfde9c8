import { v4 as uuidv4 } from "uuid";
import { 
  PromptDBService, 
  PromptTestsService,
  PromptVariantsService, 
  PromptAnalyticsService 
} from "./db-service";

export type PromptTestStatus = 'active' | 'paused' | 'completed';

export interface PromptVariant {
  id: string;
  name: string;
  promptText: string;
  systemPrompt?: string;
  isControl: boolean;
  weight: number;
}

export interface PromptTest {
  id: string;
  name: string;
  description?: string;
  contentType: string;
  status: PromptTestStatus;
  variants: PromptVariant[];
  createdAt: string;
  updatedAt: string;
  minSampleSize?: number;
  confidenceThreshold?: number;
}

export interface PromptTestResult {
  id: string;
  testId: string;
  variantId: string;
  impressions: number;
  successes: number;
  failures: number;
  averageLatencyMs: number;
  averageTokenUsage: number;
}

/**
 * Service for managing A/B testing of AI prompts with statistical significance tracking
 */
export const PromptABTestingService = {
  /**
   * Get an active test for a specific content type
   */
  getActiveTest: async (contentType: string): Promise<PromptTest | null> => {
    try {
      const data = await PromptTestsService.getActiveTest(contentType);
      
      if (!data) return null;
      
      // Transform database model to our interface
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        contentType: data.content_type,
        status: data.status as PromptTestStatus,
        variants: data.variants.map((v: any) => ({
          id: v.id,
          name: v.name,
          promptText: v.prompt_text,
          systemPrompt: v.system_prompt,
          isControl: v.is_control,
          weight: v.weight
        })),
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        minSampleSize: data.min_sample_size,
        confidenceThreshold: data.confidence_threshold
      };
    } catch (error) {
      console.error("Error in getActiveTest:", error);
      return null;
    }
  },

  /**
   * Select a variant from an active test based on weighted distribution
   */
  selectVariant: async (contentType: string, userId?: string): Promise<PromptVariant | null> => {
    try {
      const test = await PromptABTestingService.getActiveTest(contentType);
      if (!test || !test.variants.length) return null;
      
      // Select a variant based on weights
      const variants = test.variants;
      const totalWeight = variants.reduce((sum, variant) => sum + variant.weight, 0);
      
      // Generate a random number between 0 and the total weight
      const random = Math.random() * totalWeight;
      
      // Find the variant that corresponds to the random value
      let cumulativeWeight = 0;
      for (const variant of variants) {
        cumulativeWeight += variant.weight;
        if (random <= cumulativeWeight) {
          // Record an impression for this variant
          if (userId) {
            await PromptAnalyticsService.recordImpression(test.id, variant.id, userId);
          }
          return variant;
        }
      }
      
      // Fallback to the first variant if something went wrong
      return variants[0];
    } catch (error) {
      console.error("Error in selectVariant:", error);
      return null;
    }
  },

  /**
   * Record an impression for a variant
   */
  recordImpression: async (testId: string, variantId: string, userId: string): Promise<void> => {
    try {
      await PromptAnalyticsService.recordImpression(testId, variantId, userId);
    } catch (error) {
      console.error("Error recording impression:", error);
    }
  },

  /**
   * Record a success for a variant
   */
  recordSuccess: async (
    testId: string, 
    variantId: string, 
    userId: string, 
    latencyMs: number,
    tokenUsage?: number
  ): Promise<void> => {
    try {
      await PromptAnalyticsService.recordSuccess(testId, variantId, userId, latencyMs, tokenUsage);
    } catch (error) {
      console.error("Error recording success:", error);
    }
  },

  /**
   * Record a failure for a variant
   */
  recordFailure: async (
    testId: string, 
    variantId: string, 
    userId: string, 
    errorType?: string
  ): Promise<void> => {
    try {
      await PromptAnalyticsService.recordFailure(testId, variantId, userId, errorType);
    } catch (error) {
      console.error("Error recording failure:", error);
    }
  },

  /**
   * Create a new A/B test
   */
  createTest: async (
    name: string, 
    contentType: string, 
    variants: Omit<PromptVariant, 'id'>[],
    description?: string,
    minSampleSize?: number,
    confidenceThreshold?: number
  ): Promise<string | null> => {
    try {
      // Create the test
      const newTest = await PromptTestsService.createTest({
        name,
        description,
        content_type: contentType,
        min_sample_size: minSampleSize,
        confidence_threshold: confidenceThreshold
      });
      
      if (!newTest) return null;
      
      // Create variants
      const variantsWithTestId = variants.map(variant => ({
        test_id: newTest.id,
        name: variant.name,
        prompt_text: variant.promptText,
        system_prompt: variant.systemPrompt,
        is_control: variant.isControl,
        weight: variant.weight
      }));
      
      const createdVariants = await PromptVariantsService.createVariants(variantsWithTestId);
      
      if (!createdVariants) {
        console.error("Failed to create variants");
        return null;
      }
      
      return newTest.id;
    } catch (error) {
      console.error("Error creating A/B test:", error);
      return null;
    }
  },
  
  /**
   * Get test results with statistical significance calculation
   */
  getTestResults: async (testId: string): Promise<PromptTestResult[] | null> => {
    try {
      // Get the test data
      const testData = await PromptTestsService.getTest(testId);
      if (!testData) return null;
      
      // Get impressions count by variant
      const impressions = await PromptAnalyticsService.getImpressions(testId);
      
      // Process impressions to count them by variant
      const impressionCounts: Record<string, number> = {};
      impressions.forEach((imp: any) => {
        const variantId = imp.variant_id;
        impressionCounts[variantId] = (impressionCounts[variantId] || 0) + 1;
      });
      
      // Get all results
      const results = await PromptDBService.getResults(testId);
      
      // Process the results
      const variantMap = new Map<string, PromptTestResult>();
      
      // Initialize map with impressions
      Object.entries(impressionCounts).forEach(([variantId, count]) => {
        variantMap.set(variantId, {
          id: uuidv4(),
          testId,
          variantId,
          impressions: count,
          successes: 0,
          failures: 0,
          averageLatencyMs: 0,
          averageTokenUsage: 0
        });
      });
      
      // Process results
      let latencySums = new Map<string, number>();
      let tokenSums = new Map<string, number>();
      let successCounts = new Map<string, number>();
      
      results.forEach((result: any) => {
        const variantId = result.variant_id;
        const successful = result.successful;
        
        // Initialize if not exists
        if (!variantMap.has(variantId)) {
          variantMap.set(variantId, {
            id: uuidv4(),
            testId,
            variantId,
            impressions: impressionCounts[variantId] || 0,
            successes: 0,
            failures: 0,
            averageLatencyMs: 0,
            averageTokenUsage: 0
          });
        }
        
        const currentResult = variantMap.get(variantId)!;
        
        if (successful) {
          currentResult.successes++;
          
          // Track latency
          const currentLatencySum = latencySums.get(variantId) || 0;
          latencySums.set(variantId, currentLatencySum + (result.latency_ms || 0));
          
          // Track token usage
          const currentTokenSum = tokenSums.get(variantId) || 0;
          latencySums.set(variantId, currentTokenSum + (result.token_usage || 0));
          
          // Track success count for averaging
          const currentSuccessCount = successCounts.get(variantId) || 0;
          successCounts.set(variantId, currentSuccessCount + 1);
        } else {
          currentResult.failures++;
        }
        
        variantMap.set(variantId, currentResult);
      });
      
      // Calculate averages
      variantMap.forEach((result, variantId) => {
        const successCount = successCounts.get(variantId) || 0;
        if (successCount > 0) {
          result.averageLatencyMs = Math.round(latencySums.get(variantId)! / successCount);
          result.averageTokenUsage = Math.round(tokenSums.get(variantId)! / successCount);
        }
        variantMap.set(variantId, result);
      });
      
      return Array.from(variantMap.values());
    } catch (error) {
      console.error("Error getting test results:", error);
      return null;
    }
  }
};
