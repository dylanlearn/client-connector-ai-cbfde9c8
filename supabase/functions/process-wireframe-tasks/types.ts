
/**
 * Types for the wireframe task processing edge function
 */

export interface BackgroundTask {
  id: string;
  task_type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  input_data: Record<string, any>;
  output_data?: Record<string, any>;
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

export interface TaskProcessingResult {
  id: string;
  status: 'completed' | 'failed';
  task_type: string;
  error?: string;
}

export interface ProcessingResponse {
  processed: number;
  results: TaskProcessingResult[];
}

export interface WireframeMetrics {
  total_count: number;
  success_count: number;
  failure_count: number;
  success_rate: number;
  average_generation_time: number;
}

export interface SectionAnalysis {
  section_type: string;
  count: number;
  percentage: number;
}

export interface WireframeCache {
  id: string;
  wireframe_data: Record<string, any>;
}

export interface RateLimitStatus {
  daily_count: number;
  hourly_count: number;
  is_rate_limited: boolean;
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
