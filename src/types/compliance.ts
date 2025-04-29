
export interface CompliancePolicy {
  id: string;
  workspace_id?: string;
  name: string;
  description?: string;
  policy_type: 'accessibility' | 'brand' | 'regulatory' | 'security' | 'custom';
  rules: ComplianceRule[];
  is_active: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  validator?: string;
  params?: Record<string, any>;
}

export interface ComplianceCheck {
  id: string;
  policy_id: string;
  resource_type: string;
  resource_id: string;
  status: 'pending' | 'passed' | 'failed' | 'warning' | 'exempted';
  issues: ComplianceIssue[];
  checked_at: string;
  checked_by?: string;
  next_check_at?: string;
  exemption_reason?: string;
  exempted_by?: string;
  exemption_expires_at?: string;
  policy_name?: string;
  policy_type?: string;
  severity?: string;
}

export interface ComplianceIssue {
  rule_id: string;
  message: string;
  severity: string;
  details?: Record<string, any>;
}

export interface BrandGuideline {
  id: string;
  workspace_id: string;
  name: string;
  description?: string;
  color_palette: any[];
  typography: Record<string, any>;
  logos: any[];
  image_guidelines: Record<string, any>;
  voice_tone_guidelines?: string;
  created_at: string;
  updated_at: string;
  version: string;
}

export interface AccessibilityStandard {
  id: string;
  workspace_id?: string;
  standard_name: string;
  description?: string;
  requirements: any[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ComplianceStatus {
  summary: {
    total: number;
    passed: number;
    failed: number;
    warning: number;
    exempted: number;
  };
  details: ComplianceCheck[];
}
