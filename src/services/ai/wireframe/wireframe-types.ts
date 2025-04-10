
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

// Update the CopySuggestions interface to include all potential fields
export interface CopySuggestions {
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
  
  // Feature section
  feature1Title?: string;
  feature1Description?: string;
  feature2Title?: string;
  feature2Description?: string;
  feature3Title?: string;
  feature3Description?: string;
  feature4Title?: string;
  feature4Description?: string;
  feature5Title?: string;
  feature5Description?: string;
  
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
  
  // Footer section
  companyName?: string;
  companyDescription?: string;
  quickLinksTitle?: string;
  resourcesTitle?: string;
  contactTitle?: string;
  address?: string;
  cityStateZip?: string;
  email?: string;
  phone?: string;
  copyright?: string;
  
  // Contact section
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
  phoneTitle?: string;
  emailTitle?: string;
  hoursTitle?: string;
  emailAddress?: string;
  hours?: string;
  weekend?: string;
  
  // Pricing section
  basicPlanName?: string;
  basicPlanPrice?: string;
  basicPlanPeriod?: string;
  basicPlanDescription?: string;
  basicFeature1?: string;
  basicFeature2?: string;
  basicFeature3?: string;
  basicFeature4?: string;
  basicPlanCta?: string;
  
  proPlanName?: string;
  proPlanPrice?: string;
  proPlanPeriod?: string;
  proPlanDescription?: string;
  proFeature1?: string;
  proFeature2?: string;
  proFeature3?: string;
  proFeature4?: string;
  proFeature5?: string;
  proPlanCta?: string;
  
  enterprisePlanName?: string;
  enterprisePlanPrice?: string;
  enterprisePlanPeriod?: string;
  enterprisePlanDescription?: string;
  enterpriseFeature1?: string;
  enterpriseFeature2?: string;
  enterpriseFeature3?: string;
  enterpriseFeature4?: string;
  enterpriseFeature5?: string;
  enterprisePlanCta?: string;

  [key: string]: any; // Allow for additional dynamic fields
}

export interface WireframeResult {
  wireframe: WireframeData;
  generationTime?: number;
  model?: string;
  usage?: any;
}

export interface WireframeVersion {
  id: string;
  wireframe_id: string;
  version_number: number;
  branch_name: string;
  data: Record<string, any>;
  parent_version_id?: string;
  is_current: boolean;
  change_description?: string;
  created_at: string;
  created_by?: string;
}

export interface BranchInfo {
  name: string;
  current_version_id?: string;
  versions: string[];
}

export interface DesignMemoryData {
  projectId: string;
  blueprintId?: string;
  layoutPatterns?: any;
  stylePreferences?: any;
  componentPreferences?: any;
  designs?: any[];
  preferences?: Record<string, any>;
  insights?: Record<string, any>;
}

export interface DesignMemoryResponse {
  id?: string;
  projectId?: string;
  data: DesignMemoryData;
  memory?: DesignMemoryData;
  recommendations?: any[];
  success: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Helper function to convert AIWireframe to WireframeData
export const aiWireframeToWireframeData = (wireframe: AIWireframe): WireframeData => {
  return {
    id: wireframe.id,
    title: wireframe.title,
    description: wireframe.description || '',
    sections: wireframe.sections || [],
    // Map any other properties as needed
    ...wireframe
  };
};
