
/**
 * Type definitions for AI wireframe generation and management
 */

export interface WireframeGenerationParams {
  prompt: string;
  projectId: string;
  style?: string;
  complexity?: 'simple' | 'medium' | 'complex';
  pages?: string[];
  industry?: string;
  additionalInstructions?: string;
  moodboardSelections?: {
    layoutPreferences?: string[];
    fonts?: string[];
    colors?: string[];
    tone?: string[];
  };
  intakeResponses?: {
    businessGoals?: string;
    targetAudience?: string;
    siteFeatures?: string[];
  };
}

export interface WireframeComponent {
  type: string;
  content: string;
  style?: string;
  position?: string;
}

export interface WireframeCopySuggestions {
  heading?: string;
  subheading?: string;
  cta?: string;
  body?: string;
}

export interface WireframeAnimationSuggestion {
  type: string;
  element: string;
  timing?: string;
  description?: string;
}

export interface WireframeDynamicElement {
  type: string;
  purpose: string;
  implementation?: string;
}

export interface WireframeStyleVariant {
  name: string;
  description: string;
  keyDifferences: string[];
}

export interface WireframeMobileLayout {
  structure: string;
  stackOrder?: string[];
  adjustments?: string[];
}

export interface WireframeSection {
  name: string;
  sectionType: string;
  description: string;
  layoutType: string;
  components: WireframeComponent[];
  copySuggestions?: WireframeCopySuggestions;
  animationSuggestions?: WireframeAnimationSuggestion;
  designReasoning?: string;
  mobileLayout?: WireframeMobileLayout;
  dynamicElements?: WireframeDynamicElement[];
  styleVariants?: WireframeStyleVariant[];
}

export interface WireframeDesignTokens {
  colors: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
  typography: {
    headings?: string;
    body?: string;
    fontPairings?: string[];
  };
  spacing?: {
    sectionPadding?: string;
    elementGap?: string;
  };
}

export interface WireframeQualityFlags {
  unclearInputs?: string[];
  recommendedClarifications?: string[];
  optimized?: boolean;
}

export interface WireframeData {
  title: string;
  description: string;
  sections: WireframeSection[];
  designTokens?: WireframeDesignTokens;
  qualityFlags?: WireframeQualityFlags;
  mobileConsiderations?: string;
  accessibilityNotes?: string;
}

export interface WireframeGenerationResult {
  wireframe: WireframeData;
  generationTime: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AIWireframe {
  id: string;
  project_id: string;
  prompt: string;
  description?: string;
  image_url?: string;
  generation_params?: Record<string, any>;
  feedback?: string;
  rating?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  design_tokens?: Record<string, any>;
  mobile_layouts?: Record<string, any>;
  animations?: Record<string, any>;
  style_variants?: Record<string, any>;
  design_reasoning?: string;
  quality_flags?: Record<string, any>;
}
