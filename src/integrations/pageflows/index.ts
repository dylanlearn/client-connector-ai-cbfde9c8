
import { PageFlowsAnalysisService } from '@/services/ai/design/pageflows-analysis';

/**
 * Initialize PageFlows design patterns in memory
 * This can be called on app startup or when needed
 */
export const initializePageFlowsPatterns = async () => {
  // Store pre-analyzed patterns from PageFlows
  return await PageFlowsAnalysisService.storePageFlowsPatterns();
};

