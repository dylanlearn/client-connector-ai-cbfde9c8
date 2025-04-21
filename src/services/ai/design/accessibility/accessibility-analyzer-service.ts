
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';

/**
 * Represents an accessibility issue found during analysis
 */
export interface AccessibilityIssue {
  id: string;
  title: string;
  description: string;
  recommendation: string;
  severity: 'high' | 'medium' | 'low';
  category: 'contrast' | 'semantic' | 'keyboard' | 'focus' | 'aria' | 'text-alternatives';
  location?: string;
  wcag?: string;
}

/**
 * Result of accessibility analysis including issues and overall scores
 */
export interface AccessibilityAnalysisResult {
  issues: AccessibilityIssue[];
  scores: {
    overall: number;
    contrast: number;
    semantic: number;
    keyboard: number;
  };
  summary: string;
}

/**
 * Service for analyzing wireframes for accessibility issues
 */
export const AccessibilityAnalyzerService = {
  /**
   * Analyze a wireframe for accessibility issues
   */
  analyzeWireframe: async (wireframe: WireframeData): Promise<AccessibilityAnalysisResult> => {
    // In a real implementation, this would use AI to analyze the wireframe
    // For this example, we'll simulate the analysis with some common issues
    
    try {
      const issues = generateMockIssues(wireframe);
      
      // Calculate scores based on issues
      const scores = calculateAccessibilityScores(issues);
      
      // Create a summary
      const summary = generateSummary(issues, scores);
      
      return {
        issues,
        scores,
        summary
      };
    } catch (error) {
      console.error('Error analyzing accessibility:', error);
      throw new Error('Failed to analyze accessibility');
    }
  }
};

/**
 * Generate mock accessibility issues based on the wireframe
 * In a real implementation, this would be replaced with actual analysis
 */
function generateMockIssues(wireframe: WireframeData): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  
  // Add some contrast issues
  if (wireframe.colorScheme) {
    const hasLowContrast = Math.random() > 0.5;
    
    if (hasLowContrast) {
      issues.push({
        id: 'contrast-1',
        title: 'Insufficient color contrast',
        description: 'The contrast ratio between text and background colors does not meet WCAG AA standards. This makes content difficult to read for users with low vision or color blindness.',
        recommendation: 'Adjust the color scheme to ensure a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.',
        severity: 'high',
        category: 'contrast',
        wcag: '1.4.3'
      });
    }
  }
  
  // Check for semantic structure issues
  const hasSections = wireframe.sections && wireframe.sections.length > 0;
  if (hasSections) {
    // Check hero section for heading structure
    const heroSection = wireframe.sections.find(s => s.sectionType === 'hero');
    if (heroSection && Math.random() > 0.3) {
      issues.push({
        id: 'semantic-1',
        title: 'Missing heading structure',
        description: 'The hero section lacks a proper heading structure. Headings help users with screen readers navigate through the page content.',
        recommendation: 'Add a proper H1 heading to the hero section and ensure subsequent sections use appropriate heading levels (H2, H3, etc.).',
        severity: 'medium',
        category: 'semantic',
        location: 'Hero section',
        wcag: '1.3.1'
      });
    }
    
    // Check form sections for labels
    const formSection = wireframe.sections.find(s => s.sectionType === 'contact' || s.sectionType === 'form');
    if (formSection && Math.random() > 0.4) {
      issues.push({
        id: 'semantic-2',
        title: 'Form inputs missing proper labels',
        description: 'Form inputs should have properly associated text labels to help screen reader users understand their purpose.',
        recommendation: 'Add explicit <label> elements for each form input, or use aria-label attributes.',
        severity: 'high',
        category: 'semantic',
        location: 'Form section',
        wcag: '1.3.1'
      });
    }
  }
  
  // Check for keyboard navigation issues
  if (Math.random() > 0.6) {
    issues.push({
      id: 'keyboard-1',
      title: 'Interactive elements not keyboard accessible',
      description: 'Some interactive elements may not be accessible via keyboard navigation, which is essential for users who cannot use a mouse.',
      recommendation: 'Ensure all interactive elements can be reached and operated with keyboard only.',
      severity: 'high',
      category: 'keyboard',
      wcag: '2.1.1'
    });
  }
  
  // Check for focus indication issues
  if (Math.random() > 0.5) {
    issues.push({
      id: 'focus-1',
      title: 'Focus indicators are not visible',
      description: 'Keyboard focus indicators are not clearly visible, making it difficult for keyboard users to track their position.',
      recommendation: 'Add visible focus styles that meet WCAG 2.4.7 requirements. Consider using a high-contrast outline or background change.',
      severity: 'medium',
      category: 'focus',
      wcag: '2.4.7'
    });
  }
  
  // Check for text alternatives for images
  const hasImages = wireframe.sections.some(s => 
    s.components?.some(c => c.type === 'image') || 
    s.sectionType === 'gallery'
  );
  
  if (hasImages && Math.random() > 0.3) {
    issues.push({
      id: 'alt-text-1',
      title: 'Images missing alternative text',
      description: 'Images should have alternative text to convey their content to screen reader users and when images fail to load.',
      recommendation: 'Add meaningful alt text to all images that convey information. Use empty alt attributes for decorative images.',
      severity: 'high',
      category: 'text-alternatives',
      wcag: '1.1.1'
    });
  }
  
  return issues;
}

/**
 * Calculate accessibility scores based on issues found
 */
function calculateAccessibilityScores(issues: AccessibilityIssue[]): {
  overall: number;
  contrast: number;
  semantic: number;
  keyboard: number;
} {
  // Count issues by category
  const contrastIssues = issues.filter(i => i.category === 'contrast').length;
  const semanticIssues = issues.filter(i => ['semantic', 'aria', 'text-alternatives'].includes(i.category)).length;
  const keyboardIssues = issues.filter(i => ['keyboard', 'focus'].includes(i.category)).length;
  
  // Calculate scores (lower issues = higher score)
  const maxIssuesByCategory = 3; // Assuming 3 is the max issues expected per category
  const contrastScore = Math.max(0, 100 - (contrastIssues / maxIssuesByCategory * 100));
  const semanticScore = Math.max(0, 100 - (semanticIssues / maxIssuesByCategory * 100));
  const keyboardScore = Math.max(0, 100 - (keyboardIssues / maxIssuesByCategory * 100));
  
  // Overall is the weighted average
  const weights = { contrast: 0.3, semantic: 0.4, keyboard: 0.3 };
  const overall = Math.round(
    (contrastScore * weights.contrast) + 
    (semanticScore * weights.semantic) + 
    (keyboardScore * weights.keyboard)
  );
  
  return {
    overall: Math.round(overall),
    contrast: Math.round(contrastScore),
    semantic: Math.round(semanticScore),
    keyboard: Math.round(keyboardScore)
  };
}

/**
 * Generate an accessibility summary based on issues and scores
 */
function generateSummary(issues: AccessibilityIssue[], scores: any): string {
  if (issues.length === 0) {
    return "No accessibility issues detected. The wireframe appears to follow accessibility best practices.";
  }
  
  const highIssues = issues.filter(i => i.severity === 'high').length;
  const mediumIssues = issues.filter(i => i.severity === 'medium').length;
  const lowIssues = issues.filter(i => i.severity === 'low').length;
  
  let summary = `Analysis found ${issues.length} accessibility issues (${highIssues} high, ${mediumIssues} medium, ${lowIssues} low severity). `;
  
  if (scores.overall >= 80) {
    summary += "Overall, the wireframe has good accessibility but could benefit from a few improvements.";
  } else if (scores.overall >= 60) {
    summary += "The wireframe has moderate accessibility concerns that should be addressed before development.";
  } else {
    summary += "Significant accessibility issues were detected that require immediate attention.";
  }
  
  return summary;
}
