
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
  colorScheme?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontStyle?: string;
  typographyScale?: string;
  existingBranding?: boolean;
  inspiration?: string;
  additionalNotes?: string;
  designNotes?: string;
  conversionPriority?: string;
  logoUpload?: boolean;
  
  // New wireframe preferences
  wireframeSelection?: string;
  wireframeFeedback?: string;
  layoutPreference?: string;
  conversionElements?: string[];
  interactionPreference?: string;
  
  // Timestamps for real-time syncing
  lastUpdated?: string;
  formId?: string;
  
  // Status
  status?: string;
}
