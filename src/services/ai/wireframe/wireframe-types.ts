
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
  intentData?: any;
  blueprint?: any;
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

// Use export type for re-exporting a type when isolatedModules is enabled
export type { WireframeCanvasConfig };

// Define the AIWireframe interface
export interface AIWireframe {
  id: string;
  title: string;
  description?: string;
  sections: any[];
  [key: string]: any;
}

// Add missing types that are being imported elsewhere
export interface WireframeData {
  id: string; 
  title: string;
  description?: string;
  sections: WireframeSection[];
  layoutType?: string;
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text?: string;
  };
  typography?: {
    headings: string;
    body: string;
    fontPairings?: string[];
  };
  designTokens?: Record<string, any>;
  mobileConsiderations?: string;
  accessibilityNotes?: string;
  style?: string | object;
  pages?: any[];
  styleToken?: string;
  darkMode?: boolean;
  mobileLayouts?: any;
  styleVariants?: any;
  designReasoning?: any;
  animations?: any;
  imageUrl?: string;
  [key: string]: any;
}

export interface WireframeSection {
  id: string;
  name: string;
  sectionType: string;
  description?: string;
  components?: WireframeComponent[];
  layout?: {
    type: string;
    direction?: string;
    alignment?: string;
    justifyContent?: string;
    columns?: number;
    gap?: number;
    wrap?: boolean;
    [key: string]: any;
  } | string;
  layoutType?: string;
  positionOrder?: number;
  componentVariant?: string;
  copySuggestions?: CopySuggestions | CopySuggestions[];
  dimensions?: {
    width: number | string;
    height: number | string;
  };
  position?: {
    x: number;
    y: number;
  };
  // Additional styling properties
  backgroundColor?: string;
  textAlign?: string;
  padding?: string;
  gap?: string;
  style?: {
    [key: string]: any;
    backgroundColor?: string;
    textAlign?: string;
    padding?: string;
    gap?: string;
  };
  data?: Record<string, any>;
  animationSuggestions?: {
    type?: string;
    element?: string;
    timing?: string;
    effect?: string[];
  } | any[]; // This allows both object and array formats
  mobileLayout?: {
    structure?: string;
    stackOrder?: string[];
  };
  designReasoning?: string;
  [key: string]: any;
}

export interface WireframeComponent {
  id: string;
  type: string;
  content?: string;
  style?: Record<string, any>;
  position?: { x: number; y: number };
  dimensions?: { width: number | string; height: number | string };
  [key: string]: any;
}

// Updated CopySuggestions interface to include all potential fields referenced in renderers
export interface CopySuggestions {
  // Common fields
  heading?: string;
  subheading?: string;
  cta?: string;
  body?: string;
  primaryCta?: string;
  secondaryCta?: string;
  
  // Blog section
  post1Title?: string;
  post1Excerpt?: string;
  post1Author?: string;
  post1Date?: string;
  post1Category?: string;
  post2Title?: string;
  post2Excerpt?: string;
  post2Author?: string;
  post2Date?: string;
  post2Category?: string;
  post3Title?: string;
  post3Excerpt?: string;
  post3Author?: string;
  post3Date?: string;
  post3Category?: string;
  viewAllButton?: string;
  
  // Testimonial section
  testimonial1?: string;
  author1?: string;
  role1?: string;
  testimonial2?: string;
  author2?: string;
  role2?: string;
  testimonial3?: string;
  author3?: string;
  role3?: string;
  
  // FAQ section
  question1?: string;
  answer1?: string;
  question2?: string;
  answer2?: string;
  question3?: string;
  answer3?: string;
  question4?: string;
  answer4?: string;
  question5?: string;
  answer5?: string;
  supportText?: string;
  supportCta?: string;
  
  // Pricing section
  basicPlanName?: string;
  basicPlanPrice?: string;
  basicPlanPeriod?: string;
  basicPlanDescription?: string;
  basicPlanCta?: string;
  basicFeature1?: string;
  basicFeature2?: string;
  basicFeature3?: string;
  basicFeature4?: string;
  
  proPlanName?: string;
  proPlanPrice?: string;
  proPlanPeriod?: string;
  proPlanDescription?: string;
  proPlanCta?: string;
  proFeature1?: string;
  proFeature2?: string;
  proFeature3?: string;
  proFeature4?: string;
  proFeature5?: string;
  
  enterprisePlanName?: string;
  enterprisePlanPrice?: string;
  enterprisePlanPeriod?: string;
  enterprisePlanDescription?: string;
  enterprisePlanCta?: string;
  enterpriseFeature1?: string;
  enterpriseFeature2?: string;
  enterpriseFeature3?: string;
  enterpriseFeature4?: string;
  enterpriseFeature5?: string;
  
  // Contact section fields
  nameLabel?: string;
  namePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  subjectLabel?: string;
  subjectPlaceholder?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  submitButton?: string;
  contactInfoTitle?: string;
  addressTitle?: string;
  address?: string;
  phoneTitle?: string;
  phone?: string;
  emailTitle?: string;
  emailAddress?: string;
  hoursTitle?: string;
  hours?: string;
  weekend?: string;
  
  // Footer section fields
  companyName?: string;
  companyDescription?: string;
  quickLinksTitle?: string;
  resourcesTitle?: string;
  contactTitle?: string;
  cityStateZip?: string;
  email?: string;
  copyright?: string;
  
  // Add other specific fields used in different renderers
  [key: string]: string | undefined;
}

// Fix the CopySuggestions array type for consistency
export type CopySuggestionsArray = CopySuggestions[];
