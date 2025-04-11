
import { CopySuggestions } from "@/components/wireframe/renderers/utilities";

/**
 * Interface for wireframe section
 */
export interface WireframeSection {
  id: string;
  name: string;
  sectionType: string;
  position?: { x: number; y: number };
  x?: number;
  y?: number;
  dimensions?: { width: number | string; height: number | string };
  width?: number | string;
  height?: number | string;
  components?: any[];
  layout?: any;
  style?: Record<string, any>;
  data?: Record<string, any>;
  gap?: number | string;
  copySuggestions?: CopySuggestions | CopySuggestions[];
  description?: string;
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
}
