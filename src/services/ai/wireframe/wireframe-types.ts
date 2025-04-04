
/**
 * Type definitions for the Wireframe service
 */
export interface WireframeData {
  id?: string;
  title?: string;
  description?: string;
  sections: WireframeSection[];
  style?: WireframeStyle;
  createdAt?: string;
  updatedAt?: string;
  
  // Additional properties needed by components
  designTokens?: {
    colors?: Record<string, string>;
    typography?: {
      headings?: string;
      body?: string;
      fontPairings?: string[];
    };
  };
  mobileConsiderations?: string;
  accessibilityNotes?: string;
  qualityFlags?: {
    unclearInputs?: string[];
  };
  imageUrl?: string;
  designReasoning?: string;
  styleVariants?: any;
  mobileLayouts?: any;
  animations?: any;
}

export interface WireframeSection {
  id?: string;
  name: string;
  sectionType: string;
  layoutType: string;
  layout: any; // Layout specifics will depend on the section type
  components: WireframeComponent[];
  copySuggestions: CopySuggestions;
  designReasoning?: string;
  mobileLayout?: any;
  animationSuggestions?: any;
  dynamicElements?: any;
  styleVariants?: any;
  positionOrder?: number;
  description?: string; // Added description property
}

export interface WireframeComponent {
  type: string;
  content: string;
  // Additional component properties as needed
}

export interface CopySuggestions {
  heading?: string;
  subheading?: string;
  cta?: string;
  // Other copy elements as needed
}

export interface WireframeStyle {
  colorScheme?: ColorScheme;
  typography?: Typography;
  spacing?: SpacingSystem;
  // Other style properties as needed
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent?: string;
  background: string;
  text: string;
  // Other color properties as needed
}

export interface Typography {
  headingFont: string;
  bodyFont: string;
  scale?: any;
  // Other typography properties as needed
}

export interface SpacingSystem {
  unit?: number;
  scale?: number[];
  // Other spacing properties as needed
}

export interface WireframeVersion {
  id: string;
  wireframe_id: string;
  version_number: number;
  data: WireframeData;
  change_description?: string;
  created_at: string;
  created_by?: string;
  is_current: boolean;
  parent_version_id?: string;
  branch_name: string;
}

export interface WireframeRevisionHistory {
  versions: WireframeVersion[];
  current: WireframeVersion | null;
  branches: string[];
}

export interface BranchInfo {
  name: string;
  created_at: string;
  version_count: number;
  latest_version_id: string;
}

export interface VersionComparisonResult {
  changes: Array<{
    type: 'added' | 'removed' | 'modified';
    path: string;
    values: [any, any];
  }>;
  summary: string;
}

// Additional types needed by components
export interface AIWireframe {
  id: string;
  project_id: string;
  prompt: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  design_tokens?: any;
  mobile_layouts?: any;
  style_variants?: any;
  design_reasoning?: string;
  animations?: any;
  generation_params?: any;
  image_url?: string;
  data?: WireframeData;
  sections?: WireframeSection[];
}

export interface WireframeGenerationParams {
  projectId: string;
  prompt: string;
  style?: string;
  complexity?: 'simple' | 'medium' | 'complex';
  industry?: string;
  pages?: string[];
  moodboardSelections?: {
    layoutPreferences?: string[];
    fonts?: string[];
    colors?: string[];
    tone?: string[];
  };
  typography?: string;
  additionalInstructions?: string;
  baseWireframe?: any; // Allow passing a base wireframe template
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
}
