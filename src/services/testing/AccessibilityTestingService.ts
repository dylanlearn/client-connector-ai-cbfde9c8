
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface AccessibilityTestRun {
  id: string;
  wireframeId: string;
  wcagLevel: string;
  status: string;
  startedAt: string;
  completedAt?: string;
  overallScore?: number;
  resultsSummary?: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
  };
}

export interface AccessibilityIssue {
  id: string;
  testRunId: string;
  elementId?: string;
  elementSelector?: string;
  wcagCriterion?: string;
  issueType: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  impactDescription?: string;
  recommendation?: string;
  status: 'failed' | 'fixed' | 'ignored';
}

export class AccessibilityTestingService {
  static async getTestRuns(wireframeId: string): Promise<AccessibilityTestRun[]> {
    try {
      const { data, error } = await supabase
        .from('accessibility_test_runs')
        .select('*')
        .eq('wireframe_id', wireframeId)
        .order('started_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map((run: any) => ({
        id: run.id,
        wireframeId: run.wireframe_id,
        wcagLevel: run.wcag_level,
        status: run.status,
        startedAt: run.started_at,
        completedAt: run.completed_at,
        overallScore: run.overall_score,
        resultsSummary: run.results_summary
      }));
    } catch (error) {
      console.error("Error fetching accessibility test runs:", error);
      
      // Return empty array if there's an error
      return [];
    }
  }
  
  static async getIssues(testRunId: string): Promise<AccessibilityIssue[]> {
    try {
      const { data, error } = await supabase
        .from('accessibility_issues')
        .select('*')
        .eq('test_run_id', testRunId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      return data.map((issue: any) => ({
        id: issue.id,
        testRunId: issue.test_run_id,
        elementId: issue.element_id,
        elementSelector: issue.element_selector,
        wcagCriterion: issue.wcag_criterion,
        issueType: issue.issue_type,
        severity: issue.severity,
        description: issue.description,
        impactDescription: issue.impact_description,
        recommendation: issue.recommendation,
        status: issue.status
      }));
    } catch (error) {
      console.error("Error fetching accessibility issues:", error);
      
      // Return empty array if there's an error
      return [];
    }
  }
  
  static async runAccessibilityTest(wireframeId: string, wcagLevel: string): Promise<AccessibilityTestRun> {
    try {
      // In a real implementation, this would run actual accessibility tests
      // For demo purposes, we're generating mock data
      
      // Create a new test run
      const testRunId = uuidv4();
      const startedAt = new Date().toISOString();
      
      // Mock some issues
      const issueTypes = [
        { type: 'Missing alt text', wcag: '1.1.1', severity: 'high' },
        { type: 'Insufficient color contrast', wcag: '1.4.3', severity: 'medium' },
        { type: 'Missing form labels', wcag: '3.3.2', severity: 'high' },
        { type: 'Keyboard navigation issues', wcag: '2.1.1', severity: 'critical' },
        { type: 'Missing ARIA attributes', wcag: '4.1.2', severity: 'medium' },
        { type: 'Improper heading structure', wcag: '1.3.1', severity: 'low' }
      ];
      
      // Select 2-5 random issues
      const numIssues = Math.floor(Math.random() * 4) + 2;
      const selectedIssues = [...issueTypes].sort(() => 0.5 - Math.random()).slice(0, numIssues);
      
      const issues = [];
      let criticalCount = 0;
      let highCount = 0;
      let mediumCount = 0;
      let lowCount = 0;
      
      for (const issue of selectedIssues) {
        const issueId = uuidv4();
        const elementId = `element-${Math.floor(Math.random() * 10000)}`;
        
        // Count by severity
        if (issue.severity === 'critical') criticalCount++;
        else if (issue.severity === 'high') highCount++;
        else if (issue.severity === 'medium') mediumCount++;
        else lowCount++;
        
        issues.push({
          id: issueId,
          test_run_id: testRunId,
          element_id: elementId,
          element_selector: `#${elementId}`,
          wcag_criterion: issue.wcag,
          issue_type: issue.type,
          severity: issue.severity,
          description: `This element has an accessibility issue: ${issue.type}`,
          impact_description: issue.severity === 'critical' || issue.severity === 'high' ? 
            'This issue severely impacts users with disabilities' : 
            'This issue may cause difficulties for some users',
          recommendation: `Add appropriate ${issue.type === 'Missing alt text' ? 'alt attributes' : 
            issue.type === 'Insufficient color contrast' ? 'higher contrast colors' : 
            'accessibility attributes'}`,
          status: 'failed',
          created_at: new Date().toISOString()
        });
      }
      
      // Insert the issues
      const { error: issuesError } = await supabase
        .from('accessibility_issues')
        .insert(issues);
      
      if (issuesError) throw issuesError;
      
      // Calculate an overall score (0-100)
      // Critical issues have the biggest impact, then high, medium, low
      const baseScore = 100;
      const criticalPenalty = 20;
      const highPenalty = 10;
      const mediumPenalty = 5;
      const lowPenalty = 2;
      
      const overallScore = Math.max(0, Math.min(100, Math.floor(
        baseScore - 
        (criticalCount * criticalPenalty) - 
        (highCount * highPenalty) - 
        (mediumCount * mediumPenalty) - 
        (lowCount * lowPenalty)
      )));
      
      // Create a summary
      const resultsSummary = {
        critical: criticalCount,
        high: highCount,
        medium: mediumCount,
        low: lowCount,
        total: issues.length
      };
      
      // Create the test run
      const { data: testRunData, error: testRunError } = await supabase
        .from('accessibility_test_runs')
        .insert([
          {
            id: testRunId,
            wireframe_id: wireframeId,
            wcag_level: wcagLevel,
            status: 'completed',
            started_at: startedAt,
            completed_at: new Date().toISOString(),
            overall_score: overallScore,
            results_summary: resultsSummary
          }
        ])
        .select()
        .single();
      
      if (testRunError) throw testRunError;
      
      // Return the test run
      return {
        id: testRunId,
        wireframeId: wireframeId,
        wcagLevel: wcagLevel,
        status: 'completed',
        startedAt: startedAt,
        completedAt: new Date().toISOString(),
        overallScore: overallScore,
        resultsSummary: resultsSummary
      };
    } catch (error) {
      console.error("Error running accessibility test:", error);
      throw error;
    }
  }
}
