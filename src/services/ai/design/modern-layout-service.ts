
import { modernMinimalistLayouts } from './data/modern-minimalist-layouts';
import { DesignPattern } from './types/design-patterns';

export interface ModernLayoutRecommendation {
  patternId: string;
  name: string;
  description: string;
  implementation: {
    color: string;
    typography: string;
    spacing: string;
    imagery: string;
    callToAction: string;
  };
  conversionTips: string[];
}

/**
 * Service for recommending modern, conversion-optimized layouts
 */
export const ModernLayoutService = {
  /**
   * Get all available modern layout patterns
   */
  getAllPatterns(): DesignPattern[] {
    return modernMinimalistLayouts;
  },

  /**
   * Get a specific layout pattern by ID
   */
  getPatternById(id: string): DesignPattern | undefined {
    return modernMinimalistLayouts.find(pattern => pattern.id === id);
  },

  /**
   * Recommend layouts based on industry and preferences
   */
  recommendLayoutsForIndustry(
    industry: string,
    preferences: { 
      isDark?: boolean; 
      needsHighConversion?: boolean;
      emphasizeImages?: boolean;
    } = {}
  ): ModernLayoutRecommendation[] {
    // Filter patterns relevant to this industry and preferences
    const relevantPatterns = modernMinimalistLayouts.filter(pattern => {
      // If high conversion is needed, prioritize conversion-optimized layouts
      if (preferences.needsHighConversion && !pattern.conversionOptimized) {
        return false;
      }
      
      // If dark theme preference is specified, filter accordingly
      if (preferences.isDark !== undefined) {
        const hasDarkTheme = pattern.tags.includes('dark-theme');
        if (preferences.isDark !== hasDarkTheme) {
          return false;
        }
      }
      
      // If image emphasis is requested, prioritize layouts with imagery focus
      if (preferences.emphasizeImages && 
          !pattern.tags.some(tag => tag.includes('image') || tag.includes('visual'))) {
        return false;
      }
      
      return true;
    });
    
    // Convert patterns to recommendations with implementation details
    return relevantPatterns.map(pattern => ({
      patternId: pattern.id,
      name: pattern.name,
      description: pattern.description,
      implementation: {
        color: pattern.id === 'dark-hero-dual-image' 
          ? 'Use a dark background (#0f0f0f to #1a1a1a) with high contrast white text (#ffffff) and a vibrant accent color for CTAs'
          : 'Consider a clean color palette with 2-3 colors maximum. Use high contrast between text and background.',
        typography: 'Large, bold sans-serif headlines (48-64px on desktop). Clean, readable body text (16-18px).',
        spacing: 'Generous whitespace between sections. Center aligned content with balanced margins.',
        imagery: pattern.id === 'dark-hero-dual-image'
          ? 'Two high-quality images placed side by side below the hero section, ideally featuring people to create emotional connection'
          : 'High-quality imagery that complements your brand. Ensure proper balance with text content.',
        callToAction: 'Simple, bold button with clear action text. Position centrally for maximum visibility.'
      },
      conversionTips: pattern.conversionFeatures || [
        'Keep headline focused on customer value, not features',
        'Use social proof elements like customer logos',
        'Ensure CTA has high visual contrast',
        'Optimize page load speed for better performance',
        'Test different button text variations'
      ]
    }));
  }
};
