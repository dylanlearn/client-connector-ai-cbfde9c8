
export interface TechnicalConstraint {
  id: string;
  name: string;
  description?: string;
  constraintType: string;
  platform: string;
  parameters: Record<string, any>;
}

export interface FeasibilityCheck {
  id: string;
  wireframeId: string;
  platform: string;
  status: string;
  startedAt: string;
  completedAt?: string;
  overallScore?: number;
  issuesDetected?: Array<{
    constraintId?: string;
    constraintName: string;
    severity: string;
    description: string;
  }>;
  recommendations?: string[];
  createdBy?: string;
}

export class TechnicalFeasibilityService {
  static async getConstraints(platform: string): Promise<TechnicalConstraint[]> {
    // Mock implementation
    return [
      {
        id: "constraint1",
        name: "Memory Usage",
        description: "Maximum memory footprint allowed",
        constraintType: "resource",
        platform,
        parameters: {
          max_memory_mb: 100
        }
      },
      {
        id: "constraint2",
        name: "Screen Size",
        description: "Minimum supported screen dimensions",
        constraintType: "display",
        platform,
        parameters: {
          min_width: 320,
          min_height: 480
        }
      },
      {
        id: "constraint3",
        name: "Animation Complexity",
        description: "Maximum animation complexity allowed",
        constraintType: "performance",
        platform,
        parameters: {
          max_concurrent: 2
        }
      }
    ];
  }

  static async runFeasibilityCheck(wireframeId: string, platform: string): Promise<FeasibilityCheck> {
    // Mock implementation
    return {
      id: `check-${Date.now()}`,
      wireframeId,
      platform,
      status: "completed",
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      overallScore: 0.78,
      issuesDetected: [
        {
          constraintName: "Memory Usage",
          severity: "medium",
          description: "Potential memory issue with large image elements"
        },
        {
          constraintName: "Animation Complexity",
          severity: "low",
          description: "Multiple animations may affect performance on low-end devices"
        }
      ],
      recommendations: [
        "Optimize large images for better performance",
        "Consider lazy loading for below-the-fold content",
        "Limit concurrent animations to improve perceived performance"
      ]
    };
  }

  static async getFeasibilityChecks(wireframeId: string): Promise<FeasibilityCheck[]> {
    // Mock implementation
    return [
      {
        id: "check1",
        wireframeId,
        platform: "mobile",
        status: "completed",
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        completedAt: new Date(Date.now() - 3540000).toISOString(),
        overallScore: 0.78,
        issuesDetected: [
          {
            constraintName: "Memory Usage",
            severity: "medium",
            description: "Potential memory issue with large image elements"
          }
        ],
        recommendations: [
          "Optimize large images for better performance"
        ]
      },
      {
        id: "check2",
        wireframeId,
        platform: "web",
        status: "completed",
        startedAt: new Date(Date.now() - 86400000).toISOString(),
        completedAt: new Date(Date.now() - 86340000).toISOString(),
        overallScore: 0.92,
        issuesDetected: [],
        recommendations: []
      }
    ];
  }

  static getSeverityColor(severity: string): string {
    switch (severity) {
      case 'high': return "bg-red-100 text-red-800 border-red-300";
      case 'medium': return "bg-amber-50 text-amber-700 border-amber-200";
      case 'low': return "bg-blue-50 text-blue-700 border-blue-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  }

  static getScoreColor(score: number): string {
    if (score >= 0.9) return "text-green-700";
    if (score >= 0.7) return "text-amber-600";
    return "text-red-700";
  }
}
