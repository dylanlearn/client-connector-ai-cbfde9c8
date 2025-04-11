
/**
 * Copy suggestions type for wireframe sections
 */
export type CopySuggestions = {
  [key: string]: string;
  heading?: string;
  subheading?: string;
  ctaText?: string;
  primaryCta?: string;
  secondaryCta?: string;
  supportText?: string;
  supportCta?: string;
};

/**
 * Wireframe section interface
 */
export interface WireframeSection {
  id: string;
  name?: string;
  type?: string;
  sectionType?: string;
  description?: string;
  copySuggestions?: CopySuggestions | CopySuggestions[];
  style?: Record<string, any>;
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
  components?: Array<any>;
  dimensions?: {
    width: string | number;
    height: string | number;
  };
  position?: {
    x: number;
    y: number;
  };
  backgroundColor?: string;
  stats?: Array<{
    id: string;
    value: string;
    label: string;
  }>;
  [key: string]: any;
}

/**
 * Wireframe data interface
 */
export interface WireframeData {
  id: string;
  title: string;
  description?: string;
  sections: WireframeSection[];
  layoutType?: string;
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text?: string;
  };
  typography?: {
    headings: string;
    body: string;
    fontPairings?: string[];
  };
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
  [key: string]: any;
}

/**
 * Wireframe generation parameters
 */
export interface WireframeGenerationParams {
  projectId?: string;
  description: string;
  designRequirements?: string;
  contentRequirements?: string;
  styling?: string;
  style?: string | Record<string, any>;
  layoutPreferences?: string;
  layoutType?: string;
  enhancedCreativity?: boolean;
  creativityLevel?: number;
  colorScheme?: string | Record<string, string>;
  styleToken?: string;
  industry?: string;
  intakeData?: any;
  [key: string]: any;
}

/**
 * Wireframe generation result
 */
export interface WireframeGenerationResult {
  wireframe: WireframeData;
  intentData?: Record<string, any>;
  blueprint?: Record<string, any>;
  designTokens?: Record<string, any>;
  tokenUsage?: {
    prompt: number;
    completion: number;
    total: number;
  };
  message?: string;
}

/**
 * AI Wireframe model
 */
export interface AIWireframe {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  data: WireframeData;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  status: 'draft' | 'published' | 'archived';
  tags?: string[];
  version?: number;
  feedback?: string[];
}
