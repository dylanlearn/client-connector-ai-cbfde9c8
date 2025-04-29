
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface DesignConsistencyCheck {
  id: string;
  projectId: string;
  wireframeIds?: string[];
  status: string;
  checkType: string;
  startedAt: string;
  completedAt?: string;
  resultsSummary?: {
    issueCount: number;
    componentsChecked: number;
    criticalIssues: number;
    highIssues: number;
    standardsChecked: number;
  };
}

export interface DesignConsistencyIssue {
  id: string;
  checkId: string;
  issueType: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  wireframeId?: string;
  elementId?: string;
  elementPath?: string;
  propertyName?: string;
  expectedValue?: string;
  actualValue?: string;
  description: string;
  recommendation?: string;
  status: 'failed' | 'fixed' | 'ignored';
}

export class DesignConsistencyService {
  static async getConsistencyChecks(projectId: string): Promise<DesignConsistencyCheck[]> {
    try {
      const { data, error } = await supabase
        .from('design_consistency_checks')
        .select('*')
        .eq('project_id', projectId)
        .order('started_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map((check: any) => ({
        id: check.id,
        projectId: check.project_id,
        wireframeIds: check.wireframe_ids,
        status: check.status,
        checkType: check.check_type,
        startedAt: check.started_at,
        completedAt: check.completed_at,
        resultsSummary: check.results_summary
      }));
    } catch (error) {
      console.error("Error fetching consistency checks:", error);
      
      // Return empty array if there's an error
      return [];
    }
  }
  
  static async getConsistencyIssues(checkId: string): Promise<DesignConsistencyIssue[]> {
    try {
      const { data, error } = await supabase
        .from('design_consistency_issues')
        .select('*')
        .eq('check_id', checkId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      return data.map((issue: any) => ({
        id: issue.id,
        checkId: issue.check_id,
        issueType: issue.issue_type,
        severity: issue.severity,
        wireframeId: issue.wireframe_id,
        elementId: issue.element_id,
        elementPath: issue.element_path,
        propertyName: issue.property_name,
        expectedValue: issue.expected_value,
        actualValue: issue.actual_value,
        description: issue.description,
        recommendation: issue.recommendation,
        status: issue.status
      }));
    } catch (error) {
      console.error("Error fetching consistency issues:", error);
      
      // Return empty array if there's an error
      return [];
    }
  }
  
  static async runConsistencyCheck(projectId: string, wireframeIds: string[]): Promise<DesignConsistencyCheck> {
    try {
      // In a real implementation, this would run actual consistency checks
      // For demo purposes, we're generating mock data
      
      // Create a check ID
      const checkId = uuidv4();
      const startedAt = new Date().toISOString();
      
      // Mock issue types for design consistency
      const issueTypes = [
        { type: 'Color inconsistency', severity: 'high', property: 'color' },
        { type: 'Typography variation', severity: 'medium', property: 'fontFamily' },
        { type: 'Spacing inconsistency', severity: 'medium', property: 'margin' },
        { type: 'Different component styles', severity: 'high', property: 'borderRadius' },
        { type: 'Layout grid deviation', severity: 'low', property: 'gridTemplate' },
        { type: 'Icon sizing variation', severity: 'medium', property: 'width' },
        { type: 'Button style inconsistency', severity: 'high', property: 'backgroundColor' },
        { type: 'Form element inconsistency', severity: 'medium', property: 'padding' }
      ];
      
      // Generate 3-8 random issues
      const numIssues = Math.floor(Math.random() * 6) + 3;
      const selectedIssues = [...issueTypes].sort(() => 0.5 - Math.random()).slice(0, numIssues);
      
      const issues = [];
      let criticalCount = 0;
      let highCount = 0;
      
      for (const issue of selectedIssues) {
        const issueId = uuidv4();
        const wireframeId = wireframeIds[Math.floor(Math.random() * wireframeIds.length)];
        const elementId = `element-${Math.floor(Math.random() * 10000)}`;
        
        // Count by severity
        if (issue.severity === 'critical') criticalCount++;
        else if (issue.severity === 'high') highCount++;
        
        // Generate expected vs actual values
        let expectedValue, actualValue;
        
        switch (issue.property) {
          case 'color':
            expectedValue = '#3B82F6';
            actualValue = '#4F46E5';
            break;
          case 'fontFamily':
            expectedValue = 'Inter, sans-serif';
            actualValue = 'Roboto, sans-serif';
            break;
          case 'margin':
            expectedValue = '16px';
            actualValue = '12px';
            break;
          case 'borderRadius':
            expectedValue = '8px';
            actualValue = '4px';
            break;
          case 'width':
            expectedValue = '24px';
            actualValue = '20px';
            break;
          case 'backgroundColor':
            expectedValue = '#3B82F6';
            actualValue = '#2563EB';
            break;
          case 'padding':
            expectedValue = '16px 24px';
            actualValue = '12px 20px';
            break;
          default:
            expectedValue = 'Standard value';
            actualValue = 'Non-standard value';
        }
        
        issues.push({
          id: issueId,
          check_id: checkId,
          issue_type: issue.type,
          severity: issue.severity,
          wireframe_id: wireframeId,
          element_id: elementId,
          element_path: `#${elementId}`,
          property_name: issue.property,
          expected_value: expectedValue,
          actual_value: actualValue,
          description: `Inconsistent ${issue.type.toLowerCase()} detected in component styling`,
          recommendation: `Update the ${issue.property} to match the design system standard: ${expectedValue}`,
          status: 'failed',
          created_at: new Date().toISOString()
        });
      }
      
      // Insert the issues
      const { error: issuesError } = await supabase
        .from('design_consistency_issues')
        .insert(issues);
      
      if (issuesError) throw issuesError;
      
      // Create a summary
      const resultsSummary = {
        issueCount: issues.length,
        componentsChecked: Math.floor(Math.random() * 20) + 10, // Random number between 10-30
        criticalIssues: criticalCount,
        highIssues: highCount,
        standardsChecked: Math.floor(Math.random() * 10) + 5 // Random number between 5-15
      };
      
      // Create the check
      const { data: checkData, error: checkError } = await supabase
        .from('design_consistency_checks')
        .insert([
          {
            id: checkId,
            project_id: projectId,
            wireframe_ids: wireframeIds,
            status: 'completed',
            check_type: wireframeIds.length > 1 ? 'multi-wireframe' : 'single-wireframe',
            started_at: startedAt,
            completed_at: new Date().toISOString(),
            results_summary: resultsSummary
          }
        ])
        .select()
        .single();
      
      if (checkError) throw checkError;
      
      // Return the check
      return {
        id: checkId,
        projectId: projectId,
        wireframeIds: wireframeIds,
        status: 'completed',
        checkType: wireframeIds.length > 1 ? 'multi-wireframe' : 'single-wireframe',
        startedAt: startedAt,
        completedAt: new Date().toISOString(),
        resultsSummary: resultsSummary
      };
    } catch (error) {
      console.error("Error running consistency check:", error);
      throw error;
    }
  }
}
