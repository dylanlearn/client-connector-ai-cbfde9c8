
import { useState, useEffect, useCallback } from 'react';
import { 
  WireframeMemoryService, 
  DesignMemoryResponse,
  DesignMemoryData
} from '@/services/ai/wireframe/wireframe-memory-service';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface UseDesignMemoryProps {
  projectId?: string;
}

export function useDesignMemory({ projectId }: UseDesignMemoryProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [designMemory, setDesignMemory] = useState<DesignMemoryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchDesignMemory = useCallback(async () => {
    if (!projectId || !user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const memory = await WireframeMemoryService.getDesignMemory(projectId);
      setDesignMemory(memory);
      return memory;
    } catch (err: any) {
      console.error('Error fetching design memory:', err);
      setError(err.message || 'Failed to load design memory');
      toast({
        title: "Error",
        description: "Failed to load design memory",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [projectId, user, toast]);

  const saveDesignMemory = useCallback(async (
    memoryData: Partial<Omit<DesignMemoryData, 'projectId'>> & { projectId?: string }
  ) => {
    const effectiveProjectId = memoryData.projectId || projectId;
    
    if (!effectiveProjectId || !user) {
      toast({
        title: "Error",
        description: "Project ID is required to save design memory",
        variant: "destructive"
      });
      return null;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      // Check if we already have a design memory for this project
      if (designMemory?.id) {
        // Update existing entry
        const result = await WireframeMemoryService.updateDesignMemory({
          memoryId: designMemory.id,
          updates: {
            blueprint_id: memoryData.blueprintId,
            layout_patterns: memoryData.layoutPatterns,
            style_preferences: memoryData.stylePreferences,
            component_preferences: memoryData.componentPreferences
          }
        });
        
        setDesignMemory(result);
        return result;
      } else {
        // Create new entry
        const result = await WireframeMemoryService.storeDesignMemory({
          projectId: effectiveProjectId,
          blueprintId: memoryData.blueprintId,
          layoutPatterns: memoryData.layoutPatterns,
          stylePreferences: memoryData.stylePreferences,
          componentPreferences: memoryData.componentPreferences
        });
        
        setDesignMemory(result);
        return result;
      }
    } catch (err: any) {
      console.error('Error saving design memory:', err);
      setError(err.message || 'Failed to save design memory');
      toast({
        title: "Error",
        description: "Failed to save design memory",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [projectId, user, designMemory, toast]);

  // Fetch design memory when component mounts
  useEffect(() => {
    if (projectId && user) {
      fetchDesignMemory();
    }
  }, [projectId, user?.id, fetchDesignMemory]);

  // Set up real-time subscription for design memory changes
  useEffect(() => {
    if (!projectId || !user) return;
    
    const subscription = supabase
      .channel('design_memory_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'wireframe_design_memory',
          filter: `project_id=eq.${projectId}` 
        }, 
        (payload) => {
          console.log('Design memory changed:', payload);
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            fetchDesignMemory();
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [projectId, user?.id, fetchDesignMemory]);

  return {
    designMemory,
    isLoading,
    isSaving,
    error,
    fetchDesignMemory,
    saveDesignMemory
  };
}
