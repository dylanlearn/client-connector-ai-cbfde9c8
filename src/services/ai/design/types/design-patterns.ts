
/**
 * Interface defining the structure of a design pattern
 */
export interface DesignPattern {
  id: string;
  name: string;
  description: string;
  category: 'landing-page' | 'portfolio' | 'e-commerce' | 'application' | 'content';
  conversionOptimized: boolean;
  tags: string[];
  elements: {
    background: string;
    typography: string;
    layout: string;
    cta: string;
    spacing: string;
    branding: string;
  };
  bestFor: string[];
  conversionFeatures: string[];
  responsiveConsiderations: string[];
}

/**
 * Type for collections of design patterns
 */
export type DesignPatternCollection = DesignPattern[];
