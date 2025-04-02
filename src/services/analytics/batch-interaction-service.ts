
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Service for handling batched interaction events
 */
export class BatchInteractionService {
  private batchedEvents: any[] = [];
  private isProcessingBatch: boolean = false;

  /**
   * Add event to the batch queue
   */
  addEvent(event: any): void {
    this.batchedEvents.push(event);
  }

  /**
   * Get all events in the batch
   */
  getEvents(): any[] {
    return [...this.batchedEvents];
  }

  /**
   * Clear all events from the batch
   */
  clearEvents(): void {
    this.batchedEvents = [];
  }

  /**
   * Check if batch is currently being processed
   */
  isProcessing(): boolean {
    return this.isProcessingBatch;
  }

  /**
   * Set processing state
   */
  setProcessing(state: boolean): void {
    this.isProcessingBatch = state;
  }

  /**
   * Send all batched events to the server
   */
  async sendBatch(userId: string | undefined): Promise<boolean> {
    if (this.isProcessingBatch || !userId || this.batchedEvents.length === 0) {
      return false;
    }
    
    try {
      this.isProcessingBatch = true;
      
      const eventsToSend = [...this.batchedEvents];
      this.batchedEvents = [];
      
      // Use functions.invoke call for batch insertion
      const { error } = await supabase.functions.invoke(
        'interaction-db-functions', 
        { 
          body: { 
            action: 'batch_insert',
            events: eventsToSend 
          } 
        }
      );
      
      if (error) {
        console.error('Error batch inserting events:', error);
        // Put events back in the queue
        this.batchedEvents = [...eventsToSend, ...this.batchedEvents];
        return false;
      } else {
        console.log(`Successfully sent ${eventsToSend.length} interaction events`);
        return true;
      }
    } catch (err) {
      console.error('Failed to batch send interactions:', err);
      return false;
    } finally {
      this.isProcessingBatch = false;
    }
  }
}

// Create a singleton instance
export const batchService = new BatchInteractionService();
