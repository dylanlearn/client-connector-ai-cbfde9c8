
/**
 * Interface for content generation requests
 */
export interface ContentRequest {
  type: 'header' | 'tagline' | 'cta' | 'description';
  context?: string;
  tone?: string;
  keywords?: string[];
  maxLength?: number;
}

/**
 * Interface for test result data
 */
export interface TestResultData {
  variantId: string;
  successRate: number;
  averageLatency: number;
  sampleSize: number;
}

/**
 * Type for toast adapter to allow mocking in tests
 */
export interface ToastAdapter {
  toast: (props: any) => { id: string; dismiss: () => void; update: (props: any) => void };
}
