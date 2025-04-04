
// Types for wireframe service
export interface WireframeSection {
  name: string;
  sectionType: string;
  description?: string;
  layoutType: string;
  components?: any[];
  mobileLayout?: any;
  styleVariants?: any[];
  animationSuggestions?: any[];
  copySuggestions?: any[];
  designReasoning?: string;
}

export interface WireframeData {
  title: string;
  description?: string;
  sections?: WireframeSection[];
  designTokens?: {
    colors: { [key: string]: string };
    fonts: { [key: string]: string };
    spacing: { [key: string]: string | number };
    borderRadius: { [key: string]: string | number };
    shadows: { [key: string]: string };
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

export interface AIWireframe {
  id: string;
  project_id: string;
  prompt: string;
  description?: string;
  created_at: string;
  updated_at: string;
  design_tokens?: {
    colors: { [key: string]: string };
    fonts: { [key: string]: string };
    spacing: { [key: string]: string | number };
    borderRadius: { [key: string]: string | number };
    shadows: { [key: string]: string };
  };
  mobile_layouts?: {
    [key: string]: any;
  };
  style_variants?: {
    name: string;
    description: string;
    preview?: string;
    styleData: any;
  }[];
  design_reasoning?: string;
  animations?: {
    type: string;
    element: string;
    duration?: number;
    delay?: number;
    options?: any;
  }[];
  rating?: number;
  feedback?: string;
  status?: string;
  generation_params?: {
    prompt: string;
    industry?: string;
    style?: string;
    complexity?: string;
    components?: string[];
    pages?: string[];
    features?: string[];
    colorScheme?: string;
    typography?: string;
    additionalInstructions?: string;
    responsive?: boolean;
    model?: string;
    result_data?: {
      sections?: WireframeSection[];
    };
  };
  image_url?: string;
  quality_flags?: string[];
}
