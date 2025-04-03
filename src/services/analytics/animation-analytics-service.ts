
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
      // Put events back in the queue
      this.events = [...this.events];
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
    const { data, error } = await supabase
      .from('animation_analytics')
      .select('*')
      .eq(animationType ? 'animation_type' : 'animation_type', animationType || '')
      .then(response => {
        if (animationType) {
          // Filter on client side if we provided an animation type
          return {
            ...response,
            data: response.data?.filter(item => item.animation_type === animationType)
          };
        }
        return response;
      });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching animation analytics:', error);
    throw error;
  }
};
