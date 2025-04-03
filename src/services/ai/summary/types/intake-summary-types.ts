
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
