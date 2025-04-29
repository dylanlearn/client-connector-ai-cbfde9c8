
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
  createdAt: string;
  updatedAt: string;
}

export interface BrowserTestSession {
  id: string;
  wireframeId: string;
  configurationId: string;
  startedAt: string;
  completedAt?: string;
  status: string;
  screenshotUrl?: string;
  resultsSummary?: {
    passed: number;
    failed: number;
    warnings: number;
  };
  configuration?: BrowserConfiguration;
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
  details?: Record<string, any>;
}

export class BrowserTestingService {
  static async getConfigurations(): Promise<BrowserConfiguration[]> {
    // In a real app, this would call an API
    // Mock implementation for demo purposes
    return [
      {
        id: "1",
        name: "Chrome Desktop",
        browserType: "chrome",
        browserVersion: "latest",
        deviceType: "desktop",
        viewportWidth: 1920,
        viewportHeight: 1080,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "2",
        name: "Safari Mobile",
        browserType: "safari",
        browserVersion: "latest",
        deviceType: "mobile",
        viewportWidth: 375,
        viewportHeight: 812,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "3",
        name: "Edge Desktop",
        browserType: "edge",
        browserVersion: "latest",
        deviceType: "desktop",
        viewportWidth: 1366,
        viewportHeight: 768,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  static async getSessions(wireframeId: string): Promise<BrowserTestSession[]> {
    // Mock implementation
    return [
      {
        id: "s1",
        wireframeId,
        configurationId: "1",
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        completedAt: new Date(Date.now() - 3540000).toISOString(),
        status: "completed",
        screenshotUrl: "https://via.placeholder.com/800x600?text=Chrome+Test",
        resultsSummary: {
          passed: 42,
          failed: 2,
          warnings: 3
        },
        configuration: {
          id: "1",
          name: "Chrome Desktop",
          browserType: "chrome",
          browserVersion: "latest",
          deviceType: "desktop",
          viewportWidth: 1920,
          viewportHeight: 1080,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      },
      {
        id: "s2",
        wireframeId,
        configurationId: "2",
        startedAt: new Date(Date.now() - 7200000).toISOString(),
        completedAt: new Date(Date.now() - 7140000).toISOString(),
        status: "completed",
        screenshotUrl: "https://via.placeholder.com/375x812?text=Safari+Mobile",
        resultsSummary: {
          passed: 38,
          failed: 5,
          warnings: 1
        },
        configuration: {
          id: "2",
          name: "Safari Mobile",
          browserType: "safari",
          browserVersion: "latest",
          deviceType: "mobile",
          viewportWidth: 375,
          viewportHeight: 812,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    ];
  }

  static async createTestSession(wireframeId: string, configurationId: string): Promise<BrowserTestSession> {
    // Mock implementation - in real app would create via API
    return {
      id: `session-${Date.now()}`,
      wireframeId,
      configurationId,
      startedAt: new Date().toISOString(),
      status: "in_progress"
    };
  }

  static async getTestResults(sessionId: string): Promise<BrowserTestResult[]> {
    // Mock data
    return [
      {
        id: "r1",
        sessionId,
        elementId: "header-nav",
        testType: "Element Rendering",
        status: "passed",
        details: { renderTime: "120ms" }
      },
      {
        id: "r2",
        sessionId,
        elementId: "login-form",
        testType: "Interactive Element",
        status: "warning",
        details: { issue: "Slow response time on click" }
      },
      {
        id: "r3",
        sessionId,
        elementId: "product-carousel",
        testType: "Animation Performance",
        status: "failed",
        expectedResult: "Smooth scrolling",
        actualResult: "Stuttering on Safari",
        details: { frameRate: "12fps" }
      }
    ];
  }

  static getStatusBadgeColor(status: string): string {
    if (status === "passed") return "bg-green-100 text-green-800 border-green-200";
    if (status === "failed") return "bg-red-100 text-red-800 border-red-200";
    if (status === "warning") return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-slate-100 text-slate-800 border-slate-200";
  }
}
