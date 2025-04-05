
export interface WireframeGenerationParams {
  description?: string;
  style?: string;
  componentTypes?: string[];
  colorTheme?: string;
  complexity?: "simple" | "standard" | "advanced";
  projectId?: string;
  prompt?: string;
  industry?: string;
  baseWireframe?: any;
  enhancedCreativity?: boolean;
  creativityLevel?: number;
  cacheKey?: string;
  detailedComponents?: boolean;
  animationStyle?: "subtle" | "moderate" | "bold";
  typography?: string;
  additionalInstructions?: string;
  pages?: number;
  moodboardSelections?: {
    layoutPreferences?: string[];
    fonts?: string[];
    colors?: string[];
    tone?: string[];
  };
}

export interface WireframeGenerationResult {
  wireframe: WireframeData;
  model?: string;
  usage?: {
    total_tokens: number;
    completion_tokens: number;
    prompt_tokens: number;
  };
  generationTime: number;
  success: boolean;
  creativityLevel?: number;
}

export interface WireframeData {
  title?: string;
  description?: string;
  sections: WireframeSection[];
  style?: {
    colorScheme?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      background?: string;
      text?: string;
    };
    typography?: {
      headingFont?: string;
      bodyFont?: string;
    };
    spacing?: {
      unit?: number;
      scale?: number[];
    };
    animations?: {
      type?: string;
      speed?: string;
      elements?: string[];
    };
  };
  designTokens?: {
    colors?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      background?: string;
      text?: string;
      [key: string]: string | undefined;
    };
    typography?: {
      headings?: string;
      body?: string;
      [key: string]: string | undefined;
    };
    spacing?: Record<string, any>;
    animations?: Record<string, any>;
  };
  mobileConsiderations?: string;
  accessibilityNotes?: string;
  creativityScore?: number;
  innovationPoints?: string[];
  [key: string]: any;
}

export interface WireframeSection {
  name: string;
  sectionType?: string;
  layoutType?: string;
  layout?: {
    type?: string;
    alignment?: "left" | "center" | "right";
    gridColumns?: number;
    spacing?: number;
    [key: string]: any;
  };
  components: WireframeComponent[];
  copySuggestions?: CopySuggestions;
  description?: string;
  animations?: {
    entryAnimation?: string;
    interactionEffects?: string[];
  };
  styleVariants?: {
    name: string;
    description: string;
    colors?: Record<string, string>;
  }[];
  animationSuggestions?: {
    type?: string;
    element?: string;
    timing?: string;
    effect?: string[];
  };
  [key: string]: any;
}

export interface WireframeComponent {
  type: string;
  content?: string;
  props?: Record<string, any>;
  children?: WireframeComponent[];
  style?: Record<string, any>;
  interactivity?: {
    events?: string[];
    effects?: string[];
  };
  accessibility?: {
    role?: string;
    ariaLabel?: string;
  };
  [key: string]: any;
}

export interface CopySuggestions {
  heading?: string;
  subheading?: string;
  body?: string;
  cta?: string;
  [key: string]: string | undefined;
}

export interface AIWireframe {
  id: string;
  project_id: string;
  description?: string;
  sections?: any[];
  data?: WireframeData;
  generation_params?: any;
  feedback?: string;
  rating?: number;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  model_used?: string;
  status?: 'draft' | 'published' | 'archived';
  tags?: string[];
  [key: string]: any;
}

// Add missing type definitions for version control
export interface WireframeVersion {
  id: string;
  wireframe_id: string;
  version_number: number;
  branch_name: string;
  data: any;
  parent_version_id?: string;
  is_current: boolean;
  change_description?: string;
  created_at: string;
  created_by?: string;
  sourceData?: any;
}

export interface BranchInfo {
  name: string;
  version_count: number;
  created_at: string;
  latest_version_id: string;
}

export interface VersionComparisonResult {
  changes: Array<{
    path: string;
    old_value: any;
    new_value: any;
    type: 'added' | 'removed' | 'modified';
  }>;
  summary: string;
}
