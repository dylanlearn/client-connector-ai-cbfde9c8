
/**
 * Interface representing the result of an intake form summary
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

/**
 * Interface for AI prompt configuration options
 */
export interface AIPromptOptions {
  model: string;
  temperature: number;
  systemPrompt: string;
  promptContent: string;
}
