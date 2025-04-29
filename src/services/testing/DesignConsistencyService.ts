
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DesignConsistencyCheck {
  id?: string;
  projectId: string;
  status: string;
  checkType: string;
  wireframeIds?: string[];
  resultsSummary?: any;
}

export interface DesignConsistencyIssue {
  id?: string;
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
  status: 'passed' | 'failed' | 'warning' | 'not_applicable' | 'not_tested';
}

export interface DesignConsistencyRule {
  id?: string;
  projectId: string;
  name: string;
  ruleType: string;
  propertyPath?: string;
  allowedValues?: any;
  referenceComponentId?: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  isActive: boolean;
}

export const DesignConsistencyService = {
  // Consistency Checks
  async createCheck(check: DesignConsistencyCheck): Promise<DesignConsistencyCheck> {
    const { data, error } = await supabase
      .from('design_consistency_checks')
      .insert([{
        project_id: check.projectId,
        status: check.status,
        check_type: check.checkType,
        wireframe_ids: check.wireframeIds
      }])
      .select()
      .single();

    if (error) {
      toast.error(`Error creating consistency check: ${error.message}`);
      throw error;
    }

    return {
      id: data.id,
      projectId: data.project_id,
      status: data.status,
      checkType: data.check_type,
      wireframeIds: data.wireframe_ids,
      resultsSummary: data.results_summary
    };
  },

  async getChecks(projectId: string): Promise<DesignConsistencyCheck[]> {
    const { data, error } = await supabase
      .from('design_consistency_checks')
      .select('*')
      .eq('project_id', projectId)
      .order('started_at', { ascending: false });

    if (error) {
      toast.error(`Error fetching consistency checks: ${error.message}`);
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      projectId: item.project_id,
      status: item.status,
      checkType: item.check_type,
      wireframeIds: item.wireframe_ids,
      resultsSummary: item.results_summary
    }));
  },

  async updateCheckStatus(
    checkId: string, 
    status: string, 
    resultsSummary?: any
  ): Promise<void> {
    const updateData: any = { 
      status, 
      completed_at: new Date().toISOString() 
    };

    if (resultsSummary) {
      updateData.results_summary = resultsSummary;
    }

    const { error } = await supabase
      .from('design_consistency_checks')
      .update(updateData)
      .eq('id', checkId);

    if (error) {
      toast.error(`Error updating consistency check: ${error.message}`);
      throw error;
    }
  },

  // Consistency Issues
  async saveIssue(issue: DesignConsistencyIssue): Promise<DesignConsistencyIssue> {
    const { data, error } = await supabase
      .from('design_consistency_issues')
      .insert([{
        check_id: issue.checkId,
        issue_type: issue.issueType,
        severity: issue.severity,
        element_id: issue.elementId,
        element_path: issue.elementPath,
        wireframe_id: issue.wireframeId,
        property_name: issue.propertyName,
        expected_value: issue.expectedValue,
        actual_value: issue.actualValue,
        description: issue.description,
        recommendation: issue.recommendation,
        status: issue.status
      }])
      .select()
      .single();

    if (error) {
      toast.error(`Error saving consistency issue: ${error.message}`);
      throw error;
    }

    return {
      id: data.id,
      checkId: data.check_id,
      issueType: data.issue_type,
      severity: data.severity as any,
      elementId: data.element_id,
      elementPath: data.element_path,
      wireframeId: data.wireframe_id,
      propertyName: data.property_name,
      expectedValue: data.expected_value,
      actualValue: data.actual_value,
      description: data.description,
      recommendation: data.recommendation,
      status: data.status as any
    };
  },

  async getIssues(checkId: string): Promise<DesignConsistencyIssue[]> {
    const { data, error } = await supabase
      .from('design_consistency_issues')
      .select('*')
      .eq('check_id', checkId)
      .order('created_at');

    if (error) {
      toast.error(`Error fetching consistency issues: ${error.message}`);
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      checkId: item.check_id,
      issueType: item.issue_type,
      severity: item.severity as any,
      elementId: item.element_id,
      elementPath: item.element_path,
      wireframeId: item.wireframe_id,
      propertyName: item.property_name,
      expectedValue: item.expected_value,
      actualValue: item.actual_value,
      description: item.description,
      recommendation: item.recommendation,
      status: item.status as any
    }));
  },

  // Consistency Rules
  async createRule(rule: DesignConsistencyRule): Promise<DesignConsistencyRule> {
    const { data, error } = await supabase
      .from('design_consistency_rules')
      .insert([{
        project_id: rule.projectId,
        name: rule.name,
        rule_type: rule.ruleType,
        property_path: rule.propertyPath,
        allowed_values: rule.allowedValues,
        reference_component_id: rule.referenceComponentId,
        severity: rule.severity,
        is_active: rule.isActive
      }])
      .select()
      .single();

    if (error) {
      toast.error(`Error creating consistency rule: ${error.message}`);
      throw error;
    }

    return {
      id: data.id,
      projectId: data.project_id,
      name: data.name,
      ruleType: data.rule_type,
      propertyPath: data.property_path,
      allowedValues: data.allowed_values,
      referenceComponentId: data.reference_component_id,
      severity: data.severity as any,
      isActive: data.is_active
    };
  },

  async getRules(projectId: string): Promise<DesignConsistencyRule[]> {
    const { data, error } = await supabase
      .from('design_consistency_rules')
      .select('*')
      .eq('project_id', projectId)
      .order('name');

    if (error) {
      toast.error(`Error fetching consistency rules: ${error.message}`);
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      projectId: item.project_id,
      name: item.name,
      ruleType: item.rule_type,
      propertyPath: item.property_path,
      allowedValues: item.allowed_values,
      referenceComponentId: item.reference_component_id,
      severity: item.severity as any,
      isActive: item.is_active
    }));
  },

  // Testing Operations
  async runConsistencyCheck(projectId: string, wireframeIds?: string[]): Promise<DesignConsistencyCheck> {
    // Create a new check
    const check = await this.createCheck({
      projectId,
      status: 'running',
      checkType: wireframeIds ? 'selected' : 'full',
      wireframeIds
    });

    try {
      // In a real implementation, this would analyze the wireframes 
      // For now, we're just simulating the check

      // Get wireframes to check
      let wireframesToCheck: string[] = [];
      
      if (wireframeIds && wireframeIds.length > 0) {
        wireframesToCheck = wireframeIds;
      } else {
        // Get all project wireframes
        const { data } = await supabase
          .from('ai_wireframes')
          .select('id')
          .eq('project_id', projectId);
          
        if (data && data.length > 0) {
          wireframesToCheck = data.map(w => w.id);
        }
      }

      // Wait a moment to simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock some issues
      const mockIssues: Omit<DesignConsistencyIssue, 'id'>[] = [
        {
          checkId: check.id!,
          issueType: 'colorConsistency',
          severity: 'medium',
          wireframeId: wireframesToCheck[0],
          propertyName: 'primary-button-color',
          expectedValue: '#3B82F6',
          actualValue: '#60A5FA',
          description: 'Primary button color inconsistency',
          recommendation: 'Update button color to match the design system',
          status: 'failed'
        },
        {
          checkId: check.id!,
          issueType: 'spacing',
          severity: 'low',
          wireframeId: wireframesToCheck[0],
          propertyName: 'card-padding',
          expectedValue: '16px',
          actualValue: '12px',
          description: 'Card padding inconsistency',
          recommendation: 'Adjust card padding to 16px to match design system',
          status: 'failed'
        },
        {
          checkId: check.id!,
          issueType: 'typography',
          severity: 'high',
          wireframeId: wireframesToCheck[1] || wireframesToCheck[0],
          propertyName: 'heading-font',
          expectedValue: 'Inter',
          actualValue: 'Arial',
          description: 'Heading font inconsistency',
          recommendation: 'Use Inter font for headings as specified in design system',
          status: 'failed'
        }
      ];

      // Save the issues
      for (const issue of mockIssues) {
        await this.saveIssue(issue);
      }

      // Update the check with the results
      await this.updateCheckStatus(check.id!, 'completed', {
        total_issues: mockIssues.length,
        wireframes_checked: wireframesToCheck.length,
        by_severity: {
          critical: mockIssues.filter(i => i.severity === 'critical').length,
          high: mockIssues.filter(i => i.severity === 'high').length,
          medium: mockIssues.filter(i => i.severity === 'medium').length,
          low: mockIssues.filter(i => i.severity === 'low').length,
          info: mockIssues.filter(i => i.severity === 'info').length
        },
        by_type: {
          colorConsistency: mockIssues.filter(i => i.issueType === 'colorConsistency').length,
          spacing: mockIssues.filter(i => i.issueType === 'spacing').length,
          typography: mockIssues.filter(i => i.issueType === 'typography').length
        }
      });

      return {
        ...check,
        status: 'completed',
        wireframeIds: wireframesToCheck,
        resultsSummary: {
          total_issues: mockIssues.length,
          wireframes_checked: wireframesToCheck.length
        }
      };
    } catch (error) {
      // Handle errors
      await this.updateCheckStatus(check.id!, 'failed', { 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }
};
