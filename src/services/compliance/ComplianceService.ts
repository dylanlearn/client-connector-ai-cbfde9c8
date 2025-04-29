import { supabase } from "@/integrations/supabase/client";
import {
  CompliancePolicy,
  ComplianceCheck,
  BrandGuideline,
  AccessibilityStandard,
  ComplianceStatus
} from "@/types/compliance";
import { toast } from "sonner";

export class ComplianceService {
  /**
   * Get compliance policies for a workspace
   */
  static async getPolicies(workspaceId?: string): Promise<CompliancePolicy[]> {
    try {
      let query = supabase
        .from('compliance_policies')
        .select('*');
      
      // Filter by workspace if specified, otherwise get global policies
      if (workspaceId) {
        query = query.eq('workspace_id', workspaceId);
      } else {
        query = query.is('workspace_id', null);
      }
        
      const { data, error } = await query;
        
      if (error) throw error;
      return data as CompliancePolicy[];
    } catch (err) {
      console.error("Error fetching compliance policies:", err);
      return [];
    }
  }
  
  /**
   * Run a compliance check
   */
  static async runComplianceCheck(
    policyId: string,
    resourceType: string,
    resourceId: string
  ): Promise<ComplianceCheck | null> {
    try {
      const { data, error } = await supabase.rpc('run_compliance_check', {
        p_policy_id: policyId,
        p_resource_type: resourceType,
        p_resource_id: resourceId
      });
      
      if (error) throw error;
      
      if (data && data.success) {
        toast.success(`Compliance check completed with status: ${data.status}`);
        return {
          id: data.check_id,
          policy_id: policyId,
          resource_type: resourceType,
          resource_id: resourceId,
          status: data.status,
          issues: data.issues,
          checked_at: new Date().toISOString()
        };
      }
      
      return null;
    } catch (err) {
      console.error("Error running compliance check:", err);
      toast.error("Failed to run compliance check");
      return null;
    }
  }
  
  /**
   * Get compliance status for a workspace
   */
  static async getComplianceStatus(
    workspaceId: string,
    resourceType?: string,
    resourceId?: string
  ): Promise<ComplianceStatus | null> {
    try {
      const { data, error } = await supabase.rpc('get_compliance_status', {
        p_workspace_id: workspaceId,
        p_resource_type: resourceType,
        p_resource_id: resourceId
      });
      
      if (error) throw error;
      return data as ComplianceStatus;
    } catch (err) {
      console.error("Error fetching compliance status:", err);
      return null;
    }
  }
  
  /**
   * Update a compliance policy
   */
  static async updatePolicy(id: string, updates: Partial<CompliancePolicy>): Promise<CompliancePolicy | null> {
    try {
      const { data, error } = await supabase
        .from('compliance_policies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as CompliancePolicy;
    } catch (err) {
      console.error("Error updating compliance policy:", err);
      toast.error("Failed to update compliance policy");
      return null;
    }
  }
  
  /**
   * Create a compliance policy
   */
  static async createPolicy(policy: Partial<CompliancePolicy>): Promise<CompliancePolicy | null> {
    try {
      const { data, error } = await supabase
        .from('compliance_policies')
        .insert(policy)
        .select()
        .single();
      
      if (error) throw error;
      return data as CompliancePolicy;
    } catch (err) {
      console.error("Error creating compliance policy:", err);
      toast.error("Failed to create compliance policy");
      return null;
    }
  }
  
  /**
   * Get brand guidelines
   */
  static async getBrandGuidelines(workspaceId: string): Promise<BrandGuideline[]> {
    try {
      const { data, error } = await supabase
        .from('brand_guidelines')
        .select('*')
        .eq('workspace_id', workspaceId);
        
      if (error) throw error;
      return data as BrandGuideline[];
    } catch (err) {
      console.error("Error fetching brand guidelines:", err);
      return [];
    }
  }
  
  /**
   * Get accessibility standards
   */
  static async getAccessibilityStandards(workspaceId?: string): Promise<AccessibilityStandard[]> {
    try {
      let query = supabase
        .from('accessibility_standards')
        .select('*');
      
      // Filter by workspace if specified
      if (workspaceId) {
        query = query.eq('workspace_id', workspaceId);
      }
        
      const { data, error } = await query;
        
      if (error) throw error;
      return data as AccessibilityStandard[];
    } catch (err) {
      console.error("Error fetching accessibility standards:", err);
      return [];
    }
  }
  
  /**
   * Exempt a resource from compliance
   */
  static async exemptFromCompliance(
    checkId: string, 
    reason: string, 
    expiresAt?: Date
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('compliance_checks')
        .update({
          status: 'exempted',
          exemption_reason: reason,
          exemption_expires_at: expiresAt?.toISOString()
        })
        .eq('id', checkId);
      
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Error exempting from compliance:", err);
      toast.error("Failed to exempt from compliance");
      return false;
    }
  }
}
