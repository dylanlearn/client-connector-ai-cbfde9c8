
export interface DesignConsistencyRule {
  id: string;
  projectId: string;
  name: string;
  ruleType: string;
  propertyPath?: string;
  allowedValues?: Record<string, any>;
  referenceComponentId?: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  isActive: boolean;
}

export interface DesignConsistencyCheck {
  id: string;
  projectId: string;
  startedAt: string;
  completedAt?: string;
  status: string;
  checkType: string;
  wireframeIds: string[];
  resultsSummary?: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
}

export interface DesignConsistencyIssue {
  id: string;
  checkId: string;
  issueType: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  elementId?: string;
  elementPath?: string;
  wireframeId?: string;
  propertyName?: string;
  expectedValue?: string;
  actualValue?: string;
  description: string;
  recommendation?: string;
  status: string;
}

export class DesignConsistencyService {
  static async runConsistencyCheck(projectId: string, wireframeIds: string[], checkType: string = "full"): Promise<DesignConsistencyCheck> {
    // Mock implementation - in real app would create via API
    return {
      id: `check-${Date.now()}`,
      projectId,
      wireframeIds,
      checkType,
      startedAt: new Date().toISOString(),
      status: "in_progress"
    };
  }

  static async getChecks(projectId: string): Promise<DesignConsistencyCheck[]> {
    // Mock implementation
    return [
      {
        id: "c1",
        projectId,
        wireframeIds: ["w1", "w2", "w3"],
        startedAt: new Date(Date.now() - 7200000).toISOString(),
        completedAt: new Date(Date.now() - 7140000).toISOString(),
        status: "completed",
        checkType: "full",
        resultsSummary: {
          critical: 0,
          high: 2,
          medium: 5,
          low: 3,
          info: 1
        }
      },
      {
        id: "c2",
        projectId,
        wireframeIds: ["w1", "w4"],
        startedAt: new Date(Date.now() - 172800000).toISOString(),
        completedAt: new Date(Date.now() - 172740000).toISOString(),
        status: "completed",
        checkType: "color-only",
        resultsSummary: {
          critical: 1,
          high: 2,
          medium: 0,
          low: 0,
          info: 0
        }
      }
    ];
  }

  static async getIssues(checkId: string): Promise<DesignConsistencyIssue[]> {
    // Mock data
    return [
      {
        id: "dc1",
        checkId,
        issueType: "Color Inconsistency",
        severity: "high",
        wireframeId: "w1",
        elementId: "btn-primary",
        propertyName: "backgroundColor",
        expectedValue: "#1e40af",
        actualValue: "#2563eb",
        description: "Primary button color mismatch with design system",
        recommendation: "Update button color to match design system token",
        status: "failed"
      },
      {
        id: "dc2",
        checkId,
        issueType: "Typography Inconsistency",
        severity: "medium",
        wireframeId: "w2",
        elementId: "h2-title",
        propertyName: "fontSize",
        expectedValue: "1.5rem",
        actualValue: "1.75rem",
        description: "Heading font size does not match design system",
        recommendation: "Adjust font size to match design system token",
        status: "failed"
      },
      {
        id: "dc3",
        checkId,
        issueType: "Spacing Inconsistency",
        severity: "medium",
        wireframeId: "w1",
        elementId: "card-container",
        propertyName: "padding",
        expectedValue: "1.5rem",
        actualValue: "1rem",
        description: "Card padding is inconsistent with design system",
        recommendation: "Update padding to use design system spacing token",
        status: "failed"
      }
    ];
  }

  static async getRules(projectId: string): Promise<DesignConsistencyRule[]> {
    // Mock data
    return [
      {
        id: "r1",
        projectId,
        name: "Primary Button Color",
        ruleType: "color",
        propertyPath: "style.backgroundColor",
        allowedValues: { value: "#1e40af" },
        severity: "high",
        isActive: true
      },
      {
        id: "r2",
        projectId,
        name: "Heading Font Size",
        ruleType: "typography",
        propertyPath: "style.fontSize",
        allowedValues: { h1: "2rem", h2: "1.5rem", h3: "1.25rem" },
        severity: "medium",
        isActive: true
      },
      {
        id: "r3",
        projectId,
        name: "Card Component Structure",
        ruleType: "component",
        referenceComponentId: "card-standard",
        severity: "medium",
        isActive: false
      }
    ];
  }

  static async createRule(rule: Partial<DesignConsistencyRule>): Promise<DesignConsistencyRule> {
    // Mock implementation - in a real app would call API
    return {
      id: `rule-${Date.now()}`,
      projectId: rule.projectId || "",
      name: rule.name || "New Rule",
      ruleType: rule.ruleType || "custom",
      propertyPath: rule.propertyPath,
      allowedValues: rule.allowedValues,
      referenceComponentId: rule.referenceComponentId,
      severity: rule.severity || "medium",
      isActive: rule.isActive !== undefined ? rule.isActive : true
    };
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
