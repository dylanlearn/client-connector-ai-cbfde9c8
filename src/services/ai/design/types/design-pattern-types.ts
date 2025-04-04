
/**
 * Interface for design patterns
 */
export interface DesignPattern {
  id: string;
  name: string;
  description: string;
  category: string;
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
  conversionFeatures?: string[];
  responsiveConsiderations: string[];
}
