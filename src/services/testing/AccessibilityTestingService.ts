
export interface AccessibilityTestRun {
  id: string;
  wireframeId: string;
  startedAt: string;
  completedAt?: string;
  wcagLevel: string;
  overallScore?: number;
  status: string;
  resultsSummary?: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
}

export interface AccessibilityIssue {
  id: string;
  testRunId: string;
  elementId?: string;
  elementSelector?: string;
  wcagCriterion?: string;
  issueType: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  description: string;
  impactDescription?: string;
  recommendation?: string;
  status: string;
}

export class AccessibilityTestingService {
  static async runAccessibilityTest(wireframeId: string, wcagLevel: string = "AA"): Promise<AccessibilityTestRun> {
    // Mock implementation - in real app would create via API
    return {
      id: `test-${Date.now()}`,
      wireframeId,
      wcagLevel,
      startedAt: new Date().toISOString(),
      status: "in_progress"
    };
  }

  static async getTestRuns(wireframeId: string): Promise<AccessibilityTestRun[]> {
    // Mock implementation
    return [
      {
        id: "a1",
        wireframeId,
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        completedAt: new Date(Date.now() - 3540000).toISOString(),
        wcagLevel: "AA",
        overallScore: 87,
        status: "completed",
        resultsSummary: {
          critical: 0,
          high: 2,
          medium: 3,
          low: 4,
          info: 5
        }
      },
      {
        id: "a2",
        wireframeId,
        startedAt: new Date(Date.now() - 86400000).toISOString(),
        completedAt: new Date(Date.now() - 86340000).toISOString(),
        wcagLevel: "AAA",
        overallScore: 72,
        status: "completed",
        resultsSummary: {
          critical: 1,
          high: 3,
          medium: 5,
          low: 2,
          info: 4
        }
      }
    ];
  }

  static async getIssues(testRunId: string): Promise<AccessibilityIssue[]> {
    // Mock data
    return [
      {
        id: "i1",
        testRunId,
        elementId: "hero-image",
        issueType: "Missing Alt Text",
        wcagCriterion: "1.1.1",
        severity: "high",
        description: "Image does not have alternative text",
        impactDescription: "Screen readers cannot describe the image to users",
        recommendation: "Add descriptive alt text to the image",
        status: "failed"
      },
      {
        id: "i2",
        testRunId,
        elementId: "nav-menu",
        issueType: "Keyboard Navigation",
        wcagCriterion: "2.1.1",
        severity: "medium",
        description: "Menu items cannot be accessed using keyboard alone",
        recommendation: "Ensure all interactive elements can be reached and activated with keyboard",
        status: "failed"
      },
      {
        id: "i3",
        testRunId,
        elementId: "contact-form",
        issueType: "Form Label",
        wcagCriterion: "3.3.2",
        severity: "medium",
        description: "Form fields do not have associated labels",
        impactDescription: "Users with screen readers cannot identify form fields",
        recommendation: "Add proper <label> elements or aria-label attributes",
        status: "failed"
      }
    ];
  }

  static getScoreColor(score: number): string {
    if (score >= 90) return "text-green-700";
    if (score >= 70) return "text-amber-600";
    return "text-red-700";
  }

  static getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical': return "bg-red-100 text-red-800 border-red-300";
      case 'high': return "bg-red-50 text-red-700 border-red-200";
      case 'medium': return "bg-amber-50 text-amber-700 border-amber-200";
      case 'low': return "bg-blue-50 text-blue-700 border-blue-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  }
}
