
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface BrowserConfiguration {
  id: string;
  name: string;
  browserType: string;
  browserVersion: string;
  deviceType: string;
  viewportWidth: number;
  viewportHeight: number;
  userAgent?: string;
  isActive: boolean;
}

export interface BrowserTestSession {
  id: string;
  wireframeId: string;
  configuration?: BrowserConfiguration;
  status: string;
  startedAt: string;
  completedAt?: string;
  screenshotUrl?: string;
  resultsSummary?: {
    passed: number;
    failed: number;
    warning: number;
    total: number;
  };
}

export interface BrowserTestResult {
  id: string;
  sessionId: string;
  elementId?: string;
  elementSelector?: string;
  testType: string;
  status: 'passed' | 'failed' | 'warning' | 'not_applicable';
  expectedResult?: string;
  actualResult?: string;
  screenshotUrl?: string;
  details?: {
    notes?: string;
    renderingIssues?: string[];
    browserSpecific?: boolean;
  };
}

export class BrowserTestingService {
  static async getBrowserConfigurations(): Promise<BrowserConfiguration[]> {
    // In a real implementation, this would fetch from the database
    try {
      const { data, error } = await supabase
        .from('browser_test_configurations')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      return data.map((config: any) => ({
        id: config.id,
        name: config.name,
        browserType: config.browser_type,
        browserVersion: config.browser_version,
        deviceType: config.device_type,
        viewportWidth: config.viewport_width,
        viewportHeight: config.viewport_height,
        userAgent: config.user_agent,
        isActive: config.is_active,
      }));
    } catch (error) {
      console.error("Error fetching browser configurations:", error);
      
      // Fallback to default configurations if DB fetch fails
      return [
        {
          id: '1',
          name: 'Chrome (Desktop)',
          browserType: 'chrome',
          browserVersion: '120',
          deviceType: 'desktop',
          viewportWidth: 1920,
          viewportHeight: 1080,
          isActive: true,
        },
        {
          id: '2',
          name: 'Firefox (Desktop)',
          browserType: 'firefox',
          browserVersion: '117',
          deviceType: 'desktop',
          viewportWidth: 1920,
          viewportHeight: 1080,
          isActive: true,
        },
        {
          id: '3',
          name: 'Safari (Desktop)',
          browserType: 'safari',
          browserVersion: '16',
          deviceType: 'desktop',
          viewportWidth: 1680,
          viewportHeight: 1050,
          isActive: true,
        },
        {
          id: '4',
          name: 'Mobile (iPhone)',
          browserType: 'safari',
          browserVersion: '16',
          deviceType: 'mobile',
          viewportWidth: 390,
          viewportHeight: 844,
          isActive: true,
        },
        {
          id: '5',
          name: 'Tablet (iPad)',
          browserType: 'safari',
          browserVersion: '16',
          deviceType: 'tablet',
          viewportWidth: 1024,
          viewportHeight: 768,
          isActive: true,
        },
      ];
    }
  }
  
  static async getTestSessions(wireframeId: string): Promise<BrowserTestSession[]> {
    try {
      const { data, error } = await supabase
        .from('browser_test_sessions')
        .select(`
          *,
          configuration:configuration_id(*)
        `)
        .eq('wireframe_id', wireframeId)
        .order('started_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map((session: any) => ({
        id: session.id,
        wireframeId: session.wireframe_id,
        configuration: session.configuration ? {
          id: session.configuration.id,
          name: session.configuration.name,
          browserType: session.configuration.browser_type,
          browserVersion: session.configuration.browser_version,
          deviceType: session.configuration.device_type,
          viewportWidth: session.configuration.viewport_width,
          viewportHeight: session.configuration.viewport_height,
          userAgent: session.configuration.user_agent,
          isActive: session.configuration.is_active,
        } : undefined,
        status: session.status,
        startedAt: session.started_at,
        completedAt: session.completed_at,
        screenshotUrl: session.screenshot_url,
        resultsSummary: session.results_summary,
      }));
    } catch (error) {
      console.error("Error fetching test sessions:", error);
      
      // Return empty array if there's an error
      return [];
    }
  }
  
  static async getTestResults(sessionId: string): Promise<BrowserTestResult[]> {
    try {
      const { data, error } = await supabase
        .from('browser_test_results')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      return data.map((result: any) => ({
        id: result.id,
        sessionId: result.session_id,
        elementId: result.element_id,
        elementSelector: result.element_selector,
        testType: result.test_type,
        status: result.status, // This is now a string literal type
        expectedResult: result.expected_result,
        actualResult: result.actual_result,
        screenshotUrl: result.screenshot_url,
        details: result.details,
      }));
    } catch (error) {
      console.error("Error fetching test results:", error);
      
      // Return empty array if there's an error
      return [];
    }
  }
  
  static async runBrowserTest(wireframeId: string, configurationId: string): Promise<BrowserTestSession> {
    try {
      // In a real implementation, this would start an actual browser test
      // and return real results. For demo purposes, we're generating mock data.
      
      // Create a new test session
      const sessionId = uuidv4();
      const startedAt = new Date().toISOString();
      
      // Get the configuration
      const { data: configData, error: configError } = await supabase
        .from('browser_test_configurations')
        .select('*')
        .eq('id', configurationId)
        .single();
      
      if (configError) throw configError;
      
      // Mock some test results
      const testTypes = [
        'Element Rendering', 'Layout Consistency', 'Interactive Elements',
        'Font Rendering', 'Image Rendering', 'Responsive Behavior'
      ];
      
      const results = [];
      let passedCount = 0;
      let failedCount = 0;
      let warningCount = 0;
      
      for (const testType of testTypes) {
        const status = Math.random() > 0.7 ? 
          (Math.random() > 0.5 ? 'warning' : 'failed') : 'passed';
        
        if (status === 'passed') passedCount++;
        else if (status === 'failed') failedCount++;
        else warningCount++;
        
        results.push({
          id: uuidv4(),
          session_id: sessionId,
          test_type: testType,
          status: status,
          expected_result: 'Proper rendering and functionality',
          actual_result: status === 'passed' ? 
            'Renders correctly' : 
            'Rendering issues detected',
          details: {
            notes: status === 'passed' ? 
              'Element renders as expected' : 
              'Some rendering inconsistencies found',
            renderingIssues: status === 'passed' ? [] : ['Alignment issue', 'Color rendering'],
            browserSpecific: status !== 'passed'
          },
          created_at: new Date().toISOString()
        });
      }
      
      // Insert the results
      const { error: resultsError } = await supabase
        .from('browser_test_results')
        .insert(results);
      
      if (resultsError) throw resultsError;
      
      // Create a summary
      const resultsSummary = {
        passed: passedCount,
        failed: failedCount,
        warning: warningCount,
        total: testTypes.length
      };
      
      // Update the session with results
      const { data: sessionData, error: sessionError } = await supabase
        .from('browser_test_sessions')
        .insert([
          {
            id: sessionId,
            wireframe_id: wireframeId,
            configuration_id: configurationId,
            status: 'completed',
            started_at: startedAt,
            completed_at: new Date().toISOString(),
            screenshot_url: 'https://via.placeholder.com/800x600?text=Browser+Test+Screenshot',
            results_summary: resultsSummary
          }
        ])
        .select()
        .single();
      
      if (sessionError) throw sessionError;
      
      // Return the session with the configuration
      return {
        id: sessionId,
        wireframeId: wireframeId,
        configuration: {
          id: configData.id,
          name: configData.name,
          browserType: configData.browser_type,
          browserVersion: configData.browser_version,
          deviceType: configData.device_type,
          viewportWidth: configData.viewport_width,
          viewportHeight: configData.viewport_height,
          userAgent: configData.user_agent,
          isActive: configData.is_active,
        },
        status: 'completed',
        startedAt: startedAt,
        completedAt: new Date().toISOString(),
        screenshotUrl: 'https://via.placeholder.com/800x600?text=Browser+Test+Screenshot',
        resultsSummary: resultsSummary
      };
    } catch (error) {
      console.error("Error running browser test:", error);
      throw error;
    }
  }
}
