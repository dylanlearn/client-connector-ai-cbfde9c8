
import { v4 as uuidv4 } from 'uuid';

export interface WireframeColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface WireframeTypography {
  headings: string;
  body: string;
}

export interface WireframeComponent {
  id: string;
  type: string;
  name?: string;
  content?: string;
  attributes?: Record<string, any>;
  children?: WireframeComponent[];
}

export interface WireframeSection {
  id: string;
  name: string;
  sectionType: string;
  description: string;
  components: WireframeComponent[];
  layout?: {
    type?: string;
    direction?: string;
    alignment?: string;
  };
  positionOrder?: number;
  
  // Additional properties used across the application
  x?: number;
  y?: number;
  width?: number | string;
  height?: number | string;
  backgroundColor?: string;
  gap?: number | string;
  padding?: string;
  style?: Record<string, any>;
  dimensions?: {
    width: number | string;
    height: number | string;
  };
  position?: {
    x: number;
    y: number;
  };
  layoutType?: string;
  copySuggestions?: {
    heading?: string;
    subheading?: string;
    ctaText?: string;
    primaryCta?: string;
    secondaryCta?: string;
    supportText?: string;
    supportCta?: string;
    [key: string]: any;
  };
  animationSuggestions?: {
    type?: string;
    duration?: string;
    delay?: string;
    timing?: string;
    direction?: string;
    [key: string]: any;
  };
  mobileLayout?: any;
  designReasoning?: any;
  data?: any;
  stats?: Array<{
    id: string;
    value: string;
    label: string;
  }>;
}

export interface WireframeData {
  id: string;
  title: string;
  description?: string;
  sections: WireframeSection[];
  colorScheme: WireframeColorScheme;
  typography: WireframeTypography;
  projectId?: string;
  lastUpdated?: string;
  layoutType?: string;
  designTokens?: Record<string, any>;
}

export interface WireframeGenerationParams {
  description?: string;
  projectId?: string;
  creativityLevel?: number;
  colorScheme?: WireframeColorScheme;
  typography?: WireframeTypography;
  baseWireframe?: WireframeData;
  styleChanges?: string;
  isVariation?: boolean;
  enhancedCreativity?: boolean;
}

export interface WireframeIntentData {
  primary: string;
  confidence: number;
  primaryGoal: string;
}

export interface WireframeBlueprint {
  layout: string;
  sections: string[];
  layoutStrategy: string;
}

export interface WireframeGenerationResult {
  wireframe: WireframeData | null;
  success: boolean;
  message: string;
  intentData?: WireframeIntentData | null;
  blueprint?: WireframeBlueprint | null;
  errors?: string[];
}

export interface EnhancedWireframeGenerationResult extends WireframeGenerationResult {
  intentData: WireframeIntentData;
  blueprint: WireframeBlueprint;
}

export interface AIWireframe {
  id: string;
  wireframeData: WireframeData;
  generatedAt: string;
  prompt: string;
}

export function normalizeWireframeGenerationParams(
  params: WireframeGenerationParams
): WireframeGenerationParams {
  return {
    ...params,
    projectId: params.projectId || uuidv4(),
    creativityLevel: params.creativityLevel || 5,
    description: params.description || ''
  };
}

export function isWireframeData(value: any): value is WireframeData {
  return (
    value &&
    typeof value === 'object' &&
    'id' in value &&
    'title' in value &&
    'sections' in value &&
    Array.isArray(value.sections) &&
    'colorScheme' in value &&
    'typography' in value
  );
}
