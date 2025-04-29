
export interface ContentStrategy {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  contentRequirements: Record<string, any>;
  informationArchitecture?: Record<string, any>;
  toneGuidelines?: string;
  createdAt: string;
  updatedAt: string;
  creatorId?: string;
}

export interface ContentAdherenceCheck {
  id: string;
  wireframeId: string;
  strategyId: string;
  status: string;
  startedAt: string;
  completedAt?: string;
  complianceScore?: number;
  issues?: Array<{
    elementId: string;
    issue: string;
    severity: string;
  }>;
  recommendations?: string;
  checkedBy?: string;
}

export class ContentAdherenceService {
  static async getContentStrategies(projectId: string): Promise<ContentStrategy[]> {
    // Mock implementation
    return [
      {
        id: "strategy1",
        projectId,
        title: "Corporate Website Strategy",
        description: "Content strategy for corporate website redesign",
        contentRequirements: {
          voice: "professional",
          required_sections: ["about", "services", "contact"],
          word_count: {
            hero: {
              min: 10,
              max: 50
            }
          }
        },
        informationArchitecture: {
          hierarchy: {
            depth: 3,
            main_categories: ["company", "solutions", "resources", "contact"]
          }
        },
        toneGuidelines: "Professional yet approachable tone, avoiding technical jargon while maintaining industry authority",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: "strategy2",
        projectId,
        title: "E-commerce Product Content",
        description: "Strategy for product pages and descriptions",
        contentRequirements: {
          voice: "conversational",
          required_sections: ["features", "specifications", "reviews"],
          word_count: {
            product_description: {
              min: 100,
              max: 300
            }
          }
        },
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  }

  static async getAdherenceChecks(wireframeId: string): Promise<ContentAdherenceCheck[]> {
    // Mock implementation
    return [
      {
        id: "adherence1",
        wireframeId,
        strategyId: "strategy1",
        status: "completed",
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        completedAt: new Date(Date.now() - 3540000).toISOString(),
        complianceScore: 0.92,
        issues: [
          {
            elementId: "hero-section",
            issue: "Tone mismatch with content guidelines",
            severity: "low"
          }
        ],
        recommendations: "Consider revising hero section copy to align with established tone guidelines"
      }
    ];
  }

  static async verifyContentAdherence(wireframeId: string, strategyId: string): Promise<ContentAdherenceCheck> {
    // Mock implementation
    return {
      id: `adherence-${Date.now()}`,
      wireframeId,
      strategyId,
      status: "completed",
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      complianceScore: 0.92,
      issues: [
        {
          elementId: "hero-section",
          issue: "Tone mismatch with content guidelines",
          severity: "low"
        }
      ],
      recommendations: "Consider revising hero section copy to align with established tone guidelines"
    };
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
