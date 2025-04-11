
import { v4 as uuidv4 } from 'uuid';
import { WireframeData, WireframeSection } from '../wireframe-types';
import { generateSections } from './wireframe-sections';
import { generateColorScheme } from './wireframe-colors';
import { generateTypography } from './wireframe-typography';
import { generateDesignTokens } from './wireframe-design-tokens';
import { generateLayoutType } from './wireframe-layout';
import { generateMobileConsiderations } from './wireframe-mobile';
import { generateAccessibilityNotes } from './wireframe-accessibility';
import { generateDesignReasoning } from './wireframe-reasoning';
import { generateAnimations } from './wireframe-animations';
import { generateStyleVariants } from './wireframe-style-variants';

/**
 * Generate a wireframe based on AI analysis of the description
 */
export const generateWireframeFromAI = async (
  description: string,
  options: {
    style?: string | Record<string, any>;
    industry?: string;
    targetAudience?: string;
    colorPreferences?: string | string[];
    sections?: string[];
    enhancedCreativity?: boolean;
    feedbackMode?: boolean;
  } = {}
): Promise<WireframeData> => {
  try {
    // Generate wireframe components based on description
    const {
      title,
      sections,
      colorScheme,
      typography,
      layoutType,
      designTokens,
      mobileConsiderations,
      accessibilityNotes,
      designReasoning,
      animations,
      styleVariants
    } = await analyzeAndGenerateWireframeComponents(description, options);

    // Process typography to ensure fontPairings is handled correctly
    const processedTypography = {
      headings: typography.headings,
      body: typography.body,
      // Convert fontPairings to string if it's an array
      ...(typography.fontPairings && {
        fontPairings: Array.isArray(typography.fontPairings)
          ? typography.fontPairings.join(',')
          : typography.fontPairings
      })
    };

    // Create the wireframe data
    const wireframeData: WireframeData = {
      id: uuidv4(),
      title: title || 'AI Generated Wireframe',
      description: description || 'Generated based on AI analysis',
      sections: sections,
      colorScheme: colorScheme,
      typography: processedTypography,
      layoutType: layoutType,
      designTokens: designTokens,
      mobileConsiderations: mobileConsiderations,
      accessibilityNotes: accessibilityNotes,
      designReasoning: designReasoning,
      animations: animations ? JSON.parse(JSON.stringify(animations)) : undefined,
      styleVariants: styleVariants
    };

    return wireframeData;
  } catch (error) {
    console.error('Error generating wireframe from AI:', error);
    throw error;
  }
};

/**
 * Analyze description and generate wireframe components
 */
async function analyzeAndGenerateWireframeComponents(
  description: string,
  options: {
    style?: string | Record<string, any>;
    industry?: string;
    targetAudience?: string;
    colorPreferences?: string | string[];
    sections?: string[];
    enhancedCreativity?: boolean;
    feedbackMode?: boolean;
  }
) {
  // Extract style information
  const styleInfo = typeof options.style === 'string' 
    ? { description: options.style } 
    : options.style || {};

  // Generate title based on description
  const title = generateTitle(description);

  // Generate sections based on description and options
  const sections = await generateSections(description, {
    requestedSections: options.sections,
    industry: options.industry,
    targetAudience: options.targetAudience,
    enhancedCreativity: options.enhancedCreativity
  });

  // Generate color scheme based on description and preferences
  const colorScheme = await generateColorScheme(description, {
    preferences: options.colorPreferences,
    style: styleInfo,
    industry: options.industry
  });

  // Generate typography based on description and style
  const typography = await generateTypography(description, {
    style: styleInfo,
    industry: options.industry
  });

  // Generate layout type based on description
  const layoutType = await generateLayoutType(description);

  // Generate design tokens based on color scheme and typography
  const designTokens = await generateDesignTokens(colorScheme, typography);

  // Generate mobile considerations
  const mobileConsiderations = await generateMobileConsiderations(sections);

  // Generate accessibility notes
  const accessibilityNotes = await generateAccessibilityNotes(colorScheme, typography);

  // Generate design reasoning
  const designReasoning = await generateDesignReasoning(description, {
    sections,
    colorScheme,
    typography,
    style: styleInfo
  });

  // Generate animations if enhanced creativity is enabled
  const animations = options.enhancedCreativity 
    ? await generateAnimations(sections) 
    : undefined;

  // Generate style variants if enhanced creativity is enabled
  const styleVariants = options.enhancedCreativity 
    ? await generateStyleVariants(colorScheme) 
    : undefined;

  return {
    title,
    sections,
    colorScheme,
    typography,
    layoutType,
    designTokens,
    mobileConsiderations,
    accessibilityNotes,
    designReasoning,
    animations,
    styleVariants
  };
}

/**
 * Generate a title based on the description
 */
function generateTitle(description: string): string {
  // Simple implementation - extract first few words or use generic title
  const words = description.split(' ');
  if (words.length > 3) {
    return words.slice(0, 3).join(' ') + ' Wireframe';
  }
  return 'AI Generated Wireframe';
}

export default {
  generateWireframeFromAI
};
