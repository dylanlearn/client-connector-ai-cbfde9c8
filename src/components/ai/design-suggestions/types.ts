export interface FormValues {
  prompt: string;
  industry: string;
  industryCustom?: string;
  style: string;
  styleCustom?: string;
}

export interface SuggestionsResponse {
  suggestions: string;
  model?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ParsedColor {
  name: string;
  hex: string;
  description?: string;
}

export interface ParsedTypography {
  name: string;
  type: 'heading' | 'body' | 'accent';
  description?: string;
}

export interface ParsedSuggestion {
  colors: ParsedColor[];
  typography: ParsedTypography[];
  layouts: string[];
  components: string[];
  originalText: string;
}

export interface DesignSuggestion {
  id: string;
  user_id: string;
  prompt: string;
  result: string;
  colors?: ParsedColor[];
  typography?: ParsedTypography[];
  layouts?: string[];
  components?: string[];
  created_at: string;
  updated_at: string;
}

export interface ComponentLibraryItem {
  id: string;
  name: string;
  description?: string;
  component_type: string;
  component_code: string;
  attributes?: Record<string, any>;
  tags?: string[];
  created_by?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface IndustryOption {
  value: string;
  label: string;
}

export interface StyleOption {
  value: string;
  label: string;
}
