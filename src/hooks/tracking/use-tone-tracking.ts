
import { useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMemory } from "@/contexts/ai/MemoryContext";
import { MemoryCategory } from "@/services/ai/memory";

/**
 * Hook for tracking tone preferences
 */
export const useToneTracking = () => {
  const { user } = useAuth();
  const { storeMemory } = useMemory();
  
  /**
   * Track tone preferences based on user interactions with text content
   */
  const trackTonePreference = useCallback((
    content: string,
    rating: number,
    context?: string
  ) => {
    if (!user) return;
    
    // Store tone preference in memory
    storeMemory(
      content,
      MemoryCategory.TonePreference,
      undefined,
      {
        rating,
        context,
        timestamp: new Date().toISOString()
      }
    );
    
    console.log('Tone preference tracked:', { content, rating, context });
  }, [user, storeMemory]);

  return {
    trackTonePreference
  };
};
