// Define all wireframe-related types and interfaces in one place for consistency

export interface WireframeComponent {
  id?: string;
  type: string;
  content?: any;
  style?: any;
  position?: string;
  [key: string]: any;
}

export interface WireframeSection {
  id?: string;
  name: string;
  sectionType: string;
  components?: WireframeComponent[];
  layout?: string | {
    type: string;
    direction?: string;
    alignment?: string;
    [key: string]: any;
  };
  layoutType?: string;
  description?: string;
  positionOrder?: number;
  componentVariant?: string;
  designReasoning?: string;
  copySuggestions?: CopySuggestions | string[] | any;
  mobileLayout?: {
    structure?: string;
    stackOrder?: string[];
    [key: string]: any;
  };
  animationSuggestions?: {
    type?: string;
    element?: string;
    timing?: string;
    effect?: string[];
    [key: string]: any;
  };
  [key: string]: any;
}

export interface CopySuggestions {
  heading?: string;
  subheading?: string;
  cta?: string;
  [key: string]: any;
}

export interface WireframeResult {
  title?: string;
  description?: string;
  sections: WireframeSection[];
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text?: string;
    [key: string]: any;
  };
  typography?: {
    headings: string;
    body: string;
    fontPairings?: string[];
    [key: string]: any;
  };
  style?: string;
  visualReferences?: string[];
  layoutType?: string;
  id?: string;
  imageUrl?: string;
  [key: string]: any;
}

export interface WireframeData {
  id: string;
  title: string;
  description?: string;
  sections: WireframeSection[];
  pages?: {
    id: string;
    name: string;
    sections: WireframeSection[];
    [key: string]: any;
  }[];
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text?: string;
    [key: string]: any;
  };
  typography?: {
    headings: string;
    body: string;
    fontPairings?: string[];
    [key: string]: any;
  };
  style?: string;
  imageUrl?: string;
  lastUpdated?: string;
  layoutType?: string;
  [key: string]: any;
}

export interface WireframeGenerationParams {
  description: string;
  projectId?: string;
  siteType?: string;
  pageType?: string;
  complexity?: 'simple' | 'moderate' | 'complex';
  stylePreferences?: string[];
  style?: string;
  enhancedCreativity?: boolean;
  creativityLevel?: number;
  enableLayoutIntelligence?: boolean;
  baseWireframe?: WireframeData;
  customParams?: {
    [key: string]: any;
  };
  sections?: WireframeSection[];
  industry?: string;
  [key: string]: any;
}

export interface WireframeGenerationResult {
  wireframe: WireframeResult;
  layoutAnalysis?: any;
  reasoningChain?: string[];
  [key: string]: any;
}

export interface AIWireframe {
  id: string;
  project_id?: string;
  title?: string;
  description: string;
  wireframe?: WireframeResult;
  wireframe_data?: WireframeData;
  data?: WireframeData;
  createdAt?: string;
  updatedAt?: string;
  image_url?: string;
  sections?: WireframeSection[];
  tags?: string[];
  status?: string;
  [key: string]: any;
}

export interface WireframeVersion {
  id: string;
  wireframeId: string;
  versionNumber: number;
  data: WireframeData;
  createdAt: string;
  message?: string;
  author?: string;
  [key: string]: any;
}

export interface BranchInfo {
  id: string;
  name: string;
  parentBranchId?: string;
  baseVersionId: string;
  currentVersionId: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface WireframeGeneratorPrompt {
  system?: string;
  user?: string;
  description?: string;
  industry?: string;
  style?: string;
  complexity?: string;
  [key: string]: any;
}

// Helper function to convert an AIWireframe to WireframeData
export const aiWireframeToWireframeData = (aiWireframe: AIWireframe): WireframeData => {
  // If data is already present, return it
  if (aiWireframe.data) {
    return aiWireframe.data;
  }
  
  // If wireframe_data is present, return it
  if (aiWireframe.wireframe_data) {
    return aiWireframe.wireframe_data;
  }
  
  // Otherwise construct from the wireframe property
  if (aiWireframe.wireframe) {
    return {
      id: aiWireframe.id,
      title: aiWireframe.wireframe.title || aiWireframe.title || 'Untitled Wireframe',
      description: aiWireframe.wireframe.description || aiWireframe.description || '',
      sections: aiWireframe.wireframe.sections || aiWireframe.sections || [],
      colorScheme: aiWireframe.wireframe.colorScheme,
      typography: aiWireframe.wireframe.typography,
      style: aiWireframe.wireframe.style,
      imageUrl: aiWireframe.wireframe.imageUrl || aiWireframe.image_url,
      layoutType: aiWireframe.wireframe.layoutType
    };
  }
  
  // Last resort fallback
  return {
    id: aiWireframe.id,
    title: aiWireframe.title || 'Untitled Wireframe',
    description: aiWireframe.description || '',
    sections: aiWireframe.sections || [],
    imageUrl: aiWireframe.image_url
  };
};
