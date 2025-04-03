
import { useState, useCallback, useEffect, useRef } from "react";
import { MemoryCategory } from "@/services/ai";
import { useAuth } from "@/hooks/use-auth";
import { useMemoryContext } from "./useMemoryContext";
import { useMemorySubscriptions } from "./realtime/useMemorySubscriptions";
import { useMemoryUpdates } from "./realtime/useMemoryUpdates";

/**
 * Hook for managing real-time memory updates
 */
export const useRealtimeMemory = () => {
  const { user } = useAuth();
  const { memoryContext, setMemoryContext } = useMemoryContext();
  const [isRealtime, setIsRealtime] = useState(false);
  
  // Use refs to store cleanup functions for realtime subscriptions
  const cleanupFunctions = useRef<(() => void)[]>([]);
  
  // Get subscription and update helpers
  const { setupCategorySubscriptions } = useMemorySubscriptions();
  const { updateMemoryContext } = useMemoryUpdates();

  /**
   * Setup real-time subscriptions for memory insights
   */
  const setupRealtimeSubscriptions = useCallback(() => {
    if (!user?.id) return;
    
    // Clear any existing subscriptions
    cleanupFunctions.current.forEach(cleanup => cleanup());
    cleanupFunctions.current = [];
    
    // Categories to subscribe to
    const categories = [
      MemoryCategory.TonePreference,
      MemoryCategory.ColorPreference,
      MemoryCategory.LayoutPreference,
      MemoryCategory.ClientFeedback
    ];
    
    // Create a handler that will update memory context
    const handleCategoryUpdate = (category: MemoryCategory, insights: string[]) => {
      updateMemoryContext(setMemoryContext, category, insights);
    };
    
    // Create subscriptions for each category
    const cleanups = setupCategorySubscriptions(categories, handleCategoryUpdate);
    cleanupFunctions.current = cleanups;
    
    setIsRealtime(true);
    
    return () => {
      cleanupFunctions.current.forEach(cleanup => cleanup());
      cleanupFunctions.current = [];
      setIsRealtime(false);
    };
  }, [user, setupCategorySubscriptions, updateMemoryContext, setMemoryContext]);

  /**
   * Reset the real-time subscriptions
   */
  const resetRealtimeSubscriptions = useCallback(() => {
    cleanupFunctions.current.forEach(cleanup => cleanup());
    cleanupFunctions.current = [];
    setIsRealtime(false);
  }, []);

  // Set up realtime subscriptions when user is available
  useEffect(() => {
    if (user?.id) {
      const cleanup = setupRealtimeSubscriptions();
      return cleanup;
    }
  }, [user, setupRealtimeSubscriptions]);

  return {
    isRealtime,
    setupRealtimeSubscriptions,
    resetRealtimeSubscriptions
  };
};
