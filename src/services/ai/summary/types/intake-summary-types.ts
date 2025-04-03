
import { AIFeatureType } from "../../ai-model-selector";

/**
 * Interface for prompt options when generating an intake form summary
 */
export interface AIPromptOptions {
  model: string;
  temperature: number;
  systemPrompt: string;
  promptContent: string;
}

/**
 * Structure of the result returned by the intake form summary
 */
export interface IntakeSummaryResult {
  summary: string;
  tone: string[];
  direction: string;
  priorities: string[];
  draftCopy: {
    header: string;
    subtext: string;
    cta: string;
  };
}
