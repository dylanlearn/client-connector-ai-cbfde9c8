
import { WebsiteAnalysisResult, SectionType } from './website-analysis/types';
import { WebsiteAnalysisService as Service } from './website-analysis/services/website-analysis-service';

/**
 * Service for analyzing website patterns
 * Maintaining backward compatibility while using the new structure
 */
export type { WebsiteAnalysisResult, SectionType };

export const WebsiteAnalysisService = {
  /**
   * Analyze a website pattern and structure the data
   * @deprecated Use the new modular structure instead
   */
  analyzeWebsitePattern: Service.analyzeWebsitePattern,

  /**
   * Analyze a specific section of a website
   * @deprecated Use the new modular structure instead
   */
  analyzeWebsiteSection: Service.analyzeWebsiteSection,

  /**
   * Store a website analysis result
   * @deprecated Use the new modular structure instead
   */
  storeWebsiteAnalysis: Service.storeWebsiteAnalysis
};
