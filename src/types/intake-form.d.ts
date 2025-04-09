
export interface IntakeFormData {
  id?: string;
  userId?: string;
  siteType?: string;
  businessName?: string;
  businessDescription?: string;
  projectName?: string;
  projectDescription?: string;
  primaryColor?: string;
  secondaryColor?: string;
  specificQuestions?: Record<string, any>;
  designPreferences?: {
    layoutStyle?: string;
    colorScheme?: string;
    typography?: string;
    visualStyle?: string;
    accentColor?: string;
    backgroundColor?: string;
    headingFont?: string;
    bodyFont?: string;
    fontPairings?: string[];
  };
  status?: 'draft' | 'submitted' | 'processing' | 'completed';
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  lastUpdated?: string;
  [key: string]: any;
}
