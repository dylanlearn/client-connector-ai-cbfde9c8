
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { AIMemoryService, MemoryCategory } from '@/services/ai';
import { useMemory } from '@/contexts/ai/MemoryContext';
import { toast } from 'sonner';

export function useMemoryInitialization() {
  const { user } = useAuth();
  const { refreshMemoryContext, isProcessing } = useMemory();
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  /**
   * Initialize the memory system for a new user or after sample data generation
   */
  const initializeMemory = useCallback(async (projectId?: string) => {
    if (!user?.id || isProcessing || isInitializing) return false;
    
    setIsInitializing(true);
    
    try {
      // Add initial design preference memories
      await AIMemoryService.user.store(
        user.id,
        "User prefers clean and minimal design aesthetics",
        MemoryCategory.DesignPreference,
        {
          preferenceType: 'aesthetic',
          preference: 'clean',
          confidence: 0.8,
          timestamp: new Date().toISOString()
        }
      );
      
      // Add initial tone preference memory
      await AIMemoryService.user.store(
        user.id,
        "User prefers a professional but friendly communication tone",
        MemoryCategory.TonePreference,
        {
          preferredTone: 'professional-friendly',
          confidence: 0.7,
          timestamp: new Date().toISOString()
        }
      );
      
      // If a project ID is provided, add project-specific memory
      if (projectId) {
        await AIMemoryService.project.store(
          projectId,
          user.id,
          "Initial project context for design approach",
          MemoryCategory.ProjectContext,
          {
            contextType: 'design-approach',
            importance: 'high',
            timestamp: new Date().toISOString()
          }
        );
      }
      
      // Refresh memory context to include the new memories
      await refreshMemoryContext(projectId);
      
      setIsInitialized(true);
      return true;
    } catch (error) {
      console.error("Error initializing memory system:", error);
      toast.error("Memory system initialization failed", {
        description: "We encountered an issue setting up your design preferences. Some personalization features may be limited.",
      });
      return false;
    } finally {
      setIsInitializing(false);
    }
  }, [user, isProcessing, isInitializing, refreshMemoryContext]);
  
  /**
   * Check if the memory system has been initialized for this user
   */
  const checkMemoryInitialization = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const memories = await AIMemoryService.user.get(user.id, {
        limit: 1 // Just need to check if any exist
      });
      
      setIsInitialized(memories.length > 0);
    } catch (error) {
      console.error("Error checking memory initialization:", error);
    }
  }, [user]);
  
  // Check initialization status on mount
  useEffect(() => {
    if (user?.id && !isInitialized) {
      checkMemoryInitialization();
    }
  }, [user, isInitialized, checkMemoryInitialization]);
  
  return {
    initializeMemory,
    isInitializing,
    isInitialized
  };
}
