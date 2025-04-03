
import { ReactNode } from "react";

export interface FormValues {
  prompt: string;
  industry: string;
  industryCustom?: string;
  style: string;
  styleCustom?: string;
}

export interface IndustryOption {
  value: string;
  label: string;
}

export interface StyleOption {
  value: string;
  label: string;
}

export interface SuggestionsResponse {
  suggestions: string;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
