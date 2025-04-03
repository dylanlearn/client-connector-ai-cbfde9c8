
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
    
    this.isProcessing = true;
    const eventsToProcess = [...this.events];
    this.events = [];
    
    try {
      // Process events in a batch via the edge function
      await supabase.functions.invoke('animation-tracking', {
        body: { 
          action: 'batch_process',
          events: eventsToProcess
        }
      });
      
      console.log(`Successfully flushed ${eventsToProcess.length} animation events`);
    } catch (error) {
      console.error('Error flushing animation events:', error);
      // Fix: Put events back in the queue correctly
      this.events = [...eventsToProcess, ...this.events];
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
    // Ensure we flush any remaining events before cleanup
    this.flushEvents().catch(err => {
      console.error('Error during final flush:', err);
    });
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
  // Ensure we have at least empty objects for optional parameters
  const safeDeviceInfo = deviceInfo || {};
  const safeMetrics = metrics || {};
  
  animationAnalyticsService.addEvent({
    animation_type: animationType,
    duration: safeMetrics.duration,
    device_info: {
      deviceType: safeDeviceInfo.deviceType || 'unknown',
      browser: safeDeviceInfo.browser || 'unknown',
      os: safeDeviceInfo.os || 'unknown',
      viewport: safeDeviceInfo.viewport || {
        width: window.innerWidth || 0,
        height: window.innerHeight || 0
      }
    },
    performance_metrics: safeMetrics,
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
    
    // Only apply the filter if animation type is provided
    if (animationType) {
      query = query.eq('animation_type', animationType);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // If animation type was provided but not used in the query,
    // filter the results client-side
    if (animationType && data) {
      return data.filter(item => item.animation_type === animationType);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching animation analytics:', error);
    throw error;
  }
};
