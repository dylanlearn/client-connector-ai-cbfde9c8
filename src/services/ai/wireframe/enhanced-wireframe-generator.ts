import { 
  WireframeData, 
  WireframeGenerationParams, 
  WireframeGenerationResult,
  EnhancedWireframeGenerationResult,
  FeedbackModificationResult,
  FeedbackModificationParams
} from './wireframe-types';
import { wireframeApiService } from './api/wireframe-api-service';
import { v4 as uuidv4 } from 'uuid';

export class EnhancedWireframeGenerator {
  static async generateWireframe(params: WireframeGenerationParams): Promise<EnhancedWireframeGenerationResult> {
    try {
      // Import the proper service that has generateWireframe
      const { wireframeGenerator } = await import('./api/wireframe-generator');
      
      // Generate the basic wireframe
      const result = await wireframeGenerator.generateWireframe(params);
      
      // If the result contains intentData and blueprint from the edge function, use them
      // Otherwise, we'll need to extract them separately
      let enhancedIntentData = result.intentData || {};
      let enhancedBlueprint = result.blueprint || {};
      
      // If we don't have intent data or blueprint from the result, generate them
      if (!result.intentData || !result.blueprint) {
        try {
          // Call the edge function to extract intent
          const intentResponse = await wireframeApiService.callEdgeFunction('generate-advanced-wireframe', {
            action: 'extract-intent',
            userInput: params.description,
            styleToken: params.style
          });
          
          if (intentResponse && intentResponse.success) {
            enhancedIntentData = intentResponse.intentData || {};
          }
          
          // Call the edge function to generate blueprint
          const blueprintResponse = await wireframeApiService.callEdgeFunction('generate-advanced-wireframe', {
            action: 'generate-blueprint',
            userInput: params.description,
            intentData: enhancedIntentData,
            styleToken: params.style
          });
          
          if (blueprintResponse && blueprintResponse.success) {
            enhancedBlueprint = blueprintResponse.blueprint || {};
          }
        } catch (intentError) {
          console.error('Error generating enhanced intent or blueprint:', intentError);
        }
      }
      
      // Generate design tokens based on the wireframe and intent
      const designTokens = await this.generateDesignTokens(result.wireframe, enhancedIntentData);
      
      // Create the final enhanced result
      const enhancedResult: EnhancedWireframeGenerationResult = {
        success: result.success,
        wireframe: result.wireframe,
        error: result.error,
        intentData: enhancedIntentData,
        blueprint: enhancedBlueprint,
        designTokens: designTokens,
        generationTime: result.generationTime,
        model: result.model,
        usage: result.usage
      };
      
      return enhancedResult;
    } catch (error) {
      console.error('Error in enhanced wireframe generation:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        wireframe: {
          id: uuidv4(),
          title: 'Error Wireframe',
          description: 'Failed to generate wireframe',
          sections: [],
        },
        intentData: {},
        blueprint: {},
        designTokens: {},
      };
    }
  }

  static async modifyWireframeBasedOnFeedback(
    wireframe: WireframeData,
    feedback: string
  ): Promise<FeedbackModificationResult> {
    try {
      // Use the wireframe API service to call the edge function for feedback modification
      const response = await wireframeApiService.callEdgeFunction('generate-advanced-wireframe', {
        action: 'modify-wireframe',
        wireframe: wireframe,
        feedback: feedback
      });
      
      // If the edge function call was successful, return the result
      if (response && response.success && response.modifiedWireframe) {
        return {
          success: true,
          wireframe: response.modifiedWireframe,
          changes: response.changes || [],
          modified: true,
          changeDescription: response.changeDescription || `Applied feedback: ${feedback.substring(0, 50)}${feedback.length > 50 ? '...' : ''}`,
          modifiedSections: response.modifiedSections || [], 
          addedSections: response.addedSections || [],
        };
      }
      
      // If the edge function call failed or returned no modified wireframe, 
      // fall back to the local implementation
      console.warn('Edge function did not return a valid response, using local feedback implementation');
      
      // Create a modified version with basic changes - this is a fallback
      const modifiedWireframe: WireframeData = {
        ...wireframe,
        description: `${wireframe.description} (Modified based on feedback)`,
        lastUpdated: new Date().toISOString()
      };
      
      // Identify sections that might be relevant to the feedback using keywords
      const relevantSections = wireframe.sections.filter(section => {
        const sectionText = JSON.stringify(section).toLowerCase();
        const feedbackWords = feedback.toLowerCase().split(/\s+/);
        return feedbackWords.some(word => 
          word.length > 3 && sectionText.includes(word)
        );
      });
      
      // If we found relevant sections, add a note to them
      if (relevantSections.length > 0) {
        modifiedWireframe.sections = wireframe.sections.map(section => {
          if (relevantSections.find(s => s.id === section.id)) {
            return {
              ...section,
              description: (section.description || '') + ' (Modified based on feedback)',
              designReasoning: (section.designReasoning || '') + `\nFeedback applied: ${feedback}`
            };
          }
          return section;
        });
      }
      
      return {
        success: true,
        wireframe: modifiedWireframe,
        changes: relevantSections.map(section => ({
          sectionId: section.id,
          type: 'modified',
          description: 'Added feedback notes'
        })),
        modified: relevantSections.length > 0,
        changeDescription: `Applied feedback to ${relevantSections.length} sections: ${feedback.substring(0, 50)}${feedback.length > 50 ? '...' : ''}`,
        modifiedSections: relevantSections.map(section => section.id),
        addedSections: [],
      };
    } catch (error) {
      console.error('Error modifying wireframe based on feedback:', error);
      return {
        success: false,
        wireframe: wireframe,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Generate design tokens based on wireframe and intent data
   */
  private static async generateDesignTokens(
    wireframe: WireframeData,
    intentData: any
  ): Promise<Record<string, any>> {
    // Extract existing color scheme and typography if available
    const colorScheme = wireframe.colorScheme || {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#111827'
    };
    
    const typography = wireframe.typography || {
      headings: 'sans-serif',
      body: 'sans-serif'
    };
    
    // Generate comprehensive design tokens
    const designTokens = {
      colors: {
        primary: colorScheme.primary,
        secondary: colorScheme.secondary,
        accent: colorScheme.accent,
        background: colorScheme.background,
        text: colorScheme.text,
        // Generate additional color variants
        primaryLight: this.adjustColorBrightness(colorScheme.primary, 40),
        primaryDark: this.adjustColorBrightness(colorScheme.primary, -40),
        secondaryLight: this.adjustColorBrightness(colorScheme.secondary, 40),
        secondaryDark: this.adjustColorBrightness(colorScheme.secondary, -40),
        accentLight: this.adjustColorBrightness(colorScheme.accent, 40),
        accentDark: this.adjustColorBrightness(colorScheme.accent, -40),
        // Additional semantic colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
        // Neutral palette
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      typography: {
        fontFamilies: {
          heading: typography.headings,
          body: typography.body,
        },
        fontSizes: {
          xs: '0.75rem',    // 12px
          sm: '0.875rem',   // 14px
          base: '1rem',     // 16px
          lg: '1.125rem',   // 18px
          xl: '1.25rem',    // 20px
          '2xl': '1.5rem',  // 24px
          '3xl': '1.875rem', // 30px
          '4xl': '2.25rem',  // 36px
          '5xl': '3rem',     // 48px
        },
        fontWeights: {
          thin: 100,
          light: 300,
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700,
          extrabold: 800,
        },
        lineHeights: {
          none: 1,
          tight: 1.25,
          snug: 1.375,
          normal: 1.5,
          relaxed: 1.625,
          loose: 2,
        }
      },
      spacing: {
        px: '1px',
        0: '0',
        0.5: '0.125rem',
        1: '0.25rem',
        1.5: '0.375rem',
        2: '0.5rem',
        2.5: '0.625rem',
        3: '0.75rem',
        3.5: '0.875rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        7: '1.75rem',
        8: '2rem',
        9: '2.25rem',
        10: '2.5rem',
        11: '2.75rem',
        12: '3rem',
        14: '3.5rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
        28: '7rem',
        32: '8rem',
        36: '9rem',
        40: '10rem',
        44: '11rem',
        48: '12rem',
        52: '13rem',
        56: '14rem',
        60: '15rem',
        64: '16rem',
        72: '18rem',
        80: '20rem',
        96: '24rem',
      },
      breakpoints: {
        xs: '320px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        default: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        none: 'none',
      },
      zIndex: {
        0: 0,
        10: 10,
        20: 20,
        30: 30,
        40: 40,
        50: 50,
        auto: 'auto',
      },
      // Add any additional tokens based on intentData
      visualTone: intentData.visualTone || wireframe.style || 'modern',
    };
    
    return designTokens;
  }

  /**
   * Utility to adjust color brightness
   */
  private static adjustColorBrightness(color: string, percent: number): string {
    if (!color || color === 'transparent' || color === 'inherit') {
      return color;
    }
    
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = Math.min(255, Math.max(0, R + Math.round(R * percent / 100)));
    G = Math.min(255, Math.max(0, G + Math.round(G * percent / 100)));
    B = Math.min(255, Math.max(0, B + Math.round(B * percent / 100)));

    const RR = R.toString(16).padStart(2, '0');
    const GG = G.toString(16).padStart(2, '0');
    const BB = B.toString(16).padStart(2, '0');

    return `#${RR}${GG}${BB}`;
  }
}
