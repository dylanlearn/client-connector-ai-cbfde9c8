
import { supabase } from "@/integrations/supabase/client";
import { AnimationCategory, AnimationPerformanceMetrics } from "@/types/animations";

// Interface for tracking events
interface AnimationTrackingEvent {
  animation_type: AnimationCategory;
  duration?: number;
  device_info: {
    deviceType?: string;
    browser?: string;
    os?: string;
    viewport?: {
      width: number;
      height: number;
    };
  };
  performance_metrics?: AnimationPerformanceMetrics;
  feedback?: 'positive' | 'negative' | null;
  timestamp: string;
}

// Animation analytics batch service
class AnimationAnalyticsBatchService {
  private events: AnimationTrackingEvent[] = [];
  private isProcessing = false;
  private maxBatchSize = 20;
  private flushInterval = 30000; // 30 seconds
  private intervalId: number | null = null;
  
  constructor() {
    // Set up interval to flush events periodically
    this.intervalId = window.setInterval(() => {
      this.flushEvents();
    }, this.flushInterval);
  }
  
  // Add an animation tracking event to the batch
  public addEvent(event: AnimationTrackingEvent): void {
    this.events.push({
      ...event,
      timestamp: event.timestamp || new Date().toISOString()
    });
    
    // Flush if we've reached the max batch size
    if (this.events.length >= this.maxBatchSize) {
      this.flushEvents();
    }
  }
  
  // Process all pending events
  public async flushEvents(): Promise<void> {
    if (this.isProcessing || this.events.length === 0) return;
    
    try {
      this.isProcessing = true;
      const eventsToProcess = [...this.events];
      this.events = [];
      
      // Process each event by calling the record_animation_interaction function
      await Promise.all(eventsToProcess.map(event => 
        supabase.rpc('record_animation_interaction', {
          p_animation_type: event.animation_type,
          p_duration: event.duration,
          p_device_info: event.device_info || {},
          p_performance_metrics: event.performance_metrics || {},
          p_feedback: event.feedback
        })
      ));
      
      console.log(`Successfully flushed ${eventsToProcess.length} animation events`);
    } catch (error) {
      console.error('Error flushing animation events:', error);
      // Put events back in the queue
      this.events = [...this.events, ...this.events];
    } finally {
      this.isProcessing = false;
    }
  }
  
  // Clean up when service is no longer needed
  public cleanup(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.flushEvents();
  }
}

// Create a singleton instance
export const animationAnalyticsService = new AnimationAnalyticsBatchService();

// Helper functions
export const trackAnimationView = (
  animationType: AnimationCategory,
  metrics?: AnimationPerformanceMetrics,
  deviceInfo?: Record<string, any>,
  feedback?: 'positive' | 'negative'
): void => {
  animationAnalyticsService.addEvent({
    animation_type: animationType,
    duration: metrics?.duration,
    device_info: deviceInfo || {},
    performance_metrics: metrics,
    feedback: feedback || null,
    timestamp: new Date().toISOString()
  });
};

// Function to get animation analytics
export const getAnimationAnalytics = async (animationType?: AnimationCategory) => {
  try {
    let query = supabase
      .from('animation_analytics')
      .select('*');
      
    if (animationType) {
      query = query.eq('animation_type', animationType);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching animation analytics:', error);
    throw error;
  }
};
