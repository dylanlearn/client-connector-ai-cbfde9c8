
import { v4 as uuidv4 } from "uuid";
import { PromptDBService } from "../db-service";
import { PromptTestResult } from "./types";

/**
 * Functions for retrieving and analyzing test results
 */
export const PromptTestResults = {
  /**
   * Get test results with statistical significance calculation
   */
  getTestResults: async (testId: string): Promise<PromptTestResult[] | null> => {
    try {
      // Get the test data
      const testData = await PromptDBService.getTest(testId);
      if (!testData) return null;
      
      // Get impressions count by variant
      const impressions = await PromptDBService.getImpressions(testId);
      
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
          tokenSums.set(variantId, currentTokenSum + (result.token_usage || 0));
          
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
