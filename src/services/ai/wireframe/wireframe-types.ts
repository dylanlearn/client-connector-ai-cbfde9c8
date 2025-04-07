
/**
 * Type definitions for wireframe components and sections
 */

export interface WireframeSection {
  id: string;
  name: string;
  description?: string;
  sectionType: string;
  componentVariant?: string;
  order?: number;
  data?: Record<string, any>;
  styleProperties?: Record<string, any>;
}

export interface AIWireframe {
  id: string;
  title: string;
  description?: string;
  sections: WireframeSection[];
  imageUrl?: string;
  createdAt?: string;
  lastModified?: string;
  isComplex?: boolean;
  hasMultiplePages?: boolean;
  pages?: WireframePage[];
}

export interface WireframePage {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  sections: WireframeSection[];
  order?: number;
}

export interface WireframeGenerationParams {
  description: string;
  projectId?: string;
  style?: string;
  enhancedCreativity?: boolean;
  creativityLevel?: number;
  multiPageLayout?: boolean;
  pages?: number;
  complexity?: 'simple' | 'moderate' | 'complex';
  baseWireframe?: any;
  includeDesignTokens?: boolean;
  includeMobileLayouts?: boolean;
}

export interface WireframeGenerationResult {
  wireframe: any;
  prompt?: string;
  enhancedPrompt?: string;
  error?: string;
  tokens?: number;
  rawResponse?: any;
}
