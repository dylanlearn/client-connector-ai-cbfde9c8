
// Add more precise typing for generation results
export interface WireframeGenerationResult {
  wireframe: WireframeData | null;
  success: boolean;
  message: string;
  errors?: string[];
  intentData?: {
    primary: string;
    confidence: number;
  };
  blueprint?: {
    layout: string;
    sections: string[];
  };
  warnings?: string[];
}

export interface WireframeGenerationParams {
  description: string;
  projectId?: string;
  enhancedCreativity?: boolean;
  validationLevel?: 'basic' | 'standard' | 'advanced';
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text?: string;
    [key: string]: string | undefined;
  };
  typography?: {
    headings: string;
    body: string;
    fontPairings?: string[];
  };
  creativityLevel?: number;
  style?: string | object;
  targetAudience?: string;
  baseWireframe?: WireframeData;
}

// Type for a wireframe component
export interface WireframeComponent {
  id: string;
  type: string;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  zIndex?: number;
  rotation?: number;
  opacity?: number;
  locked?: boolean;
  visible?: boolean;
  content?: string;
  children?: WireframeComponent[];
  props?: Record<string, any>;
  [key: string]: any;
}

// Type for a wireframe section
export interface WireframeSection {
  id: string;
  name?: string;
  sectionType?: string;
  description?: string;
  components?: WireframeComponent[];
  layout?: {
    type: string;
    direction?: string;
    alignment?: string;
    justifyContent?: string;
    columns?: number;
    gap?: number;
    wrap?: boolean;
    [key: string]: any;
  } | string;
  position?: { x: number; y: number };
  x?: number;
  y?: number;
  width?: number | string;
  height?: number | string;
  dimensions?: {
    width: number | string;
    height: number | string;
  };
  backgroundColor?: string;
  copySuggestions?: CopySuggestions;
  gap?: number | string;
  layoutScore?: number;
  optimizationSuggestions?: any[];
  patternMatch?: string | null;
  [key: string]: any;
}

// Type for copy suggestions
export interface CopySuggestions {
  heading?: string;
  subheading?: string;
  ctaText?: string;
  primaryCta?: string;
  secondaryCta?: string;
  supportText?: string;
  supportCta?: string;
  [key: string]: string | undefined;
}

// Type for wireframe data
export interface WireframeData {
  id: string;
  title: string;
  description?: string;
  sections: WireframeSection[];
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    [key: string]: string;
  };
  typography: {
    headings: string;
    body: string;
    fontPairings?: string[];
  };
  layoutType?: string;
  designTokens?: Record<string, any>;
  mobileConsiderations?: string;
  accessibilityNotes?: string;
  style?: string | object;
  pages?: any[];
  styleToken?: string;
  darkMode?: boolean;
  mobileLayouts?: any;
  styleVariants?: any;
  designReasoning?: any;
  animations?: any;
  imageUrl?: string;
  metadata?: Record<string, any>;
  _originalWireframeId?: string;
  lastUpdated?: string;
  projectId?: string;
  [key: string]: any;
}

// Type for AIWireframe data
export interface AIWireframe {
  id: string;
  projectId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  wireframeData: WireframeData;
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
  generationParams?: WireframeGenerationParams;
  [key: string]: any;
}

// Type for EnhancedWireframeGenerationResult
export interface EnhancedWireframeGenerationResult extends WireframeGenerationResult {
  enhancedAnalytics?: {
    sectionAnalysis: Record<string, any>;
    conversionOptimizations: string[];
    accessibilityScore: number;
  };
  designSystemIntegration?: Record<string, any>;
}

// Type guard for WireframeData
export function isWireframeData(obj: unknown): obj is WireframeData {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'title' in obj &&
    'sections' in obj &&
    Array.isArray((obj as WireframeData).sections) &&
    'colorScheme' in obj &&
    'typography' in obj
  );
}

// Helper to normalize wireframe generation params
export function normalizeWireframeGenerationParams(params: WireframeGenerationParams): WireframeGenerationParams {
  return {
    description: params.description || '',
    projectId: params.projectId || '',
    enhancedCreativity: params.enhancedCreativity || false,
    validationLevel: params.validationLevel || 'standard',
    colorScheme: params.colorScheme || {
      primary: '#3182ce',
      secondary: '#805ad5',
      accent: '#ed8936',
      background: '#ffffff',
      text: '#1a202c'
    },
    typography: params.typography || {
      headings: 'Inter',
      body: 'Inter'
    },
    creativityLevel: params.creativityLevel || 5,
    style: params.style || 'modern',
    targetAudience: params.targetAudience || '',
    baseWireframe: params.baseWireframe
  };
}
