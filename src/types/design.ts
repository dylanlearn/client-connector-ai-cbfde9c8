
/**
 * Design-related types shared across the application
 */

// Design option used in visual pickers
export interface DesignOption {
  id: string;
  title: string;
  description: string;
  category?: string;
  icon?: React.ComponentType;
  preview?: string;
  imageUrl: string; // Changed from optional to required to match preview/types.ts
}

// Animation preferences used throughout the app
export interface AnimationPreferences {
  speedFactor: number;
  intensityFactor: number;
  reducedMotion: boolean;
}

// Design token types
export interface DesignToken {
  name: string;
  value: any;
  category: string;
  description?: string;
}

// Common design composition elements
export interface DesignComposition {
  layout: string;
  colorScheme: string;
  typography: string;
  spacing: string;
  imagery?: string;
}

// Website analysis structure
export interface WebsiteAnalysis {
  title: string;
  description: string;
  category: string;
  visualElements: DesignComposition;
  userExperience: {
    userFlow: string;
    interactions: string;
    accessibility: string;
  };
}
