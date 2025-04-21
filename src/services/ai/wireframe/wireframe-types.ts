
/**
 * Basic types for wireframe data structures
 */

export interface WireframeSection {
  id: string;
  name?: string;
  sectionType: string;
  components?: any[];
  layout?: any;
  [key: string]: any;
}

export interface WireframeData {
  id: string;
  title: string;
  description?: string;
  sections: WireframeSection[];
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
  };
  [key: string]: any;
}

export interface WireframeGenerationParams {
  projectId?: string;
  description?: string;
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography?: {
    headings: string;
    body: string;
  };
  [key: string]: any;
}

export interface WireframeGenerationResult {
  wireframe: WireframeData | null;
  success: boolean;
  message?: string;
}

export interface EnhancedWireframeGenerationResult extends WireframeGenerationResult {
  intentData?: any;
  blueprint?: any;
}

export interface WireframeComponent {
  id: string;
  type: string;
  props?: Record<string, any>;
  [key: string]: any;
}
