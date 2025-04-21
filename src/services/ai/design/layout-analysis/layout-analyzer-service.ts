
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';

/**
 * Layout recommendation for improving a wireframe
 */
export interface LayoutRecommendation {
  id: string;
  title: string;
  description: string;
  before: string;
  after: string;
  impact: 'high' | 'medium' | 'low';
  category: 'spacing' | 'alignment' | 'hierarchy' | 'visual-balance' | 'responsiveness';
}

/**
 * Result of layout analysis including recommendations and scores
 */
export interface LayoutAnalysisResult {
  recommendations: LayoutRecommendation[];
  scores: {
    overall: number;
    spacing: number;
    alignment: number;
    hierarchy: number;
  };
  summary: string;
}

/**
 * Service for analyzing wireframe layouts and providing recommendations
 */
export const LayoutAnalyzerService = {
  /**
   * Analyze a wireframe for layout issues and provide recommendations
   */
  analyzeLayout: async (wireframe: WireframeData): Promise<LayoutAnalysisResult> => {
    // In a real implementation, this would use AI to analyze the layout
    // For this demo, we'll simulate with some common layout recommendations
    
    try {
      const recommendations = generateMockRecommendations(wireframe);
      
      // Calculate scores based on recommendations
      const scores = calculateLayoutScores(recommendations);
      
      // Create a summary
      const summary = generateSummary(recommendations, scores);
      
      return {
        recommendations,
        scores,
        summary
      };
    } catch (error) {
      console.error('Error analyzing layout:', error);
      throw new Error('Failed to analyze layout');
    }
  }
};

/**
 * Generate mock layout recommendations based on the wireframe
 * In a real implementation, this would be replaced with actual analysis
 */
function generateMockRecommendations(wireframe: WireframeData): LayoutRecommendation[] {
  const recommendations: LayoutRecommendation[] = [];
  
  // Check if sections have consistent spacing
  const hasConsistentSpacing = Math.random() > 0.7;
  if (!hasConsistentSpacing) {
    recommendations.push({
      id: 'spacing-1',
      title: 'Inconsistent spacing between sections',
      description: 'Sections have inconsistent vertical spacing, creating a disjointed visual rhythm. Consistent spacing helps create a cohesive flow.',
      before: 'Irregular padding between sections (24px, 48px, 32px)',
      after: 'Consistent 40px padding between all sections',
      impact: 'medium',
      category: 'spacing'
    });
  }
  
  // Check for alignment issues
  const hasAlignmentIssues = Math.random() > 0.6;
  if (hasAlignmentIssues) {
    recommendations.push({
      id: 'alignment-1',
      title: 'Misaligned content elements',
      description: 'Content elements are not properly aligned to a consistent grid, creating visual noise and reducing professionalism.',
      before: 'Text and images aligned to different edges',
      after: 'All elements aligned to a consistent grid system',
      impact: 'high',
      category: 'alignment'
    });
  }
  
  // Check for hierarchy issues
  const hasHierarchyIssues = Math.random() > 0.5;
  if (hasHierarchyIssues) {
    recommendations.push({
      id: 'hierarchy-1',
      title: 'Unclear visual hierarchy',
      description: 'The current layout doesn\'t clearly guide users through content priority. Important elements don\'t stand out enough.',
      before: 'Similar visual weight for all content elements',
      after: 'Clear distinction between primary, secondary, and tertiary elements',
      impact: 'high',
      category: 'hierarchy'
    });
  }
  
  // Check for visual balance
  const hasVisualBalanceIssues = Math.random() > 0.7;
  if (hasVisualBalanceIssues) {
    recommendations.push({
      id: 'visual-balance-1',
      title: 'Unbalanced content distribution',
      description: 'The layout feels visually unbalanced with too much content weight on one side, creating an uneven user experience.',
      before: 'Content concentrated on the left side of the layout',
      after: 'Even distribution of visual weight across the layout',
      impact: 'medium',
      category: 'visual-balance'
    });
  }
  
  // Check for responsiveness concerns
  const hasResponsivenessIssues = Math.random() > 0.4;
  if (hasResponsivenessIssues) {
    recommendations.push({
      id: 'responsiveness-1',
      title: 'Poor mobile adaptability',
      description: 'The layout structure won\'t adapt well to mobile devices. Column counts and spacing need adjustment for smaller screens.',
      before: 'Fixed multi-column layout with small touch targets',
      after: 'Responsive single-column layout with appropriate sizing for mobile',
      impact: 'high',
      category: 'responsiveness'
    });
  }
  
  return recommendations;
}

/**
 * Calculate layout scores based on recommendations
 */
function calculateLayoutScores(recommendations: LayoutRecommendation[]): {
  overall: number;
  spacing: number;
  alignment: number;
  hierarchy: number;
} {
  // Count recommendations by category
  const spacingIssues = recommendations.filter(r => r.category === 'spacing').length;
  const alignmentIssues = recommendations.filter(r => r.category === 'alignment').length;
  const hierarchyIssues = recommendations.filter(r => r.category === 'hierarchy').length;
  
  // Calculate scores (lower issues = higher score)
  const maxIssuesByCategory = 2; // Assuming 2 is the max issues expected per category
  const spacingScore = Math.max(0, 100 - (spacingIssues / maxIssuesByCategory * 100));
  const alignmentScore = Math.max(0, 100 - (alignmentIssues / maxIssuesByCategory * 100));
  const hierarchyScore = Math.max(0, 100 - (hierarchyIssues / maxIssuesByCategory * 100));
  
  // Overall is the weighted average
  const weights = { spacing: 0.3, alignment: 0.3, hierarchy: 0.4 };
  const overall = Math.round(
    (spacingScore * weights.spacing) + 
    (alignmentScore * weights.alignment) + 
    (hierarchyScore * weights.hierarchy)
  );
  
  return {
    overall: Math.round(overall),
    spacing: Math.round(spacingScore),
    alignment: Math.round(alignmentScore),
    hierarchy: Math.round(hierarchyScore)
  };
}

/**
 * Generate a layout summary based on recommendations and scores
 */
function generateSummary(recommendations: LayoutRecommendation[], scores: any): string {
  if (recommendations.length === 0) {
    return "No layout issues detected. The wireframe follows good layout principles.";
  }
  
  const highIssues = recommendations.filter(r => r.impact === 'high').length;
  const mediumIssues = recommendations.filter(r => r.impact === 'medium').length;
  
  let summary = `Analysis found ${recommendations.length} layout improvement opportunities (${highIssues} high, ${mediumIssues} medium impact). `;
  
  if (scores.overall >= 80) {
    summary += "Overall, the wireframe has a good layout structure with minor improvement opportunities.";
  } else if (scores.overall >= 60) {
    summary += "The layout has several areas that could benefit from refinement for better visual communication.";
  } else {
    summary += "Significant layout improvements are recommended to enhance usability and visual appeal.";
  }
  
  return summary;
}
