
import { WebsiteAnalysisResult, SectionType } from '../types';

/**
 * Service for providing default values for different website section types
 */
export const DefaultsService = {
  /**
   * Get default values for different section types
   */
  getDefaultsForSection: (section: SectionType): Partial<WebsiteAnalysisResult> => {
    const defaults: Record<string, Partial<WebsiteAnalysisResult>> = {
      'hero': {
        visualElements: {
          layout: 'Center-aligned with prominent call-to-action',
          spacing: 'Generous white space to highlight key message',
          colorScheme: 'High contrast for visibility',
          typography: 'Large, bold headings with readable body text',
          imagery: 'Hero image or product showcase'
        },
        userExperience: {
          userFlow: 'Entry point for user journey',
          interactions: 'Primary CTA button, visual indicators',
          accessibility: 'High contrast for readability'
        },
        contentAnalysis: {
          headline: 'Clear value proposition headline',
          subheadline: 'Supporting subheading text',
          callToAction: 'Strong CTA button',
          valueProposition: 'Clear value proposition is essential',
          testimonials: []
        },
        targetAudience: ['All users', 'First-time visitors'],
        tags: ['hero', 'value proposition', 'conversion']
      },
      'testimonials': {
        visualElements: {
          layout: 'Grid or carousel layout',
          spacing: 'Card-based with consistent spacing',
          colorScheme: 'Neutral background with accent colors',
          typography: 'Quote styling with attribution',
          imagery: 'Customer photos or company logos'
        },
        userExperience: {
          userFlow: 'Social proof to reinforce decision making',
          interactions: 'Scrollable or clickable testimonials',
          accessibility: 'Text testimonials with proper contrast'
        },
        contentAnalysis: {
          headline: 'Trust-building headline',
          subheadline: 'Supporting context',
          callToAction: 'Secondary CTA',
          valueProposition: 'Reinforces value through social proof',
          testimonials: ['Sample testimonial']
        },
        targetAudience: ['Considering users', 'Researchers'],
        tags: ['social proof', 'trust', 'credibility']
      },
      'features': {
        visualElements: {
          layout: 'Grid or column-based layout',
          spacing: 'Consistent spacing between feature blocks',
          colorScheme: 'Consistent color coding for features',
          typography: 'Clear feature headings with descriptive text',
          imagery: 'Feature icons or screenshots'
        },
        userExperience: {
          userFlow: 'Product explanation and benefits showcase',
          interactions: 'Visual indicators, possibly expandable sections',
          accessibility: 'Clear feature descriptions'
        },
        contentAnalysis: {
          headline: 'Feature-focused headline',
          subheadline: 'Feature overview text',
          callToAction: 'Learn more or trial CTA',
          valueProposition: 'Specific benefits of each feature',
          testimonials: []
        },
        targetAudience: ['Researchers', 'Comparison shoppers'],
        tags: ['features', 'benefits', 'product details']
      }
    };

    // Ensure we return a properly structured object even for undefined sections
    return defaults[section] || {
      visualElements: {
        layout: '',
        colorScheme: '',
        typography: '',
        spacing: '',
        imagery: ''
      },
      userExperience: {
        userFlow: '',
        interactions: '',
        accessibility: ''
      },
      contentAnalysis: {
        headline: '',
        subheadline: '',
        callToAction: '',
        valueProposition: '',
        testimonials: []
      },
      targetAudience: [],
      tags: []
    };
  },

  /**
   * Get section category mapping
   */
  getSectionCategoryMap: (): Record<string, string> => {
    return {
      'hero': 'layout-hero',
      'testimonials': 'content-testimonials',
      'features': 'content-features',
      'pricing': 'content-pricing',
      'footer': 'layout-footer',
      'navigation': 'layout-navigation'
    };
  }
};
