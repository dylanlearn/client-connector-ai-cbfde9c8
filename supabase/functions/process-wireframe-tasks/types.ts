
/**
 * Types for wireframe task processing
 */

export interface BackgroundTask {
  id: string;
  task_type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
  error_message?: string;
  input_data: any;
  output_data?: any;
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
