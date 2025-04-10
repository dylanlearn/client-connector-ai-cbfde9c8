
// Add the missing function
export const aiWireframeToWireframeData = (aiWireframe: any): any => {
  return {
    id: aiWireframe.id || '',
    title: aiWireframe.title || 'Untitled Wireframe',
    description: aiWireframe.description || '',
    sections: aiWireframe.sections || [],
    colorScheme: aiWireframe.colorScheme || {},
    typography: aiWireframe.typography || {},
    style: aiWireframe.style || '',
    designTokens: aiWireframe.designTokens || {},
  };
};

// Export the necessary types
export interface WireframeGenerationParams {
  projectId?: string;
  description: string;
  stylePreferences?: string[];
  style?: string;
  layoutPreferences?: string[];
  baseWireframe?: any;
  componentPreferences?: string[];
  colorScheme?: Record<string, string>;
  typography?: Record<string, any>;
  creativityLevel?: number;
  enhancedCreativity?: boolean;
  saveMemory?: boolean;
  [key: string]: any;
}

export interface WireframeGenerationResult {
  wireframe: WireframeData;
  success: boolean;
  error?: string;
  imageUrl?: string;
  intentData?: any;
  blueprint?: any;
}

export interface EnhancedWireframeGenerationResult extends WireframeGenerationResult {
  intentData: any;
  blueprint: any;
  designTokens: Record<string, any>;
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
  style?: string;
  styleToken?: string;
  designTokens?: Record<string, any>;
  layoutType?: string;
  lastUpdated?: string;
  imageUrl?: string;
}

export interface WireframeSection {
  id: string;
  name: string;
  sectionType: string;
  description?: string;
  layoutType?: string;
  dimensions?: {
    width: string | number;
    height: string | number;
  };
  components?: any[];
  content?: any;
  copySuggestions?: CopySuggestions | CopySuggestions[];
  animationSuggestions?: any[];
  componentVariant?: string;
  style?: any;
  order?: number;
  key?: string;
  designReasoning?: string;
}

export interface CopySuggestions {
  [key: string]: string;
}
