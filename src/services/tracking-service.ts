
import { supabase } from "@/integrations/supabase/client";
import { InteractionEvent, InteractionEventType } from "@/types/interactions";
import { batchService } from "./analytics/batch-interaction-service";
import { getSessionId, createTrackingEvent, getElementSelector } from "@/utils/interaction-utils";

/**
 * Service for tracking user interactions and analytics
 */
export const TrackingService = {
  /**
   * Track a generic interaction event
   */
  trackInteraction(
    userId: string,
    eventType: InteractionEventType,
    position: { x: number, y: number },
    elementSelector?: string,
    metadata?: Record<string, any>
  ): void {
    if (!userId) return;
    
    try {
      const sessionId = getSessionId();
      const event = createTrackingEvent(
        userId,
        eventType,
        position,
        sessionId,
        elementSelector,
        metadata
      );
      
      // Add to batch service for efficient processing
      batchService.addEvent(event);
    } catch (err) {
      console.error('Failed to track interaction:', err);
    }
  },

  /**
   * Track a click event
   */
  trackClick(
    userId: string,
    event: MouseEvent,
    metadata?: Record<string, any>
  ): void {
    if (!userId) return;
    
    const position = { 
      x: event.clientX, 
      y: event.clientY 
    };
    
    // Get the element that was clicked
    const element = event.target as HTMLElement;
    const selector = getElementSelector(element);
    
    // Get text content as additional context
    let textContent = element.textContent?.trim() || '';
    if (textContent.length > 50) {
      textContent = textContent.substring(0, 50) + '...';
    }
    
    // Enhanced metadata
    const enhancedMetadata = {
      ...metadata,
      textContent,
      tagName: element.tagName.toLowerCase(),
      className: element.className
    };
    
    this.trackInteraction(userId, 'click', position, selector, enhancedMetadata);
  },

  /**
   * Track page view
   */
  trackPageView(
    userId: string,
    metadata?: Record<string, any>
  ): void {
    if (!userId) return;
    
    // Center of viewport
    const viewportCenter = {
      x: Math.round(window.innerWidth / 2),
      y: Math.round(window.innerHeight / 2)
    };
    
    this.trackInteraction(userId, 'view', viewportCenter, 'document', metadata);
  },

  /**
   * Get user interaction summary
   */
  async getUserInteractionSummary(userId: string, days: number = 7): Promise<Record<string, number>> {
    try {
      const { data, error } = await supabase.rpc('get_user_interaction_summary', {
        user_id_param: userId,
        days_param: days
      });
      
      if (error) throw error;
      
      return data || {
        clicks: 0,
        views: 0,
        scrolls: 0
      };
    } catch (err) {
      console.error('Error getting interaction summary:', err);
      return {
        clicks: 0,
        views: 0,
        scrolls: 0
      };
    }
  }
};
