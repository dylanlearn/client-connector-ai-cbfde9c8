
// Types used across the prompt testing modules
export type PromptTestStatus = 'active' | 'paused' | 'completed';

export interface PromptVariant {
  id: string;
  name: string;
  promptText: string;
  systemPrompt?: string;
  isControl: boolean;
  weight: number;
}

export interface PromptTest {
  id: string;
  name: string;
  description?: string;
  contentType: string;
  status: PromptTestStatus;
  variants: PromptVariant[];
  createdAt: string;
  updatedAt: string;
  minSampleSize?: number;
  confidenceThreshold?: number;
}

export interface PromptTestResult {
  id?: string;
  testId: string;
  variantId: string;
  impressions: number;
  successes: number;
  failures?: number;
  averageLatencyMs: number;
  averageTokenUsage: number;
}
