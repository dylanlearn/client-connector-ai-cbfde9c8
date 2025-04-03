
import { supabase } from "@/integrations/supabase/client";

class InteractionBatchService {
  private events: any[] = [];
  private isProcessing = false;
  private maxBatchSize = 25;
  private flushInterval = 10000; // 10 seconds
  private intervalId: number | null = null;
  
  constructor() {
    // Set up interval to flush events periodically
    this.intervalId = window.setInterval(() => {
      this.flushEvents();
    }, this.flushInterval);
  }
  
  public addEvent(event: any): void {
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
      const { error } = await supabase.functions.invoke('interaction-db-functions', {
        body: { 
          action: 'batch_insert',
          events: eventsToProcess
        }
      });
      
      if (error) {
        console.error('Error sending batch interactions:', error);
        // Add the events back to the queue
        this.events = [...eventsToProcess, ...this.events];
      } else {
        console.log(`Successfully flushed ${eventsToProcess.length} events`);
      }
    } catch (error) {
      console.error('Error in flushEvents:', error);
      // Add the events back to the queue
      this.events = [...this.events];
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
}

// Create a singleton instance
export const batchService = new InteractionBatchService();
