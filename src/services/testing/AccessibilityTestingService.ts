
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AccessibilityTestRun {
  id?: string;
  wireframeId: string;
  wcagLevel: string;
  overallScore?: number;
  status: string;
  resultsSummary?: any;
}

export interface AccessibilityIssue {
  id?: string;
  testRunId: string;
  elementId?: string;
  elementSelector?: string;
  wcagCriterion?: string;
  issueType: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  description: string;
  impactDescription?: string;
  recommendation?: string;
  status: 'passed' | 'failed' | 'warning' | 'not_applicable' | 'not_tested';
}

export interface AccessibilityGuideline {
  componentType: string;
  ariaAttributes?: any[];
  keyboardInteractions?: any[];
  screenReaderRequirements?: string[];
  focusManagement?: string[];
  wcagCriteria?: any[];
}

export const AccessibilityTestingService = {
  // Test Runs
  async createTestRun(testRun: AccessibilityTestRun): Promise<AccessibilityTestRun> {
    const { data, error } = await supabase
      .from('accessibility_test_runs')
      .insert([{
        wireframe_id: testRun.wireframeId,
        wcag_level: testRun.wcagLevel,
        status: testRun.status
      }])
      .select()
      .single();

    if (error) {
      toast.error(`Error creating accessibility test run: ${error.message}`);
      throw error;
    }

    return {
      id: data.id,
      wireframeId: data.wireframe_id,
      wcagLevel: data.wcag_level,
      status: data.status,
      resultsSummary: data.results_summary
    };
  },

  async getTestRuns(wireframeId: string): Promise<AccessibilityTestRun[]> {
    const { data, error } = await supabase
      .from('accessibility_test_runs')
      .select('*')
      .eq('wireframe_id', wireframeId)
      .order('started_at', { ascending: false });

    if (error) {
      toast.error(`Error fetching accessibility test runs: ${error.message}`);
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      wireframeId: item.wireframe_id,
      wcagLevel: item.wcag_level,
      overallScore: item.overall_score,
      status: item.status,
      resultsSummary: item.results_summary
    }));
  },

  async updateTestRunStatus(
    testRunId: string, 
    status: string, 
    overallScore?: number, 
    resultsSummary?: any
  ): Promise<void> {
    const updateData: any = { 
      status, 
      completed_at: new Date().toISOString() 
    };

    if (overallScore !== undefined) {
      updateData.overall_score = overallScore;
    }

    if (resultsSummary) {
      updateData.results_summary = resultsSummary;
    }

    const { error } = await supabase
      .from('accessibility_test_runs')
      .update(updateData)
      .eq('id', testRunId);

    if (error) {
      toast.error(`Error updating accessibility test run: ${error.message}`);
      throw error;
    }
  },

  // Issues
  async saveIssue(issue: AccessibilityIssue): Promise<AccessibilityIssue> {
    const { data, error } = await supabase
      .from('accessibility_issues')
      .insert([{
        test_run_id: issue.testRunId,
        element_id: issue.elementId,
        element_selector: issue.elementSelector,
        wcag_criterion: issue.wcagCriterion,
        issue_type: issue.issueType,
        severity: issue.severity,
        description: issue.description,
        impact_description: issue.impactDescription,
        recommendation: issue.recommendation,
        status: issue.status
      }])
      .select()
      .single();

    if (error) {
      toast.error(`Error saving accessibility issue: ${error.message}`);
      throw error;
    }

    return {
      id: data.id,
      testRunId: data.test_run_id,
      elementId: data.element_id,
      elementSelector: data.element_selector,
      wcagCriterion: data.wcag_criterion,
      issueType: data.issue_type,
      severity: data.severity as any,
      description: data.description,
      impactDescription: data.impact_description,
      recommendation: data.recommendation,
      status: data.status as any
    };
  },

  async getIssues(testRunId: string): Promise<AccessibilityIssue[]> {
    const { data, error } = await supabase
      .from('accessibility_issues')
      .select('*')
      .eq('test_run_id', testRunId)
      .order('created_at');

    if (error) {
      toast.error(`Error fetching accessibility issues: ${error.message}`);
      throw error;
    }

    return data.map(item => ({
      id: item.id,
      testRunId: item.test_run_id,
      elementId: item.element_id,
      elementSelector: item.element_selector,
      wcagCriterion: item.wcag_criterion,
      issueType: item.issue_type,
      severity: item.severity as any,
      description: item.description,
      impactDescription: item.impact_description,
      recommendation: item.recommendation,
      status: item.status as any
    }));
  },

  // Guidelines
  async getGuidelines(componentType?: string): Promise<AccessibilityGuideline[]> {
    let query = supabase.from('accessibility_guidelines').select('*');
    
    if (componentType) {
      query = query.eq('component_type', componentType);
    }
    
    const { data, error } = await query;

    if (error) {
      toast.error(`Error fetching accessibility guidelines: ${error.message}`);
      throw error;
    }

    return data.map(item => ({
      componentType: item.component_type,
      ariaAttributes: item.aria_attributes,
      keyboardInteractions: item.keyboard_interactions,
      screenReaderRequirements: item.screen_reader_requirements,
      focusManagement: item.focus_management,
      wcagCriteria: item.wcag_criteria
    }));
  },

  // Testing Operations
  async runAccessibilityTest(wireframeId: string, wcagLevel = 'AA'): Promise<AccessibilityTestRun> {
    // Create a new test run
    const testRun = await this.createTestRun({
      wireframeId,
      wcagLevel,
      status: 'running'
    });

    try {
      // In a real implementation, this would use a library like axe-core or pa11y
      // For now, we're just simulating the test

      // Mock some wireframe data to test against
      const { data: wireframeData } = await supabase
        .from('ai_wireframes')
        .select('generation_params')
        .eq('id', wireframeId)
        .single();

      if (!wireframeData) {
        throw new Error('Wireframe not found');
      }

      // Wait a moment to simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock some issues
      const mockIssues: Omit<AccessibilityIssue, 'id'>[] = [
        {
          testRunId: testRun.id!,
          elementId: 'header-nav',
          issueType: 'contrast',
          severity: 'medium',
          description: 'Text has insufficient contrast against background',
          impactDescription: 'Users with low vision may have difficulty reading the text',
          recommendation: 'Increase contrast to at least 4.5:1 for normal text',
          wcagCriterion: '1.4.3',
          status: 'failed'
        },
        {
          testRunId: testRun.id!,
          elementId: 'submit-button',
          issueType: 'keyboard',
          severity: 'high',
          description: 'Button cannot be activated using keyboard',
          impactDescription: 'Keyboard-only users cannot submit the form',
          recommendation: 'Ensure button is focusable and responds to Enter/Space',
          wcagCriterion: '2.1.1',
          status: 'failed'
        },
        {
          testRunId: testRun.id!,
          elementId: 'main-image',
          issueType: 'altText',
          severity: 'medium',
          description: 'Image missing alternative text',
          impactDescription: 'Screen reader users cannot understand the image content',
          recommendation: 'Add descriptive alt text to the image',
          wcagCriterion: '1.1.1',
          status: 'failed'
        }
      ];

      // Save the issues
      for (const issue of mockIssues) {
        await this.saveIssue(issue);
      }

      // Calculate a mock score
      const overallScore = 65; // Out of 100

      // Update the test run with the results
      await this.updateTestRunStatus(testRun.id!, 'completed', overallScore, {
        total_issues: mockIssues.length,
        by_severity: {
          critical: mockIssues.filter(i => i.severity === 'critical').length,
          high: mockIssues.filter(i => i.severity === 'high').length,
          medium: mockIssues.filter(i => i.severity === 'medium').length,
          low: mockIssues.filter(i => i.severity === 'low').length,
          info: mockIssues.filter(i => i.severity === 'info').length
        },
        by_wcag: {
          '1.1.1': mockIssues.filter(i => i.wcagCriterion === '1.1.1').length,
          '1.4.3': mockIssues.filter(i => i.wcagCriterion === '1.4.3').length,
          '2.1.1': mockIssues.filter(i => i.wcagCriterion === '2.1.1').length,
        }
      });

      return {
        ...testRun,
        status: 'completed',
        overallScore
      };
    } catch (error) {
      // Handle errors
      await this.updateTestRunStatus(testRun.id!, 'failed', undefined, { 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }
};
