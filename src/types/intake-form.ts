
export interface IntakeFormData {
  // Step 1: Site Type
  siteType?: string;
  
  // Step 2: General Questions
  projectName?: string;
  projectDescription?: string;
  targetAudience?: string;
  launchDate?: string;
  
  // Step 3: Specific Questions (base fields for all site types)
  mainFeatures?: string;
  competitors?: string;
  
  // SaaS specific
  userAccountsRequired?: boolean;
  pricingTiers?: string;
  freeTrialOffered?: boolean;
  
  // E-commerce specific
  estimatedProducts?: string;
  paymentProcessors?: string;
  shippingIntegration?: boolean;
  customQuestions?: string[];
  
  // Business specific
  serviceOfferings?: string;
  contactFormRequired?: boolean;
  hasPhysicalLocation?: boolean;
  
  // Portfolio specific
  projectCategories?: string;
  contactInformation?: string;
  resumeUploadRequired?: boolean;
  
  // Step 4: Design Preferences
  designStyle?: string;
  colorPreferences?: string;
  logoUpload?: boolean;
  existingBranding?: boolean;
  inspiration?: string;
  additionalNotes?: string;
}
