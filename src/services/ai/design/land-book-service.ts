
import { DesignPattern } from './types/design-pattern-types';
import { modernMinimalistLayouts } from './data/modern-minimalist-layouts';
import { DesignInsight } from './types/design-insight-types';

export interface LandBookQueryOptions {
  industry?: string;
  pattern?: string;
  conversionFocus?: boolean;
  tags?: string[];
}

export interface LandBookAnalysis {
  patterns: DesignPattern[];
  insights: DesignInsight[];
  psychologyPrinciples: {
    principle: string;
    application: string;
    impact: string;
  }[];
  technicalConsiderations: {
    aspect: string;
    implementation: string;
    benefit: string;
  }[];
}

/**
 * Service for accessing and analyzing web design patterns inspired by Land-book
 */
export const LandBookService = {
  /**
   * Query design patterns with specific criteria
   */
  queryPatterns(options: LandBookQueryOptions = {}): DesignPattern[] {
    let patterns = [...modernMinimalistLayouts];
    
    // Filter by industry
    if (options.industry) {
      patterns = patterns.filter(pattern => 
        pattern.bestFor.some(industry => 
          industry.toLowerCase().includes(options.industry!.toLowerCase())
        )
      );
    }
    
    // Filter by pattern type
    if (options.pattern) {
      patterns = patterns.filter(pattern => 
        pattern.id.includes(options.pattern!) || 
        pattern.name.toLowerCase().includes(options.pattern!.toLowerCase()) ||
        pattern.description.toLowerCase().includes(options.pattern!.toLowerCase())
      );
    }
    
    // Filter by conversion focus
    if (options.conversionFocus !== undefined) {
      patterns = patterns.filter(pattern => 
        pattern.conversionOptimized === options.conversionFocus
      );
    }
    
    // Filter by tags
    if (options.tags && options.tags.length > 0) {
      patterns = patterns.filter(pattern => 
        options.tags!.some(tag => pattern.tags.includes(tag))
      );
    }
    
    return patterns;
  },
  
  /**
   * Get design patterns specifically for an industry
   */
  getPatternsForIndustry(industry: string): DesignPattern[] {
    return this.queryPatterns({ industry });
  },
  
  /**
   * Get comprehensive analysis of design patterns for specific criteria
   */
  getDesignAnalysis(options: LandBookQueryOptions = {}): LandBookAnalysis {
    const patterns = this.queryPatterns(options);
    
    // Generate insights based on the patterns
    const insights: DesignInsight[] = generateInsightsFromPatterns(patterns);
    
    // Extract psychology principles
    const psychologyPrinciples = extractPsychologyPrinciples(patterns);
    
    // Extract technical considerations
    const technicalConsiderations = extractTechnicalConsiderations(patterns);
    
    return {
      patterns,
      insights,
      psychologyPrinciples,
      technicalConsiderations
    };
  }
};

/**
 * Generate design insights from patterns
 */
function generateInsightsFromPatterns(patterns: DesignPattern[]): DesignInsight[] {
  const insights: DesignInsight[] = [];
  
  // Add common layout insights
  if (patterns.some(p => p.tags.includes('split-screen'))) {
    insights.push({
      id: 'split-screen-effectiveness',
      title: 'Split-Screen Layout Effectiveness',
      description: 'Split-screen layouts create visual balance while clearly separating content and visuals, making them highly effective for showcasing products or services alongside their benefits.',
      impact: 'high',
      category: 'layout',
      applicablePatterns: patterns.filter(p => p.tags.includes('split-screen')).map(p => p.id)
    });
  }
  
  // Add typography insights
  if (patterns.some(p => p.elements.typography.includes('bold'))) {
    insights.push({
      id: 'typography-hierarchy',
      title: 'Bold Typography Hierarchy',
      description: 'Bold, varied typography creates clear visual hierarchy, guiding users through content while establishing brand personality and improving information retention.',
      impact: 'medium',
      category: 'typography',
      applicablePatterns: patterns.filter(p => p.elements.typography.includes('bold')).map(p => p.id)
    });
  }
  
  // Add spacing insights
  if (patterns.some(p => p.elements.spacing.includes('white'))) {
    insights.push({
      id: 'whitespace-clarity',
      title: 'Strategic Whitespace',
      description: 'Generous whitespace improves content legibility, creates visual breathing room, and helps establish content priority, leading to better user comprehension and engagement.',
      impact: 'high',
      category: 'spacing',
      applicablePatterns: patterns.filter(p => p.elements.spacing.includes('white')).map(p => p.id)
    });
  }
  
  // Add CTA insights
  if (patterns.some(p => p.elements.cta.includes('contrast'))) {
    insights.push({
      id: 'high-contrast-cta',
      title: 'High-Contrast Call to Action',
      description: 'High-contrast CTAs create visual prominence and clear action paths, significantly improving conversion rates by making desired actions immediately obvious to users.',
      impact: 'high',
      category: 'conversion',
      applicablePatterns: patterns.filter(p => p.elements.cta.includes('contrast')).map(p => p.id)
    });
  }
  
  return insights;
}

/**
 * Extract psychology principles from patterns
 */
function extractPsychologyPrinciples(patterns: DesignPattern[]): {
  principle: string;
  application: string;
  impact: string;
}[] {
  return [
    {
      principle: 'Visual Hierarchy Control',
      application: 'Using contrast, scale, and spacing to create deliberate viewing paths that guide users through a predetermined journey.',
      impact: 'Directs user attention to key content and actions in a specific sequence, improving comprehension and conversion rates.'
    },
    {
      principle: 'Cognitive Load Management',
      application: 'Limiting choices to prevent decision fatigue, especially in conversion-focused sections where options are reduced to essential actions.',
      impact: 'Reduces mental effort required to navigate the interface, leading to higher completion rates for desired actions.'
    },
    {
      principle: 'Gestalt Principles Application',
      application: 'Using proximity, similarity, and continuity to organize information in ways that feel intuitive and reduce cognitive processing effort.',
      impact: 'Creates perceived relationships between elements that help users naturally understand the content structure without explicit instructions.'
    },
    {
      principle: 'Social Proof Integration',
      application: 'Strategically placing testimonials, client logos, or usage statistics near decision points to leverage social influence.',
      impact: 'Reduces perceived risk and increases trust at critical conversion moments through demonstrated social validation.'
    }
  ];
}

/**
 * Extract technical considerations from patterns
 */
function extractTechnicalConsiderations(patterns: DesignPattern[]): {
  aspect: string;
  implementation: string;
  benefit: string;
}[] {
  return [
    {
      aspect: 'Performance-Optimized Visuals',
      implementation: 'Implementing lazy loading, responsive image serving, and SVG usage for interface elements.',
      benefit: 'Maintains visual impact while ensuring fast loading times across devices and connection speeds.'
    },
    {
      aspect: 'Purposeful Micro-interactions',
      implementation: 'Adding subtle animations and transitions that serve functional purposes rather than just decoration.',
      benefit: 'Confirms actions, establishes spatial relationships, and maintains context during state changes.'
    },
    {
      aspect: 'Content Priority Shifts',
      implementation: 'Strategically reprioritizing content on mobile rather than simply stacking desktop elements.',
      benefit: 'Delivers optimized experiences for mobile contexts where user needs and behaviors differ from desktop.'
    },
    {
      aspect: 'Accessibility Integration',
      implementation: 'Incorporating WCAG principles through sufficient contrast ratios, keyboard navigation, and semantic structure.',
      benefit: 'Ensures designs are usable by all users while maintaining visual sophistication and conversion effectiveness.'
    }
  ];
}
