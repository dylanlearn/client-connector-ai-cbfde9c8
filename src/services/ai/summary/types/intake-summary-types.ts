
import { IntakeFormData } from "@/types/intake-form";

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

export interface AIPromptOptions {
  model: string;
  temperature: number;
  systemPrompt: string;
  promptContent: string;
}
