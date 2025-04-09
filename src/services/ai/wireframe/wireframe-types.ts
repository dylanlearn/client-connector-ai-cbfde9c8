
export interface WireframeGenerationParams {
  description?: string;
  prompt?: string;
  projectId?: string;
  baseWireframe?: any;
  style?: string;
  colorTheme?: string;
  pageType?: string;
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  industry?: string;
  creativityLevel?: number;
  enhancedCreativity?: boolean;
  intakeFormData?: any;
  variationOf?: string;
  variationType?: string;
  stylePreferences?: any;
  enableLayoutIntelligence?: boolean;
  customParams?: Record<string, any>;
}

export interface WireframeGenerationResult {
  wireframe: any;
  generationTime?: number;
  model?: string;
  usage?: {
    total_tokens?: number;
    completion_tokens?: number;
    prompt_tokens?: number;
  };
  success: boolean;
  error?: string;
  imageUrl?: string;
}

export interface EnhancedWireframeGenerationResult extends WireframeGenerationResult {
  intentData?: any;
  blueprint?: any;
  layoutAnalysis?: any;
  variations?: any[];
}

export interface AIWireframe {
  id: string;
  title: string;
  description?: string;
  sections: any[];
  [key: string]: any;
}

export interface FeedbackInterpretation {
  changes: Record<string, any>;
  summary: string;
  impact: string;
}

export interface FeedbackModificationResult {
  wireframe: any;
  modified: boolean;
  changeDescription?: string;
  modifiedSections?: string[];
  addedSections?: string[];
  removedSections?: string[];
}

export interface WireframeData {
  id: string;
  title: string;
  description?: string;
  sections: any[];
  [key: string]: any;
}
