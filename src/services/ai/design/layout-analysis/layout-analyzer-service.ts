
import { WireframeData, WireframeSection, WireframeComponent } from '@/services/ai/wireframe/wireframe-types';

export interface LayoutRecommendation {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  category: 'spacing' | 'alignment' | 'hierarchy' | 'visual-balance' | 'responsiveness' | 'other';
  affectedSections: string[];
  suggestedFix: string;
  beforeAfterComparison?: string;
}

export interface LayoutAnalysisResult {
  overallScore: number;
  recommendations: LayoutRecommendation[];
  metrics: {
    consistencyScore: number;
    hierarchyScore: number;
    balanceScore: number;
    spacingScore: number;
    alignmentScore: number;
  };
  strengths: string[];
}

/**
 * Service for analyzing wireframe layouts
 */
export const LayoutAnalyzerService = {
  /**
   * Analyze the layout of a wireframe
   */
  analyzeLayout: async (wireframe: WireframeData): Promise<LayoutAnalysisResult> => {
    // In a real implementation, this would be a comprehensive analysis using AI
    // For this demo, we'll implement some basic analysis logic
    
    const recommendations: LayoutRecommendation[] = [];
    let id = 1;
    
    // Check spacing consistency
    const spacingIssues = checkSpacingConsistency(wireframe);
    recommendations.push(...spacingIssues.map(issue => ({
      ...issue,
      id: `layout-${id++}`
    })));
    
    // Check alignment issues
    const alignmentIssues = checkAlignmentIssues(wireframe);
    recommendations.push(...alignmentIssues.map(issue => ({
      ...issue,
      id: `layout-${id++}`
    })));
    
    // Check visual hierarchy
    const hierarchyIssues = checkVisualHierarchy(wireframe);
    recommendations.push(...hierarchyIssues.map(issue => ({
      ...issue,
      id: `layout-${id++}`
    })));
    
    // Check visual balance
    const balanceIssues = checkVisualBalance(wireframe);
    recommendations.push(...balanceIssues.map(issue => ({
      ...issue,
      id: `layout-${id++}`
    })));
    
    // Check responsiveness considerations
    const responsivenessIssues = checkResponsiveness(wireframe);
    recommendations.push(...responsivenessIssues.map(issue => ({
      ...issue,
      id: `layout-${id++}`
    })));
    
    // Calculate individual scores (1-100)
    const spacingScore = calculateSpacingScore(wireframe);
    const alignmentScore = calculateAlignmentScore(wireframe);
    const hierarchyScore = calculateHierarchyScore(wireframe);
    const balanceScore = calculateBalanceScore(wireframe);
    const consistencyScore = calculateConsistencyScore(wireframe);
    
    // Calculate overall score as weighted average
    const overallScore = Math.round(
      (spacingScore * 0.2) +
      (alignmentScore * 0.2) +
      (hierarchyScore * 0.25) +
      (balanceScore * 0.2) +
      (consistencyScore * 0.15)
    );
    
    // Identify strengths
    const strengths = [];
    if (spacingScore >= 80) strengths.push('Excellent use of spacing');
    if (alignmentScore >= 80) strengths.push('Good alignment throughout design');
    if (hierarchyScore >= 80) strengths.push('Clear visual hierarchy');
    if (balanceScore >= 80) strengths.push('Well-balanced layout');
    if (consistencyScore >= 80) strengths.push('Consistent design system');
    
    return {
      overallScore,
      recommendations,
      metrics: {
        consistencyScore,
        hierarchyScore,
        balanceScore,
        spacingScore,
        alignmentScore
      },
      strengths
    };
  }
};

/**
 * Check spacing consistency across the wireframe
 */
function checkSpacingConsistency(wireframe: WireframeData): Omit<LayoutRecommendation, 'id'>[] {
  const issues: Omit<LayoutRecommendation, 'id'>[] = [];
  const spacingValues = new Set<number>();
  const sectionGaps = new Set<number>();
  const inconsistentSections: string[] = [];
  
  // Collect spacing values
  wireframe.sections.forEach(section => {
    if (section.layout?.gap) {
      if (typeof section.layout.gap === 'number') {
        sectionGaps.add(section.layout.gap);
      }
    }
    
    // Check component spacing
    section.components.forEach(component => {
      if (component.style?.margin) {
        const marginValue = parseMarginValue(component.style.margin);
        if (marginValue) spacingValues.add(marginValue);
      }
      
      if (component.style?.padding) {
        const paddingValue = parseMarginValue(component.style.padding);
        if (paddingValue) spacingValues.add(paddingValue);
      }
    });
    
    // If a section has inconsistent internal spacing
    if (spacingValues.size > 3) {
      inconsistentSections.push(section.id);
    }
  });
  
  // Too many different gap values
  if (sectionGaps.size > 3) {
    issues.push({
      title: 'Inconsistent section spacing',
      description: 'There are too many different gap values between sections, which can create visual inconsistency.',
      severity: 'medium',
      category: 'spacing',
      affectedSections: wireframe.sections.map(s => s.id),
      suggestedFix: 'Standardize on 2-3 spacing values throughout the design for better visual consistency.'
    });
  }
  
  // Sections with inconsistent internal spacing
  if (inconsistentSections.length > 0) {
    issues.push({
      title: 'Inconsistent element spacing',
      description: `${inconsistentSections.length} sections have inconsistent internal spacing between elements.`,
      severity: 'low',
      category: 'spacing',
      affectedSections: inconsistentSections,
      suggestedFix: 'Create a spacing system with 2-3 standard values and apply them consistently.'
    });
  }
  
  // Sections with no spacing defined
  const sectionsWithoutSpacing = wireframe.sections
    .filter(s => !s.layout?.gap && s.components.length > 1)
    .map(s => s.id);
  
  if (sectionsWithoutSpacing.length > 0) {
    issues.push({
      title: 'Missing spacing between elements',
      description: `${sectionsWithoutSpacing.length} sections do not have defined spacing between elements.`,
      severity: 'medium',
      category: 'spacing',
      affectedSections: sectionsWithoutSpacing,
      suggestedFix: 'Add consistent spacing between elements to improve readability and visual organization.'
    });
  }
  
  return issues;
}

/**
 * Check alignment issues in the wireframe
 */
function checkAlignmentIssues(wireframe: WireframeData): Omit<LayoutRecommendation, 'id'>[] {
  const issues: Omit<LayoutRecommendation, 'id'>[] = [];
  const sectionsWithMixedAlignment: string[] = [];
  
  wireframe.sections.forEach(section => {
    const textAlignValues = new Set<string>();
    
    // Check component alignment
    section.components.forEach(component => {
      if (component.style?.textAlign) {
        textAlignValues.add(component.style.textAlign);
      }
    });
    
    // If a section has mixed text alignment
    if (textAlignValues.size > 1) {
      sectionsWithMixedAlignment.push(section.id);
    }
  });
  
  // Sections with mixed text alignment
  if (sectionsWithMixedAlignment.length > 0) {
    issues.push({
      title: 'Inconsistent text alignment',
      description: `${sectionsWithMixedAlignment.length} sections have mixed text alignment, which can create visual disharmony.`,
      severity: 'medium',
      category: 'alignment',
      affectedSections: sectionsWithMixedAlignment,
      suggestedFix: 'Maintain consistent text alignment within each section, preferably using left alignment (for LTR languages) or a single justified approach.'
    });
  }
  
  // Check for sections with no defined layout alignment
  const sectionsWithoutLayoutAlignment = wireframe.sections
    .filter(s => !s.layout?.alignment && !s.layout?.justifyContent)
    .map(s => s.id);
  
  if (sectionsWithoutLayoutAlignment.length > 0) {
    issues.push({
      title: 'Missing layout alignment',
      description: `${sectionsWithoutLayoutAlignment.length} sections do not have defined layout alignment properties.`,
      severity: 'low',
      category: 'alignment',
      affectedSections: sectionsWithoutLayoutAlignment,
      suggestedFix: 'Define alignment and justification properties for more precise layout control.'
    });
  }
  
  return issues;
}

/**
 * Check visual hierarchy issues
 */
function checkVisualHierarchy(wireframe: WireframeData): Omit<LayoutRecommendation, 'id'>[] {
  const issues: Omit<LayoutRecommendation, 'id'>[] = [];
  
  // Check for hero section placement
  const heroSection = wireframe.sections.find(s => s.sectionType === 'hero');
  if (heroSection) {
    const heroIndex = wireframe.sections.findIndex(s => s.id === heroSection.id);
    if (heroIndex > 0) {
      issues.push({
        title: 'Suboptimal hero section placement',
        description: 'The hero section is not the first section on the page, which can confuse users about the main purpose of the page.',
        severity: 'high',
        category: 'hierarchy',
        affectedSections: [heroSection.id],
        suggestedFix: 'Move the hero section to be the first section on the page for clearer visual hierarchy.'
      });
    }
  }
  
  // Check for sections with no clear hierarchy in components
  wireframe.sections.forEach(section => {
    const hasHeading = section.components.some(c => c.type === 'heading' || c.type === 'title');
    const containsContent = section.components.some(c => c.type === 'paragraph' || c.type === 'text');
    
    if (containsContent && !hasHeading && section.sectionType !== 'image-gallery') {
      issues.push({
        title: `Missing heading in ${section.sectionType} section`,
        description: 'This section contains content but no clear heading, making it difficult for users to understand its purpose.',
        severity: 'medium',
        category: 'hierarchy',
        affectedSections: [section.id],
        suggestedFix: 'Add a clear heading to the section to establish hierarchy and guide users.'
      });
    }
  });
  
  return issues;
}

/**
 * Check visual balance in the layout
 */
function checkVisualBalance(wireframe: WireframeData): Omit<LayoutRecommendation, 'id'>[] {
  const issues: Omit<LayoutRecommendation, 'id'>[] = [];
  
  // Check for sections with unbalanced columns
  wireframe.sections.forEach(section => {
    if (
      section.layout?.type === 'grid' || 
      section.layout?.type === 'columns' || 
      section.layout?.columns
    ) {
      const columns = section.layout.columns || 0;
      
      if (columns > 0 && section.components.length % columns !== 0) {
        issues.push({
          title: `Unbalanced columns in ${section.sectionType} section`,
          description: `This section has ${columns} columns but ${section.components.length} components, resulting in uneven distribution.`,
          severity: 'low',
          category: 'visual-balance',
          affectedSections: [section.id],
          suggestedFix: `Either add ${columns - (section.components.length % columns)} more components or adjust the column count to create visual balance.`
        });
      }
    }
  });
  
  return issues;
}

/**
 * Check responsiveness considerations
 */
function checkResponsiveness(wireframe: WireframeData): Omit<LayoutRecommendation, 'id'>[] {
  const issues: Omit<LayoutRecommendation, 'id'>[] = [];
  
  // Check if mobile layouts are defined
  if (!wireframe.mobileLayouts && !wireframe.mobileConsiderations) {
    issues.push({
      title: 'Missing mobile layout considerations',
      description: 'The wireframe does not include any specific mobile layout guidance or responsiveness considerations.',
      severity: 'high',
      category: 'responsiveness',
      affectedSections: wireframe.sections.map(s => s.id),
      suggestedFix: 'Define mobile layout adaptations and considerations for responsive behavior.'
    });
  }
  
  // Check for sections with too many columns for mobile
  wireframe.sections.forEach(section => {
    if (
      section.layout?.columns && 
      section.layout.columns > 2 && 
      !(section.mobileLayout || wireframe.mobileLayouts)
    ) {
      issues.push({
        title: `Too many columns for mobile in ${section.sectionType} section`,
        description: `This section has ${section.layout.columns} columns which will likely create usability issues on mobile devices.`,
        severity: 'medium',
        category: 'responsiveness',
        affectedSections: [section.id],
        suggestedFix: 'Ensure columns collapse to a single column on mobile devices, or define a specific mobile layout with fewer columns.'
      });
    }
  });
  
  return issues;
}

// Calculate metric scores

function calculateSpacingScore(wireframe: WireframeData): number {
  // In a real implementation, this would be much more sophisticated
  // Using spacing consistency, appropriate negative space, etc.
  return 75; // Default demonstration score
}

function calculateAlignmentScore(wireframe: WireframeData): number {
  return 80; // Default demonstration score
}

function calculateHierarchyScore(wireframe: WireframeData): number {
  return 70; // Default demonstration score
}

function calculateBalanceScore(wireframe: WireframeData): number {
  return 85; // Default demonstration score
}

function calculateConsistencyScore(wireframe: WireframeData): number {
  return 75; // Default demonstration score
}

// Helper functions

function parseMarginValue(value: string): number | null {
  // Parse CSS margin/padding values like "10px" or "10px 20px"
  const firstValue = value.split(' ')[0];
  const numericPart = parseInt(firstValue);
  return isNaN(numericPart) ? null : numericPart;
}
