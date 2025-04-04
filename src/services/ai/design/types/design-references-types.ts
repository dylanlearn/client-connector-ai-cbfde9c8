
/**
 * Types for website design references
 */

export interface DesignReference {
  name: string;
  description?: string;
  url?: string;
  category: DesignCategory;
  tags: string[];
  visualElements?: {
    layout?: string;
    colorScheme?: string;
    typography?: string;
    spacing?: string;
    imagery?: string;
  };
  userExperience?: {
    userFlow?: string;
    interactions?: string;
    accessibility?: string;
  };
}

export type DesignCategory = 
  | 'saas' 
  | 'startup-landing' 
  | 'productized-service' 
  | 'creative-agency' 
  | 'personal-portfolio'
  | 'developer-tools' 
  | 'media-content' 
  | 'conversion-funnel' 
  | 'edtech-learning' 
  | 'wellness-lifestyle'
  | 'ai-product' 
  | 'web3-crypto';

export interface DesignReferenceQuery {
  category?: DesignCategory;
  tags?: string[];
  search?: string;
  limit?: number;
}
