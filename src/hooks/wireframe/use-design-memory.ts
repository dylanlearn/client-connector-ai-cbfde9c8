import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { wireframeMemoryService } from '@/services/ai/wireframe/wireframe-memory-service';
import { DesignMemoryResponse, DesignMemoryData } from '@/services/ai/wireframe/wireframe-types';

interface UseDesignMemoryProps {
  projectId?: string;
}

export function useDesignMemory({ projectId }: UseDesignMemoryProps = {}) {
  const [designMemory, setDesignMemory] = useState<DesignMemoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  const loadDesignMemory = useCallback(async (currentProjectId?: string) => {
    if (!currentProjectId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const memory = await wireframeMemoryService.getDesignMemory(currentProjectId);
      setDesignMemory(memory);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: "Failed to load design memory",
        description: String(err),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  const storeDesignMemory = useCallback(async (data: DesignMemoryData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const memory = await wireframeMemoryService.storeDesignMemory(data);
      setDesignMemory(memory);
      toast({
        title: "Design memory stored",
        description: "Your design preferences have been saved."
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: "Failed to store design memory",
        description: String(err),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  const updateDesignMemory = useCallback(async ({
    memoryId,
    updates
  }: {
    memoryId: string;
    updates: Partial<Omit<DesignMemoryData, 'projectId'>>;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const memory = await wireframeMemoryService.updateDesignMemory({ memoryId, updates });
      setDesignMemory(memory);
      toast({
        title: "Design memory updated",
        description: "Your design preferences have been updated."
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: "Failed to update design memory",
        description: String(err),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    if (projectId) {
      loadDesignMemory(projectId);
    }
  }, [projectId, loadDesignMemory]);
  
  return {
    designMemory,
    isLoading,
    error,
    loadDesignMemory,
    storeDesignMemory,
    updateDesignMemory
  };
}
