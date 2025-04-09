
import { WireframeCanvasConfig } from '@/components/wireframe/utils/types';

export interface WireframeGenerationParams {
  description: string;
  projectId?: string;
  style?: string | object;
  pageType?: string;
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  baseWireframe?: any;
  creativityLevel?: number;
  enhancedCreativity?: boolean;
  stylePreferences?: any;
  customParams?: Record<string, any>;
  enableLayoutIntelligence?: boolean;
  industry?: string;
  intakeFormData?: any;
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
  error?: string;
  success: boolean;
  imageUrl?: string;
}

export interface EnhancedWireframeGenerationResult extends WireframeGenerationResult {
  intentData?: any;
  blueprint?: any;
  layoutAnalysis?: any;
  variations?: any[];
}

export interface FeedbackModificationResult {
  wireframe: any;
  modified: boolean;
  changeDescription: string;
  modifiedSections?: string[];
  addedSections?: string[];
  removedSections?: string[];
}

// Re-export the WireframeCanvasConfig for consistency
export { WireframeCanvasConfig };

// Define the AIWireframe interface
export interface AIWireframe {
  id: string;
  title: string;
  description?: string;
  sections: any[];
  [key: string]: any;
}
