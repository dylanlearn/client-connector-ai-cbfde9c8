
export interface IntakeFormData {
  siteType: 'ecommerce' | 'portfolio' | 'business' | 'blog' | 'personal' | 'other';
  businessName?: string;
  businessType?: string;
  mission?: string;
  vision?: string;
  targetAudience?: string;
  industryType?: string;
  brandPersonality?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  headingFont?: string;
  bodyFont?: string;
  description?: string;
  keyFeatures?: string[];
  designPreferences?: {
    visualStyle?: string;
    [key: string]: any;
  };
  [key: string]: any;
}
