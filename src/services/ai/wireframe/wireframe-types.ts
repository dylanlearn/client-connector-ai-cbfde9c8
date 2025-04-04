
// Types for wireframe service
export interface WireframeSection {
  name: string;
  sectionType: string;
  description?: string;
  layoutType: string;
  components?: any[];
  mobileLayout?: any;
  styleVariants?: any[];
  animationSuggestions?: {
    type?: string;
    element?: string;
    timing?: string;
  };
  copySuggestions?: {
    heading?: string;
    subheading?: string;
    cta?: string;
  };
  designReasoning?: string;
}

export interface WireframeData {
  title: string;
  description?: string;
  sections: WireframeSection[];
  designTokens?: {
    colors: { [key: string]: string };
    fonts: { [key: string]: string };
    spacing: { [key: string]: string | number };
    borderRadius: { [key: string]: string | number };
    shadows: { [key: string]: string };
    typography?: {
      headings?: string;
      body?: string;
      fontPairings?: string[];
    };
  };
  mobileLayouts?: {
    [key: string]: any;
  };
  styleVariants?: {
    name: string;
    description: string;
    preview?: string;
    styleData: any;
  }[];
  designReasoning?: string;
  animations?: {
    type: string;
    element: string;
    duration?: number;
    delay?: number;
    options?: any;
  }[];
  imageUrl?: string;
  accessibilityNotes?: string;
  qualityFlags?: {
    unclearInputs?: string[];
    recommendedClarifications?: string[];
  };
  mobileConsiderations?: string;
}

export interface WireframeGenerationParams {
  prompt: string;
  industry?: string;
  style?: string;
  complexity?: 'simple' | 'medium' | 'complex';
  components?: string[];
  pages?: string[];
  features?: string[];
  colorScheme?: string;
  typography?: string;
  additionalInstructions?: string;
  responsive?: boolean;
  projectId?: string;
  model?: string;
  moodboardSelections?: {
    layoutPreferences?: string[];
    fonts?: string[];
    colors?: string[];
    tone?: string[];
  };
  intakeResponses?: {
    businessGoals?: string;
    targetAudience?: string;
    siteFeatures?: string[];
  };
}

export interface WireframeGenerationResult {
  wireframe: WireframeData;
  generationTime: number;
  success: boolean;
  model?: string;
  usage?: {
    total_tokens: number;
    completion_tokens?: number;
    prompt_tokens?: number;
  };
}

// Changed to match the expected type structure for Supabase interactions
export interface AIWireframe {
  id: string;
  project_id: string;
  prompt: string;
  description?: string;
  created_at: string;
  updated_at: string;
  design_tokens?: any;  // Use any to accommodate Json from Supabase
  mobile_layouts?: any;
  style_variants?: any;
  design_reasoning?: string;
  animations?: any;
  rating?: number;
  feedback?: string;
  status?: string;
  generation_params?: any; // Using any to allow Json compatibility
  image_url?: string;
  quality_flags?: any;
  data?: WireframeData; // Add data property to store the wireframe data
  sections?: any[]; // Add sections property for backward compatibility
}
