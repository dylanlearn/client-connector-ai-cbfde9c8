
export interface UserFlowPath {
  id: string;
  name: string;
  description?: string;
  wireframeId: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  successCriteria: Record<string, any>;
}

export interface FlowPathStep {
  id: string;
  pathId: string;
  stepOrder: number;
  elementId: string;
  actionType: string;
  expectedDestination?: string;
  validationRule?: string;
}

export interface FlowValidation {
  id: string;
  pathId: string;
  validationDate: string;
  status: string;
  completionRate?: number;
  issuesDetected?: Array<{
    stepOrder: number;
    issue: string;
    severity: string;
  }>;
  validatorId?: string;
  executionTimeMs?: number;
}

export class UserFlowTestingService {
  static async createUserFlowPath(
    wireframeId: string,
    name: string,
    description: string = "",
    successCriteria: Record<string, any> = {}
  ): Promise<UserFlowPath> {
    // Mock implementation - in real app would create via API
    return {
      id: `flow-${Date.now()}`,
      wireframeId,
      name,
      description,
      creatorId: 'current-user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      successCriteria
    };
  }

  static async getFlowPaths(wireframeId: string): Promise<UserFlowPath[]> {
    // Mock implementation
    return [
      {
        id: "flow1",
        wireframeId,
        name: "Sign Up Flow",
        description: "User registration path from landing to confirmation",
        creatorId: "user-1",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        status: "active",
        successCriteria: {
          maxSteps: 5,
          requiredFields: ["email", "password", "name"]
        }
      },
      {
        id: "flow2",
        wireframeId,
        name: "Checkout Process",
        description: "Product purchase from cart to receipt",
        creatorId: "user-1",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        status: "active",
        successCriteria: {
          maxSteps: 6,
          requiredFields: ["shipping", "billing", "payment"]
        }
      }
    ];
  }

  static async getFlowPathSteps(pathId: string): Promise<FlowPathStep[]> {
    // Mock implementation
    return [
      {
        id: "step1",
        pathId,
        stepOrder: 1,
        elementId: "landing-cta",
        actionType: "click",
        expectedDestination: "signup-form"
      },
      {
        id: "step2",
        pathId,
        stepOrder: 2,
        elementId: "email-input",
        actionType: "input",
        validationRule: "email"
      },
      {
        id: "step3",
        pathId,
        stepOrder: 3,
        elementId: "password-input",
        actionType: "input",
        validationRule: "password"
      },
      {
        id: "step4",
        pathId,
        stepOrder: 4,
        elementId: "submit-button",
        actionType: "click",
        expectedDestination: "confirmation-page"
      }
    ];
  }

  static async validateUserFlow(pathId: string): Promise<FlowValidation> {
    // Mock implementation
    return {
      id: `validation-${Date.now()}`,
      pathId,
      validationDate: new Date().toISOString(),
      status: "completed",
      completionRate: 0.85,
      issuesDetected: [
        {
          stepOrder: 3,
          issue: "Missing validation on form submission",
          severity: "medium"
        }
      ],
      executionTimeMs: 350
    };
  }
}
