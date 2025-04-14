
// Add more precise typing for generation results
export interface WireframeGenerationResult {
  wireframe: WireframeData | null;
  success: boolean;
  message: string;
  errors?: string[];
  intentData?: {
    primary: string;
    confidence: number;
  };
  blueprint?: {
    layout: string;
    sections: string[];
  };
}

export interface WireframeGenerationParams {
  description: string;
  projectId?: string;
  enhancedCreativity?: boolean;
  validationLevel?: 'basic' | 'standard' | 'advanced';
}
