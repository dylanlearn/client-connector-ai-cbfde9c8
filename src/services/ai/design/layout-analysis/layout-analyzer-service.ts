
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';

export interface LayoutAnalysisResult {
  score: number;
  recommendations: LayoutRecommendation[];
  insightSummary: string;
}

export interface LayoutRecommendation {
  id: string;
  type: 'critical' | 'improvement' | 'suggestion';
  section?: string;
  description: string;
  rationale: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  appliedScore?: number;
}

/**
 * Service for analyzing wireframe layouts and providing intelligent recommendations
 * based on design principles, hierarchy, balance, and alignment.
 */
export const LayoutAnalyzerService = {
  /**
   * Analyze a complete wireframe layout and provide recommendations
   */
  analyzeLayout: async (wireframe: WireframeData): Promise<LayoutAnalysisResult> => {
    try {
      // Calculate initial layout score
      const initialScore = calculateLayoutScore(wireframe);
      
      // Generate recommendations by analyzing various aspects
      const recommendations = [
        ...analyzeHierarchy(wireframe),
        ...analyzeBalance(wireframe),
        ...analyzeSpacing(wireframe),
        ...analyzeAlignment(wireframe),
        ...analyzeVisualFlow(wireframe),
        ...analyzeReadability(wireframe)
      ];
      
      // Sort recommendations by type (critical first)
      recommendations.sort((a, b) => {
        const priority = { critical: 0, improvement: 1, suggestion: 2 };
        return priority[a.type] - priority[b.type];
      });
      
      return {
        score: initialScore,
        recommendations,
        insightSummary: generateInsightSummary(initialScore, recommendations)
      };
    } catch (error) {
      console.error('Error analyzing layout:', error);
      return {
        score: 0.5,
        recommendations: [
          {
            id: 'error-1',
            type: 'critical',
            description: 'Unable to analyze layout completely',
            rationale: 'An error occurred during layout analysis.'
          }
        ],
        insightSummary: 'Layout analysis encountered an error.'
      };
    }
  },
  
  /**
   * Analyze a specific section's layout
   */
  analyzeSection: async (section: WireframeSection): Promise<LayoutRecommendation[]> => {
    try {
      return [
        ...analyzeSectionHierarchy(section),
        ...analyzeSectionBalance(section),
        ...analyzeSectionSpacing(section)
      ];
    } catch (error) {
      console.error('Error analyzing section layout:', error);
      return [{
        id: 'section-error-1',
        type: 'critical',
        section: section.id,
        description: 'Unable to analyze section layout',
        rationale: 'An error occurred during section analysis.'
      }];
    }
  },
  
  /**
   * Apply a specific layout recommendation
   */
  applyRecommendation: async (
    wireframe: WireframeData, 
    recommendationId: string
  ): Promise<WireframeData> => {
    // This would apply the chosen recommendation to the wireframe
    // For now, we'll return a copy of the wireframe with minimal changes
    const updatedWireframe = { ...wireframe };
    
    // In a production implementation, this would make specific changes
    // based on the recommendation type
    
    return updatedWireframe;
  }
};

// Helper functions for layout analysis

function calculateLayoutScore(wireframe: WireframeData): number {
  // A real implementation would evaluate multiple factors
  // For this prototype, we'll use a placeholder score
  
  if (!wireframe || !wireframe.sections) return 0.5;
  
  // Calculate based on number of sections (more complex logic would be used in production)
  const sectionCount = wireframe.sections.length;
  
  // Basic scoring algorithm - more sophisticated in production
  return Math.min(0.85, 0.4 + (sectionCount / 10));
}

function analyzeHierarchy(wireframe: WireframeData): LayoutRecommendation[] {
  const recommendations: LayoutRecommendation[] = [];
  
  if (!wireframe.sections || wireframe.sections.length === 0) {
    return [{
      id: 'hierarchy-1',
      type: 'critical',
      description: 'Add sections to establish visual hierarchy',
      rationale: 'The wireframe lacks content sections. Add a hero section and supporting content to create visual hierarchy.'
    }];
  }
  
  // Check for heading structure
  const hasHeroSection = wireframe.sections.some(s => 
    s.sectionType?.toLowerCase() === 'hero' || 
    s.type?.toLowerCase() === 'hero'
  );
  
  if (!hasHeroSection) {
    recommendations.push({
      id: 'hierarchy-2',
      type: 'improvement',
      description: 'Add a hero section for better hierarchy',
      rationale: 'A hero section helps establish visual hierarchy and draws attention to key messaging.'
    });
  }
  
  return recommendations;
}

function analyzeBalance(wireframe: WireframeData): LayoutRecommendation[] {
  const recommendations: LayoutRecommendation[] = [];
  
  // Check section distribution
  if (wireframe.sections && wireframe.sections.length > 1) {
    const sectionTypes = new Set(wireframe.sections.map(s => s.sectionType || s.type));
    
    if (sectionTypes.size < 2) {
      recommendations.push({
        id: 'balance-1',
        type: 'suggestion',
        description: 'Add variety to section types',
        rationale: 'Using different section types creates visual interest and better content balance.'
      });
    }
  }
  
  return recommendations;
}

function analyzeSpacing(wireframe: WireframeData): LayoutRecommendation[] {
  // Analyze spacing consistency
  return [{
    id: 'spacing-1',
    type: 'suggestion',
    description: 'Maintain consistent spacing between sections',
    rationale: 'Consistent spacing improves visual harmony and readability.'
  }];
}

function analyzeAlignment(wireframe: WireframeData): LayoutRecommendation[] {
  // Check alignment consistency
  return [{
    id: 'alignment-1',
    type: 'improvement',
    description: 'Align elements to a consistent grid',
    rationale: 'Grid-aligned elements create a cleaner, more professional appearance.'
  }];
}

function analyzeVisualFlow(wireframe: WireframeData): LayoutRecommendation[] {
  // Check visual flow and content progression
  return [{
    id: 'flow-1',
    type: 'suggestion',
    description: 'Ensure logical content flow from top to bottom',
    rationale: 'Arrange sections to guide users naturally through your content narrative.'
  }];
}

function analyzeReadability(wireframe: WireframeData): LayoutRecommendation[] {
  // Check content readability
  return [{
    id: 'readability-1',
    type: 'improvement',
    description: 'Ensure sufficient contrast for text elements',
    rationale: 'High contrast text improves readability and accessibility.'
  }];
}

// Section-specific analysis functions

function analyzeSectionHierarchy(section: WireframeSection): LayoutRecommendation[] {
  return [{
    id: `section-hierarchy-${section.id}`,
    type: 'suggestion',
    section: section.id,
    description: 'Establish clear heading hierarchy within section',
    rationale: 'Clear heading structure improves content organization and scanability.'
  }];
}

function analyzeSectionBalance(section: WireframeSection): LayoutRecommendation[] {
  return [{
    id: `section-balance-${section.id}`,
    type: 'suggestion',
    section: section.id,
    description: 'Balance visual elements within section',
    rationale: 'Well-balanced sections create visual harmony and improve focus.'
  }];
}

function analyzeSectionSpacing(section: WireframeSection): LayoutRecommendation[] {
  return [{
    id: `section-spacing-${section.id}`,
    type: 'improvement',
    section: section.id,
    description: 'Adjust inner spacing for better content flow',
    rationale: 'Appropriate spacing between elements improves readability and visual comfort.'
  }];
}

function generateInsightSummary(score: number, recommendations: LayoutRecommendation[]): string {
  const criticalCount = recommendations.filter(r => r.type === 'critical').length;
  const improvementCount = recommendations.filter(r => r.type === 'improvement').length;
  const suggestionCount = recommendations.filter(r => r.type === 'suggestion').length;
  
  if (score < 0.4) {
    return `Your layout needs significant improvements. Address ${criticalCount} critical issues to establish better design foundations.`;
  } else if (score < 0.7) {
    return `Your layout has a solid foundation but could be enhanced. Consider ${improvementCount} improvements to refine your design.`;
  } else {
    return `Your layout demonstrates good design principles. Review ${suggestionCount} suggestions for final polish.`;
  }
}
