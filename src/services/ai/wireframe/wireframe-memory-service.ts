import { v4 as uuidv4 } from 'uuid';
import {
  AIWireframe,
  AIWireframeSection,
  AIWireframeComponent,
  AIContentPreferences,
  AIStylePreferences,
  AIIndustryPreferences,
  AIUserFeedback,
  AIWireframeMemory,
  AICombinedMemory,
  WireframeSection,
  WireframeComponent
} from './wireframe-types';

/**
 * In-memory storage for AI wireframe generation context
 */
const memory: AIWireframeMemory = {
  userFeedback: [],
  contentPreferences: {
    tone: 'neutral',
    style: 'descriptive',
    keywords: []
  },
  stylePreferences: {
    visualStyle: 'modern',
    colorPalette: 'light',
    layoutType: 'responsive'
  },
  industryPreferences: {
    industryType: 'technology',
    targetAudience: 'general public',
    brandPersonality: 'innovative'
  }
};

/**
 * Get the current AI memory state
 */
export const getAIMemory = (): AIWireframeMemory => {
  return { ...memory };
};

/**
 * Update the AI memory with new user feedback
 */
export const updateAIUserFeedback = (feedback: AIUserFeedback): void => {
  memory.userFeedback.push(feedback);
};

/**
 * Update the AI memory with new content preferences
 */
export const updateAIContentPreferences = (preferences: AIContentPreferences): void => {
  memory.contentPreferences = { ...memory.contentPreferences, ...preferences };
};

/**
 * Update the AI memory with new style preferences
 */
export const updateAIStylePreferences = (preferences: AIStylePreferences): void => {
  memory.stylePreferences = { ...memory.stylePreferences, ...preferences };
};

/**
 * Update the AI memory with new industry preferences
 */
export const updateAIIndustryPreferences = (preferences: AIIndustryPreferences): void => {
  memory.industryPreferences = { ...memory.industryPreferences, ...preferences };
};

/**
 * Reset the AI memory to its initial state
 */
export const resetAIMemory = (): void => {
  memory.userFeedback = [];
  memory.contentPreferences = {
    tone: 'neutral',
    style: 'descriptive',
    keywords: []
  };
  memory.stylePreferences = {
    visualStyle: 'modern',
    colorPalette: 'light',
    layoutType: 'responsive'
  };
  memory.industryPreferences = {
    industryType: 'technology',
    targetAudience: 'general public',
    brandPersonality: 'innovative'
  };
};

/**
 * Combine all AI memory into a single object for prompt generation
 */
export const getCombinedAIMemory = async (): Promise<AICombinedMemory> => {
  const combinedMemory: AICombinedMemory = {
    userFeedback: memory.userFeedback,
    contentTone: memory.contentPreferences.tone,
    contentStyle: memory.contentPreferences.style,
    contentKeywords: memory.contentPreferences.keywords,
    visualStyle: memory.stylePreferences.visualStyle,
    colorPalette: memory.stylePreferences.colorPalette,
    layoutType: memory.stylePreferences.layoutType,
    industryType: memory.industryPreferences.industryType,
    targetAudience: memory.industryPreferences.targetAudience,
    brandPersonality: memory.industryPreferences.brandPersonality
  };
  
  return combinedMemory;
};

/**
 * Get a string representation of the AI memory for prompt generation
 */
export const getAIMemoryString = async (): Promise<string> => {
  const combinedMemory = await getCombinedAIMemory();
  
  let memoryString = 'AI Memory Context:\n';
  
  memoryString += `User Feedback: ${JSON.stringify(combinedMemory.userFeedback)}\n`;
  memoryString += `Content Tone: ${combinedMemory.contentTone}\n`;
  memoryString += `Content Style: ${combinedMemory.contentStyle}\n`;
  memoryString += `Content Keywords: ${JSON.stringify(combinedMemory.contentKeywords)}\n`;
  memoryString += `Visual Style: ${combinedMemory.visualStyle}\n`;
  memoryString += `Color Palette: ${combinedMemory.colorPalette}\n`;
  memoryString += `Layout Type: ${combinedMemory.layoutType}\n`;
  memoryString += `Industry Type: ${combinedMemory.industryType}\n`;
  memoryString += `Target Audience: ${combinedMemory.targetAudience}\n`;
  memoryString += `Brand Personality: ${combinedMemory.brandPersonality}\n`;
  
  return memoryString;
};

/**
 * Get a content tone preference
 */
const getContentTonePreference = (tonePreference: string | undefined): string => {
  return tonePreference?.toLowerCase() || 'neutral';
};

/**
 * Get a content style preference
 */
const getContentStylePreference = (stylePreference: string | undefined): string => {
  return stylePreference?.toLowerCase() || 'descriptive';
};

/**
 * Get a visual style preference
 */
const getVisualStylePreference = (stylePreference: string | undefined): string => {
  return stylePreference?.toLowerCase() || 'modern';
};

/**
 * Get a color palette preference
 */
const getColorPalettePreference = (colorPalette: string | undefined): string => {
  return colorPalette?.toLowerCase() || 'light';
};

/**
 * Get a layout type preference
 */
const getLayoutTypePreference = (layoutType: string | undefined): string => {
  return layoutType?.toLowerCase() || 'responsive';
};

/**
 * Get an industry type preference
 */
const getIndustryTypePreference = (industryType: string | undefined): string => {
  return industryType?.toLowerCase() || 'technology';
};

/**
 * Get a target audience preference
 */
const getTargetAudiencePreference = (targetAudience: string | undefined): string => {
  return targetAudience?.toLowerCase() || 'general public';
};

/**
 * Get a brand personality preference
 */
const getBrandPersonalityPreference = (brandPersonality: string | undefined): string => {
  return brandPersonality?.toLowerCase() || 'innovative';
};

// Check for the type before calling toLowerCase
const getStylePreference = (stylePreference: string | Record<string, any> | undefined): string => {
  if (typeof stylePreference === 'string') {
    return stylePreference.toLowerCase();
  } else if (stylePreference && typeof stylePreference === 'object') {
    return JSON.stringify(stylePreference);
  }
  return 'modern'; // Default style
};
