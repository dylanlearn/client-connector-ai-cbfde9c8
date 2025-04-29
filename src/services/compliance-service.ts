
import { CompliancePolicy, ComplianceCheck, ComplianceRule } from '@/types/compliance';
import { v4 as uuidv4 } from 'uuid';

// Mock data for demonstration purposes
const mockPolicies: CompliancePolicy[] = [
  {
    id: '1',
    name: 'WCAG 2.1 AA Compliance',
    description: 'Ensures web content follows accessibility standards',
    policy_type: 'accessibility',
    rules: [
      {
        id: '101',
        name: 'Image Alt Text',
        description: 'All images must have alternative text'
      },
      {
        id: '102',
        name: 'Color Contrast',
        description: 'Text must have sufficient contrast against background'
      }
    ],
    is_active: true,
    severity: 'high',
    created_by: 'system',
    created_at: '2023-10-15T10:00:00Z',
    updated_at: '2023-10-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Enterprise Brand Guidelines',
    description: 'Enforces consistent brand usage across all assets',
    policy_type: 'brand',
    rules: [
      {
        id: '201',
        name: 'Logo Usage',
        description: 'Logo must appear with proper spacing and color'
      },
      {
        id: '202',
        name: 'Typography',
        description: 'Must use approved font families and sizes'
      }
    ],
    is_active: true,
    severity: 'medium',
    created_by: 'system',
    created_at: '2023-10-16T10:00:00Z',
    updated_at: '2023-10-16T10:00:00Z'
  },
  {
    id: '3',
    name: 'Data Security Policy',
    description: 'Ensures compliance with data protection requirements',
    policy_type: 'security',
    rules: [
      {
        id: '301',
        name: 'Data Encryption',
        description: 'User data must be encrypted at rest and in transit'
      },
      {
        id: '302',
        name: 'Authentication',
        description: 'Strong authentication required for all systems'
      }
    ],
    is_active: true,
    severity: 'critical',
    created_by: 'system',
    created_at: '2023-10-17T10:00:00Z',
    updated_at: '2023-10-17T10:00:00Z'
  }
];

const mockChecks: ComplianceCheck[] = [
  {
    id: '1',
    policy_id: '1',
    resource_type: 'website',
    resource_id: 'main-website',
    status: 'failed',
    issues: [
      {
        rule_id: '101',
        message: 'Missing alt text on 3 images',
        severity: 'high',
      }
    ],
    checked_at: '2023-10-20T14:30:00Z',
    policy_name: 'WCAG 2.1 AA Compliance',
    policy_type: 'accessibility',
    severity: 'high'
  },
  {
    id: '2',
    policy_id: '2',
    resource_type: 'marketing-assets',
    resource_id: 'q3-campaign',
    status: 'passed',
    issues: [],
    checked_at: '2023-10-21T09:15:00Z',
    policy_name: 'Enterprise Brand Guidelines',
    policy_type: 'brand',
    severity: 'medium'
  },
  {
    id: '3',
    policy_id: '3',
    resource_type: 'api',
    resource_id: 'user-service',
    status: 'warning',
    issues: [
      {
        rule_id: '302',
        message: 'Password policy not enforced properly',
        severity: 'medium',
      }
    ],
    checked_at: '2023-10-22T11:45:00Z',
    policy_name: 'Data Security Policy',
    policy_type: 'security',
    severity: 'critical'
  }
];

export const ComplianceService = {
  getPolicies: async (): Promise<CompliancePolicy[]> => {
    // In a real app, this would call your API
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPolicies), 800);
    });
  },

  getPolicy: async (policyId: string): Promise<CompliancePolicy> => {
    // In a real app, this would call your API
    const policy = mockPolicies.find(p => p.id === policyId);
    if (!policy) {
      throw new Error('Policy not found');
    }
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(policy), 600);
    });
  },

  createPolicy: async (policy: Partial<CompliancePolicy>): Promise<CompliancePolicy> => {
    // In a real app, this would call your API
    const newPolicy: CompliancePolicy = {
      id: policy.id || uuidv4(),
      name: policy.name || 'Untitled Policy',
      description: policy.description || '',
      policy_type: policy.policy_type || 'custom',
      rules: policy.rules || [],
      is_active: policy.is_active ?? true,
      severity: policy.severity || 'medium',
      created_by: 'current-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(newPolicy), 800);
    });
  },

  updatePolicy: async (policy: Partial<CompliancePolicy>): Promise<CompliancePolicy> => {
    // In a real app, this would call your API
    const existingPolicy = mockPolicies.find(p => p.id === policy.id);
    if (!existingPolicy) {
      throw new Error('Policy not found');
    }
    
    const updatedPolicy = { ...existingPolicy, ...policy, updated_at: new Date().toISOString() };
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(updatedPolicy), 800);
    });
  },

  deletePolicy: async (policyId: string): Promise<void> => {
    // In a real app, this would call your API
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 600);
    });
  },

  getChecks: async (): Promise<ComplianceCheck[]> => {
    // In a real app, this would call your API
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockChecks), 800);
    });
  },

  runComplianceCheck: async (policyId: string, resourceType: string, resourceId: string): Promise<ComplianceCheck> => {
    // In a real app, this would call your API to actually perform the check
    const policy = mockPolicies.find(p => p.id === policyId);
    
    if (!policy) {
      throw new Error('Policy not found');
    }
    
    // This is just a mock result
    const mockCheck: ComplianceCheck = {
      id: uuidv4(),
      policy_id: policyId,
      resource_type: resourceType,
      resource_id: resourceId,
      status: Math.random() > 0.5 ? 'passed' : 'failed',
      issues: Math.random() > 0.5 ? [] : [
        {
          rule_id: policy.rules[0]?.id || '',
          message: `Sample issue with ${policy.rules[0]?.name || 'rule'}`,
          severity: policy.severity,
        }
      ],
      checked_at: new Date().toISOString(),
      policy_name: policy.name,
      policy_type: policy.policy_type,
      severity: policy.severity
    };
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockCheck), 1200);
    });
  }
};
