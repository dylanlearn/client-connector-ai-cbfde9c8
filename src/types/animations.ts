
import { animation_category } from '@/integrations/supabase/types';

export type AnimationCategory = animation_category;

export type AnimationPreference = {
  id: string;
  user_id: string;
  animation_type: AnimationCategory;
  enabled: boolean;
  speed_preference: 'slow' | 'normal' | 'fast';
  intensity_preference: number;
  accessibility_mode: boolean;
  reduced_motion_preference: boolean;
  device_specific_settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export type AnimationAnalytics = {
  id: string;
  animation_type: AnimationCategory;
  view_count: number;
  interaction_count: number;
  average_duration: number;
  engagement_score: number;
  positive_feedback_count: number;
  negative_feedback_count: number;
  performance_metrics: Record<string, any>;
  device_type_metrics: Record<string, number>;
  browser_metrics: Record<string, number>;
  updated_at: string;
  created_at: string;
}

export type AnimationFeedback = 'positive' | 'negative' | 'neutral';

export type AnimationPerformanceMetrics = {
  fps?: number;
  startTime?: number;
  endTime?: number;
  duration?: number;
  memoryUsage?: number;
}

export type AnimationDeviceInfo = {
  deviceType?: string;
  browser?: string;
  os?: string;
  viewport?: {
    width: number;
    height: number;
  }
}
