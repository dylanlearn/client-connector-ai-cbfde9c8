
import { CopySuggestions } from "@/components/wireframe/renderers/utilities";

/**
 * Interface for wireframe component
 */
export interface WireframeComponent {
  id: string;
  type: string;
  name?: string;
  content?: string | any;
  children?: WireframeComponent[];
  style?: Record<string, any>;
  props?: Record<string, any>;
  layout?: any;
  position?: { x: number; y: number };
  dimensions?: { width: number | string; height: number | string };
  states?: Record<string, any>;
  events?: Record<string, any>;
  variants?: string[];
}

/**
 * Interface for animation suggestions
 */
export interface AnimationSuggestion {
  type: string;
  element: string;
  description: string;
  timingFunction?: string;
  duration?: number;
  delay?: number;
  iterations?: number;
  direction?: string;
  keyframes?: Record<string, any>[];
  code?: string;
}

/**
 * Interface for wireframe section
 */
export interface WireframeSection {
  id: string;
  name: string;
  sectionType: string;
  description?: string;
  position?: { x: number; y: number };
  x?: number;
  y?: number;
  dimensions?: { width: number | string; height: number | string };
  width?: number | string;
  height?: number | string;
  components?: WireframeComponent[];
  layout?: any;
  layoutType?: string;
  style?: Record<string, any>;
  data?: Record<string, any>;
  gap?: number | string;
  copySuggestions?: CopySuggestions | CopySuggestions[];
  padding?: string;
  backgroundColor?: string;
  textAlign?: string;
  componentVariant?: string;
  animationSuggestions?: AnimationSuggestion[];
  mobileLayout?: {
    stack?: boolean;
    hideOnMobile?: boolean;
    alternatePlacement?: string;
    responsiveColumns?: number;
  };
  designReasoning?: string;
  stats?: Array<{
    id: string;
    value: string;
    label: string;
  }>;
  dynamicElements?: Record<string, any>;
  styleVariants?: Record<string, any>;
  type?: string; // For backward compatibility
}

/**
 * Interface for wireframe data
 */
export interface WireframeData {
  id: string;
  title: string;
  description: string;
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
    [key: string]: string;
  };
  style?: Record<string, any>;
  designTokens?: Record<string, any>;
  mobileLayouts?: Record<string, any>;
  styleVariants?: Record<string, any>;
  designReasoning?: string;
  animations?: Record<string, any>;
  imageUrl?: string;
  styleToken?: string;
  darkMode?: boolean;
}

/**
 * Interface for AI-generated wireframe
 */
export interface AIWireframe extends WireframeData {
  createdAt?: string;
  updatedAt?: string;
  variationOf?: string;
  projectId?: string;
  userId?: string;
  promptId?: string;
  originalPrompt?: string;
  feedbackSummary?: string;
  score?: number;
  data?: Record<string, any>;
  wireframe_data?: WireframeData;
}

/**
 * Parameters for wireframe generation
 */
export interface WireframeGenerationParams {
  description: string;
  projectId?: string;
  creativityLevel?: number;
  style?: string | Record<string, any>;
  industry?: string;
  targetAudience?: string;
  colorPreferences?: string | string[];
  sections?: string[];
  previousWireframeId?: string;
  templateId?: string;
  baseWireframe?: WireframeData;
  isVariation?: boolean;
  enhancedCreativity?: boolean;
  feedbackMode?: boolean;
  intakeData?: any;
  styleChanges?: string;
  [key: string]: any;
}

/**
 * Result of wireframe generation
 */
export interface WireframeGenerationResult {
  wireframe: WireframeData | null;
  success: boolean;
  message: string;
  errors?: string[];
  warnings?: string[];
  blueprint?: any;
  intentData?: any;
}

/**
 * Enhanced result of wireframe generation with additional data
 */
export interface EnhancedWireframeGenerationResult extends WireframeGenerationResult {
  intentData: Record<string, any>;
  blueprint: Record<string, any>;
  designTokens: Record<string, any>;
}
