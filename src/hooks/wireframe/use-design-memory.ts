
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

interface DesignMemory {
  id: string;
  project_id: string;
  blueprint_id?: string;
  layout_patterns?: any;
  style_preferences?: any;
  component_preferences?: any;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface UseDesignMemoryProps {
  projectId?: string;
}

export function useDesignMemory({ projectId }: UseDesignMemoryProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [designMemory, setDesignMemory] = useState<DesignMemory | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchDesignMemory = async () => {
    if (!projectId || !user) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('design_memory')
        .select('*')
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      setDesignMemory(data);
      return data;
    } catch (err: any) {
      console.error('Error fetching design memory:', err);
      setError(err.message || 'Failed to load design memory');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const saveDesignMemory = async (
    memoryData: Partial<Omit<DesignMemory, 'id' | 'created_at' | 'updated_at' | 'user_id'>>
  ) => {
    if (!projectId || !user) return null;
    
    setIsSaving(true);
    setError(null);
    
    try {
      // Check if we already have a design memory for this project
      if (designMemory?.id) {
        // Update existing entry
        const { data, error } = await supabase
          .from('design_memory')
          .update({
            ...memoryData,
            updated_at: new Date().toISOString()
          })
          .eq('id', designMemory.id)
          .select()
          .single();
        
        if (error) throw error;
        
        setDesignMemory(data);
        return data;
      } else {
        // Create new entry
        const { data, error } = await supabase
          .from('design_memory')
          .insert({
            project_id: projectId,
            user_id: user.id,
            ...memoryData
          })
          .select()
          .single();
        
        if (error) throw error;
        
        setDesignMemory(data);
        return data;
      }
    } catch (err: any) {
      console.error('Error saving design memory:', err);
      setError(err.message || 'Failed to save design memory');
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch design memory when component mounts
  useEffect(() => {
    if (projectId && user) {
      fetchDesignMemory();
    }
  }, [projectId, user?.id]);

  // Set up real-time subscription for design memory changes
  useEffect(() => {
    if (!projectId || !user) return;
    
    const subscription = supabase
      .channel('design_memory_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'design_memory',
          filter: `project_id=eq.${projectId}` 
        }, 
        (payload) => {
          console.log('Design memory changed:', payload);
          fetchDesignMemory();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [projectId, user?.id]);

  return {
    designMemory,
    isLoading,
    isSaving,
    error,
    fetchDesignMemory,
    saveDesignMemory
  };
}
