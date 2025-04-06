
import { PromptDBService } from "../db-service";
import { mapDbVariantToPromptVariant } from "../utils/type-mappers";
import { StatisticalAnalysis } from "./statistical-analysis";
import type { PromptTestResult, PromptVariant } from "./types";

/**
 * Enhanced test results module with improved statistical analysis
 */
export const PromptTestResults = {
  /**
   * Get test results with sophisticated statistical analysis
   */
  getTestResults: async (testId: string): Promise<PromptTestResult[]> => {
    try {
      // Get test details including min_sample_size and confidence_threshold
      const test = await PromptDBService.getTest(testId);
      if (!test) return [];
      
      // Get all impressions for this test
      const impressions = await PromptDBService.getImpressions(testId);
      
      // Get all results (successes and failures) for this test
      const results = await PromptDBService.getResults(testId);
      
      // Group impressions and results by variant
      const variantStats: Record<string, {
        impressions: number;
        successes: number;
        failures: number;
        latencyMs: number[];
        totalLatency: number;
        tokenUsage: number;
      }> = {};
      
      // Initialize stats for each variant
      test.variants.forEach(variant => {
        variantStats[variant.id] = {
          impressions: 0,
          successes: 0,
          failures: 0,
          latencyMs: [],
          totalLatency: 0,
          tokenUsage: 0
        };
      });
      
      // Count impressions
      impressions.forEach(impression => {
        if (variantStats[impression.variant_id]) {
          variantStats[impression.variant_id].impressions++;
        }
      });
      
      // Process results
      results.forEach(result => {
        if (variantStats[result.variant_id]) {
          if (result.successful) {
            variantStats[result.variant_id].successes++;
            
            // Track latency if available
            if (result.latency_ms) {
              variantStats[result.variant_id].latencyMs.push(result.latency_ms);
              variantStats[result.variant_id].totalLatency += result.latency_ms;
            }
            
            // Track token usage if available
            if (result.token_usage) {
              variantStats[result.variant_id].tokenUsage += result.token_usage;
            }
          } else {
            variantStats[result.variant_id].failures++;
          }
        }
      });
      
      // Format the variants for statistical analysis
      const variantsForAnalysis = test.variants.map(variant => ({
        id: variant.id,
        name: variant.name,
        impressions: variantStats[variant.id].impressions,
        successes: variantStats[variant.id].successes
      }));
      
      // Run statistical analysis
      const significanceResult = StatisticalAnalysis.testSignificance(
        variantsForAnalysis,
        test.confidence_threshold
      );
      
      // Build complete result objects
      const testResults: PromptTestResult[] = test.variants.map(variant => {
        const stats = variantStats[variant.id];
        const impressionCount = stats.impressions;
        const successCount = stats.successes;
        const failureCount = stats.failures;
        
        // Calculate metrics
        const conversionRate = impressionCount > 0
          ? (successCount / impressionCount) * 100
          : 0;
          
        const avgLatency = stats.latencyMs.length > 0
          ? stats.totalLatency / stats.latencyMs.length
          : 0;
          
        const avgTokens = successCount > 0
          ? stats.tokenUsage / successCount
          : 0;
        
        // Calculate lift compared to control
        const controlVariant = test.variants.find(v => v.is_control);
        let lift = 0;
        
        if (controlVariant && controlVariant.id !== variant.id) {
          const controlStats = variantStats[controlVariant.id];
          lift = StatisticalAnalysis.calculateLift(
            controlStats.successes,
            controlStats.impressions,
            successCount,
            impressionCount
          );
        }
        
        // Determine if this is statistically the winner
        const isWinner = significanceResult.isSignificant &&
                        significanceResult.winningVariantId === variant.id;
        
        return {
          variant: mapDbVariantToPromptVariant(variant),
          impressionCount,
          successCount,
          failureCount,
          conversionRate,
          avgLatency,
          avgTokensPerRequest: avgTokens,
          isStatisticallySignificant: isWinner,
          confidenceLevel: isWinner ? significanceResult.confidenceLevel : null,
          lift,
          pValue: isWinner ? significanceResult.pValue : null
        };
      });
      
      return testResults;
      
    } catch (error) {
      console.error("Error getting test results:", error);
      return [];
    }
  }
};
