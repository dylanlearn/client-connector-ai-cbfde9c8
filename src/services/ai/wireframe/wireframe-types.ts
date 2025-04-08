
/**
 * Types for Wireframe AI Generator
 */

export interface WireframeSection {
  id: string;
  name: string;
  sectionType: string;
  componentVariant?: string;
  description?: string;
  data?: Record<string, any>;
  components?: any[];
  copySuggestions?: string[] | { heading?: string; subheading?: string; cta?: string; [key: string]: any };
  
  styleProperties?: {
    backgroundStyle?: string;
    spacing?: string;
    alignment?: string;
    [key: string]: any;
  };
  position?: {
    x: number;
    y: number;
    [key: string]: any;
  };
  dimensions?: {
    width: number;
    height: number;
    [key: string]: any;
  };
  layoutType?: string;
  layout?: {
    type: string;
    alignment: string;
    [key: string]: any;
  };
  animationSuggestions?: {
    type?: string;
    element?: string;
    timing?: string;
    effect?: string[];
    [key: string]: any;
  };
  mobileLayout?: {
    structure?: string;
    stackOrder?: string[];
    [key: string]: any;
  };
  designReasoning?: string;
  layoutScore?: number;
  optimizationSuggestions?: any[];
  patternMatch?: any;
  [key: string]: any;
}

export interface WireframeComponent {
  id: string;
  type: string;
  content?: string | any;
  name?: string;
  properties?: Record<string, any>;
  children?: WireframeComponent[];
  [key: string]: any;
}

export interface WireframeGeneratorPrompt {
  title?: string;
  description?: string;
  sections?: string[];
  style?: string;
  target?: string;
  industry?: string;
  brand?: string;
  colorScheme?: string;
  layoutPreference?: string;
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
  style?: string | Record<string, any>;
  visualReferences?: string[];
  layoutType?: string;
  id?: string;
  imageUrl?: string;
  [key: string]: any;
}

// Types for wireframe factory methods
export interface WireframeFactory {
  createSection(type: string, data?: any): WireframeSection;
  createComponent(type: string, properties?: any): WireframeComponent;
  createColorScheme(primary?: string, secondary?: string, accent?: string): Record<string, string>;
}

// Types for wireframe service
export interface WireframeGeneratorService {
  generateWireframe(prompt: WireframeGeneratorPrompt): Promise<WireframeResult>;
  generateSection(type: string, data?: any): Promise<WireframeSection>;
  enhanceWireframe(wireframe: WireframeResult, prompt?: string): Promise<WireframeResult>;
  generateVariations(section: WireframeSection, count?: number): Promise<WireframeSection[]>;
}

export interface WireframeMemoryService {
  saveWireframe(wireframe: WireframeResult, projectId?: string): Promise<string>;
  getWireframe(id: string): Promise<WireframeResult | null>;
  listWireframes(projectId?: string): Promise<Array<{id: string, title: string, preview?: string}>>;
  updateWireframe(id: string, wireframe: WireframeResult): Promise<boolean>;
  deleteWireframe(id: string): Promise<boolean>;
}

export interface WireframeConversionService {
  wireframeToHtml(wireframe: WireframeResult): Promise<string>;
  wireframeToReact(wireframe: WireframeResult): Promise<Record<string, string>>;
  wireframeToImage(wireframe: WireframeResult): Promise<string>;
  wireframeToFigma(wireframe: WireframeResult): Promise<string>;
}

// Additional types needed by other components in the system
export interface AIWireframe {
  id: string;
  title: string;
  description: string;
  wireframe: WireframeResult;
  createdAt: string;
  updatedAt: string;
  preview?: string;
  wireframe_data?: any;
  data?: any;
  sections?: any[];
  project_id?: string;
  projectId?: string; // Adding this field to resolve inconsistencies
  prompt?: string;
  generation_params?: any;
}

export interface WireframeData {
  id: string;
  title: string; // Making this required as per error message
  sections: WireframeSection[];
  style?: string | Record<string, any>;
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text?: string;
    [key: string]: any;
  };
  description?: string;
  designTokens?: any;
  mobileLayouts?: any;
  styleVariants?: any;
  designReasoning?: string;
  animations?: any;
  imageUrl?: string;
  metadata?: any;
  pages?: any[];
  typography?: {
    headings: string;
    body: string;
    fontPairings?: string[];
    [key: string]: any;
  };
  layoutType?: string; // Adding this field to resolve type errors
  lastUpdated?: string; // Adding this field to resolve type errors
  visualReferences?: string[];
}

export interface WireframeGenerationParams {
  description: string;
  style?: string;
  sections?: string[];
  projectId?: string;
  creativityLevel?: number;
  enhancedCreativity?: boolean;
  multiPageLayout?: boolean;
  pages?: number;
  complexity?: string;
  baseWireframe?: WireframeResult;
  industry?: string;
  colorTheme?: string;
  pageType?: string;
  componentTypes?: string[];
  moodboardSelections?: any[];
  prompt?: string;
  enableLayoutIntelligence?: boolean;
  stylePreferences?: string[]; // Adding this field to resolve type errors
  customParams?: any; // Adding this field to resolve type errors
  darkMode?: boolean; // Adding this field to resolve type errors
}

export interface WireframeGenerationResult {
  wireframe: WireframeResult;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  generations?: number;
  generationTime?: number; // Adding this field to resolve type errors
  timeTaken?: number;
  error?: string;
  imageUrl?: string;
  layoutAnalysis?: any;
  success?: boolean;
  model?: string;
  usage?: {
    total_tokens: number;
    completion_tokens: number;
    prompt_tokens: number;
  };
}

export interface CopySuggestions {
  heading?: string;
  subheading?: string;
  cta?: string;
  [key: string]: any;
}

export interface WireframeVersion {
  id: string;
  wireframeId: string;
  version: number;
  changes: string;
  data: WireframeData;
  createdAt: string;
  change_description?: string;
  version_number?: number;
  created_at?: string;
}

export interface BranchInfo {
  id: string;
  name: string;
  parentBranchId?: string;
  createdAt: string;
  latestVersion?: string;
  latest_version_id?: string;
  versions?: WireframeVersion[];
}

export interface VersionComparisonResult {
  added: string[];
  removed: string[];
  modified: string[];
  unchanged: string[];
  additions?: string[];
  deletions?: string[]; // Adding this field to resolve type errors
}

// Helper function to convert AIWireframe to WireframeData
export function aiWireframeToWireframeData(wireframe: AIWireframe): WireframeData {
  return {
    id: wireframe.id,
    title: wireframe.title || '',
    description: wireframe.description || '',
    sections: (wireframe.sections || wireframe.wireframe?.sections || []),
    colorScheme: wireframe.wireframe?.colorScheme || {
      primary: '',
      secondary: '',
      accent: '',
      background: ''
    },
    style: wireframe.wireframe?.style || {},
    // Include additional properties that might be needed
    imageUrl: wireframe.preview || '',
    designTokens: wireframe.wireframe?.designTokens,
    designReasoning: wireframe.wireframe?.designReasoning
  };
}
