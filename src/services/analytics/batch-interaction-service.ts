import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

class InteractionBatchService {
  private events: any[] = [];
  private isProcessing = false;
  private maxBatchSize = 25;
  private flushInterval = 10000; // 10 seconds
  private intervalId: number | null = null;
  private retryQueue: any[] = [];
  private maxRetries = 3;
  
  constructor() {
    // Set up interval to flush events periodically
    this.intervalId = window.setInterval(() => {
      this.flushEvents();
      
      // Also retry failed events
      if (this.retryQueue.length > 0) {
        this.retryFailedEvents();
      }
    }, this.flushInterval);
  }
  
  public addEvent(event: any): void {
    // Basic validation before adding to queue
    if (!event || !event.user_id || !event.event_type) {
      console.warn('Invalid event data, skipping:', event);
      return;
    }
    
    this.events.push(event);
    
    // Flush if we've reached the max batch size
    if (this.events.length >= this.maxBatchSize) {
      this.flushEvents();
    }
  }
  
  public async flushEvents(): Promise<void> {
    if (this.isProcessing || this.events.length === 0) return;
    
    try {
      this.isProcessing = true;
      const eventsToProcess = [...this.events];
      this.events = []; // Clear the queue
      
      // Batch insert through edge function
      const { data, error } = await supabase.functions.invoke('interaction-db-functions', {
        body: { 
          action: 'batch_insert',
          events: eventsToProcess
        }
      });
      
      if (error) {
        console.error('Error sending batch interactions:', error);
        // Add the events to retry queue
        this.addToRetryQueue(eventsToProcess);
      } else if (data?.warning) {
        console.warn(`Partially succeeded: ${data.successfully_inserted} events inserted, ${data.failed_events?.length} failed`);
        
        // Add only failed events to retry queue
        if (data.failed_events && data.failed_events.length > 0) {
          const failedEventData = data.failed_events.map((item: any) => item.event);
          this.addToRetryQueue(failedEventData);
        }
      } else {
        console.log(`Successfully flushed ${eventsToProcess.length} events`);
      }
    } catch (error) {
      console.error('Error in flushEvents:', error);
      // Add the events to retry queue
      this.addToRetryQueue([...this.events]);
    } finally {
      this.isProcessing = false;
    }
  }
  
  private addToRetryQueue(events: any[]): void {
    // Add events to retry queue with retry count
    this.retryQueue.push(...events.map(event => ({
      event,
      retryCount: 0,
      lastRetry: Date.now()
    })));
    
    // Cap retry queue size to prevent memory issues
    if (this.retryQueue.length > 100) {
      console.warn(`Retry queue exceeds 100 items, dropping oldest ${this.retryQueue.length - 100} items`);
      this.retryQueue = this.retryQueue.slice(this.retryQueue.length - 100);
    }
  }
  
  private async retryFailedEvents(): Promise<void> {
    if (this.isProcessing || this.retryQueue.length === 0) return;
    
    try {
      this.isProcessing = true;
      
      // Get items ready for retry (wait at least 5 seconds between retries)
      const now = Date.now();
      const itemsToRetry = this.retryQueue.filter(item => 
        item.retryCount < this.maxRetries && (now - item.lastRetry) > 5000
      );
      
      if (itemsToRetry.length === 0) {
        return;
      }
      
      console.log(`Retrying ${itemsToRetry.length} failed events`);
      
      const eventsToRetry = itemsToRetry.map(item => item.event);
      
      // Batch insert through edge function
      const { data, error } = await supabase.functions.invoke('interaction-db-functions', {
        body: { 
          action: 'batch_insert',
          events: eventsToRetry
        }
      });
      
      // Update retry counts or remove successful items
      if (error) {
        console.error('Error retrying batch interactions:', error);
        // Update retry counts
        itemsToRetry.forEach(item => {
          item.retryCount++;
          item.lastRetry = now;
        });
      } else if (data?.warning) {
        // Handle partial success - remove successful items, update retry count for failed
        const failedEventIds = new Set(data.failed_events.map((item: any) => item.event.id));
        
        this.retryQueue = this.retryQueue.filter(item => {
          // Keep items not in this retry batch
          if (!itemsToRetry.includes(item)) {
            return true;
          }
          
          // For items in this batch, keep only failed ones and update retry count
          if (failedEventIds.has(item.event.id)) {
            item.retryCount++;
            item.lastRetry = now;
            return true;
          }
          
          // Remove successful items
          return false;
        });
      } else {
        // All successful - remove these items from retry queue
        this.retryQueue = this.retryQueue.filter(item => !itemsToRetry.includes(item));
        console.log(`Successfully retried ${itemsToRetry.length} events`);
      }
      
      // Check if we have items that exceeded max retries
      const failedPermanently = this.retryQueue.filter(item => item.retryCount >= this.maxRetries);
      if (failedPermanently.length > 0) {
        console.error(`${failedPermanently.length} events failed permanently after ${this.maxRetries} retries`);
        
        // Remove permanently failed items
        this.retryQueue = this.retryQueue.filter(item => item.retryCount < this.maxRetries);
        
        // Show a toast notification for user if we're missing a significant amount of data
        if (failedPermanently.length > 10) {
          toast.error("Some analytics data couldn't be saved", {
            description: "There was an issue saving some interaction data. This won't affect your work.",
            duration: 5000,
          });
        }
      }
    } catch (error) {
      console.error('Error retrying failed events:', error);
    } finally {
      this.isProcessing = false;
    }
  }
  
  public cleanup(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.flushEvents();
  }
  
  public getStatus(): { pendingEvents: number, retryQueueSize: number } {
    return {
      pendingEvents: this.events.length,
      retryQueueSize: this.retryQueue.length
    };
  }
}

// Create a singleton instance
export const batchService = new InteractionBatchService();
