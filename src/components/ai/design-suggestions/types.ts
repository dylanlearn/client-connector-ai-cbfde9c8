
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
