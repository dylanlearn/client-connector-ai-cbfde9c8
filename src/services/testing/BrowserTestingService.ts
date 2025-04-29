
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BrowserConfiguration {
  id?: string;
  name: string;
  browserType: 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'other';
  browserVersion: string;
  deviceType: 'desktop' | 'tablet' | 'mobile';
  viewportWidth: number;
  viewportHeight: number;
  userAgent?: string;
}

export interface BrowserTestSession {
  id?: string;
  wireframeId: string;
  configurationId: string;
  status: string;
  screenshotUrl?: string;
  resultsSummary?: any;
}

export interface BrowserTestResult {
  id?: string;
  sessionId: string;
  elementId?: string;
  elementSelector?: string;
  testType: string;
  status: 'passed' | 'failed' | 'warning' | 'not_applicable' | 'not_tested';
  expectedResult?: string;
  actualResult?: string;
  screenshotUrl?: string;
  details?: any;
}

export const BrowserTestingService = {
  // Configuration Management
  async getConfigurations(): Promise<BrowserConfiguration[]> {
    const { data, error } = await supabase
      .from('browser_test_configurations')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      toast.error(`Error fetching browser configurations: ${error.message}`);
      throw error;
    }

    return data;
  },

  async createConfiguration(config: BrowserConfiguration): Promise<BrowserConfiguration> {
    const { data, error } = await supabase
      .from('browser_test_configurations')
      .insert([config])
      .select()
      .single();

    if (error) {
      toast.error(`Error creating browser configuration: ${error.message}`);
      throw error;
    }

    toast.success('Browser configuration created successfully');
    return data;
  },

  // Test Sessions
  async createTestSession(session: BrowserTestSession): Promise<BrowserTestSession> {
    const { data, error } = await supabase
      .from('browser_test_sessions')
      .insert([session])
      .select()
      .single();

    if (error) {
      toast.error(`Error creating test session: ${error.message}`);
      throw error;
    }

    return data;
  },

  async getTestSessions(wireframeId: string): Promise<BrowserTestSession[]> {
    const { data, error } = await supabase
      .from('browser_test_sessions')
      .select(`
        *,
        browser_test_configurations (*)
      `)
      .eq('wireframe_id', wireframeId)
      .order('started_at', { ascending: false });

    if (error) {
      toast.error(`Error fetching test sessions: ${error.message}`);
      throw error;
    }

    return data;
  },

  async updateSessionStatus(sessionId: string, status: string, resultsSummary?: any): Promise<void> {
    const updateData: any = { 
      status, 
      completed_at: new Date().toISOString() 
    };

    if (resultsSummary) {
      updateData.results_summary = resultsSummary;
    }

    const { error } = await supabase
      .from('browser_test_sessions')
      .update(updateData)
      .eq('id', sessionId);

    if (error) {
      toast.error(`Error updating test session: ${error.message}`);
      throw error;
    }

    toast.success('Test session updated successfully');
  },

  // Test Results
  async saveTestResult(result: BrowserTestResult): Promise<BrowserTestResult> {
    const { data, error } = await supabase
      .from('browser_test_results')
      .insert([result])
      .select()
      .single();

    if (error) {
      toast.error(`Error saving test result: ${error.message}`);
      throw error;
    }

    return data;
  },

  async getTestResults(sessionId: string): Promise<BrowserTestResult[]> {
    const { data, error } = await supabase
      .from('browser_test_results')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at');

    if (error) {
      toast.error(`Error fetching test results: ${error.message}`);
      throw error;
    }

    return data;
  },

  // Testing Operations
  async runBrowserTest(wireframeId: string, configurationId: string): Promise<BrowserTestSession> {
    // Create a new test session
    const session = await this.createTestSession({
      wireframeId,
      configurationId,
      status: 'running',
    });

    try {
      // In a real implementation, this would use a headless browser service
      // like Puppeteer, Playwright, or a service like BrowserStack or Selenium Grid
      
      // For now, we're just simulating the test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock results for demonstration
      const results = [
        {
          sessionId: session.id!,
          testType: 'rendering',
          status: 'passed' as const,
          details: { notes: 'All elements rendered correctly' }
        },
        {
          sessionId: session.id!,
          testType: 'interaction',
          status: 'passed' as const,
          details: { notes: 'Button interactions working as expected' }
        }
      ];
      
      // Save test results
      for (const result of results) {
        await this.saveTestResult(result);
      }
      
      // Update session status
      await this.updateSessionStatus(session.id!, 'completed', {
        tests_run: results.length,
        tests_passed: results.filter(r => r.status === 'passed').length,
        tests_failed: results.filter(r => r.status === 'failed').length,
      });
      
      return session;
    } catch (error) {
      // Handle errors
      await this.updateSessionStatus(session.id!, 'failed', { 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }
};
