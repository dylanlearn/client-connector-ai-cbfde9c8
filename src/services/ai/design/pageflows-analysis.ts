
import { WebsiteAnalysisService, WebsiteAnalysisResult } from './website-analysis';

/**
 * Service to interact specifically with PageFlows for website analysis
 */
export const PageFlowsAnalysisService = {
  /**
   * Analyze a PageFlows demo
   */
  analyzePageFlowsDemo: async (
    title: string,
    url: string,
    description: string
  ): Promise<WebsiteAnalysisResult> => {
    return WebsiteAnalysisService.analyzeWebsitePattern(
      title,
      description,
      'ux-demo',
      {
        layout: 'Flow-based interactive walkthrough',
        colorScheme: 'Consistent with original website',
        typography: 'Original typography maintained',
        spacing: 'Original spacing with proper emphasis',
        imagery: 'UI screenshots with interactive elements'
      },
      {
        userFlow: 'Step-by-step interaction walkthrough',
        interactions: 'Interactive elements are highlighted',
        accessibility: 'Clear visual indicators for accessibility'
      },
      {
        headline: 'UX Flow Demonstration',
        subheadline: 'Interactive user journey',
        callToAction: 'Explore the user flow',
        valueProposition: 'Seamless user experience',
        testimonials: []
      },
      ['pageflows', 'ux', 'user-journey', 'interaction'],
      url,
      // Screenshot URL can be added here
    );
  }
};
