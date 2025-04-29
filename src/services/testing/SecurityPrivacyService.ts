
export interface SecurityPrivacyRequirement {
  id: string;
  category: string;
  name: string;
  description: string;
  severity: string;
  guidance?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityPrivacyReview {
  id: string;
  wireframeId: string;
  status: string;
  startedAt: string;
  completedAt?: string;
  riskScore?: number;
  findings?: Array<{
    elementId: string;
    finding: string;
    severity: string;
    requirementId?: string;
  }>;
  recommendations?: string;
  reviewerId?: string;
}

export class SecurityPrivacyService {
  static async getSecurityRequirements(): Promise<SecurityPrivacyRequirement[]> {
    // Mock implementation
    return [
      {
        id: "req1",
        category: "privacy",
        name: "Data Collection Notice",
        description: "Clear disclosure when collecting personal information",
        severity: "high",
        guidance: "Include visible privacy notices whenever collecting user data",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: "req2",
        category: "security",
        name: "Form Protection",
        description: "Protection against injection attacks in forms",
        severity: "high",
        guidance: "Ensure all forms have proper validation and sanitization",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: "req3",
        category: "privacy",
        name: "Cookie Consent",
        description: "User consent for non-essential cookies",
        severity: "medium",
        guidance: "Implement cookie consent mechanism before setting cookies",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  }

  static async getSecurityReviews(wireframeId: string): Promise<SecurityPrivacyReview[]> {
    // Mock implementation
    return [
      {
        id: "review1",
        wireframeId,
        status: "completed",
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        completedAt: new Date(Date.now() - 3540000).toISOString(),
        riskScore: 0.35,
        findings: [
          {
            elementId: "contact-form",
            finding: "Form submission without explicit privacy notice",
            severity: "medium",
            requirementId: "req1"
          }
        ],
        recommendations: "Add a privacy notice near the contact form explaining data usage"
      }
    ];
  }

  static async conductSecurityReview(wireframeId: string): Promise<SecurityPrivacyReview> {
    // Mock implementation
    return {
      id: `review-${Date.now()}`,
      wireframeId,
      status: "completed",
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      riskScore: 0.35,
      findings: [
        {
          elementId: "contact-form",
          finding: "Form submission without explicit privacy notice",
          severity: "medium",
          requirementId: "req1"
        }
      ],
      recommendations: "Add a privacy notice near the contact form explaining data usage"
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

  static getRiskScoreColor(score: number): string {
    if (score < 0.3) return "text-green-700";
    if (score < 0.7) return "text-amber-600";
    return "text-red-700";
  }
}
