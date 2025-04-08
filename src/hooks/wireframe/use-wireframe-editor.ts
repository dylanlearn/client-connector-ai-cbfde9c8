
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { 
  WireframeProject, 
  WireframeCanvas, 
  WireframeComponent,
  WireframeMemoryService 
} from '@/services/ai/wireframe/wireframe-memory-service';
import { supabase } from '@/integrations/supabase/client';

export function useWireframeEditor(projectId?: string, canvasId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<WireframeProject | null>(null);
  const [canvas, setCanvas] = useState<WireframeCanvas | null>(null);
  const [components, setComponents] = useState<WireframeComponent[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  
  // Get the currently selected component
  const selectedComponent = components.find(c => c.id === selectedComponentId) || null;

  // Initialize the editor with a project and canvas
  const initializeEditor = useCallback(async (projectId?: string) => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    
    try {
      // Use existing project or create a new one
      let currentProject = null;
      if (projectId) {
        currentProject = await WireframeMemoryService.getProject(projectId);
        if (!currentProject) {
          throw new Error('Project not found');
        }
      } else {
        currentProject = await WireframeMemoryService.createProject('New Wireframe Project');
      }
      setProject(currentProject);

      // Get canvases for this project or create one if none exist
      const canvases = await WireframeMemoryService.getCanvases(currentProject.id);
      let currentCanvas = null;
      
      if (canvasId && canvases.some(c => c.id === canvasId)) {
        currentCanvas = canvases.find(c => c.id === canvasId) || null;
      } else if (canvases.length > 0) {
        currentCanvas = canvases[0];
      } else {
        currentCanvas = await WireframeMemoryService.createCanvas(
          currentProject.id, 
          'Main Canvas'
        );
      }
      
      setCanvas(currentCanvas);
      
      // Load components if we have a canvas
      if (currentCanvas) {
        const canvasComponents = await WireframeMemoryService.getComponents(currentCanvas.id);
        setComponents(canvasComponents);
      }
    } catch (error: any) {
      console.error('Error initializing wireframe editor:', error);
      setError(error.message || 'Failed to initialize wireframe editor');
      toast({
        title: 'Error',
        description: 'Failed to initialize wireframe editor',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast, canvasId]);
  
  // Update canvas settings (zoom, pan, grid)
  const updateCanvasSettings = useCallback(async (
    updates: Partial<Pick<WireframeCanvas, 'zoom_level' | 'pan_offset' | 'grid_settings'>>
  ) => {
    if (!canvas) return null;
    
    try {
      const updatedCanvas = await WireframeMemoryService.updateCanvasState(canvas.id, updates);
      if (updatedCanvas) {
        setCanvas(updatedCanvas);
      }
      return updatedCanvas;
    } catch (error: any) {
      console.error('Error updating canvas settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update canvas settings',
        variant: 'destructive',
      });
      return null;
    }
  }, [canvas, toast]);
  
  // Add a new component to the canvas
  const addComponent = useCallback(async (
    componentData: Omit<WireframeComponent, 'id' | 'canvas_id'>
  ) => {
    if (!canvas) return null;
    
    try {
      const newComponent = await WireframeMemoryService.addComponent({
        ...componentData,
        canvas_id: canvas.id
      });
      
      if (newComponent) {
        setComponents(prev => [...prev, newComponent]);
        
        // Record this action for undo/redo
        await WireframeMemoryService.recordAction(
          canvas.id,
          'add_component',
          newComponent.id,
          null,
          newComponent
        );
        
        return newComponent;
      }
      return null;
    } catch (error: any) {
      console.error('Error adding component:', error);
      toast({
        title: 'Error',
        description: 'Failed to add component',
        variant: 'destructive',
      });
      return null;
    }
  }, [canvas, toast]);
  
  // Update an existing component
  const updateComponent = useCallback(async (
    componentId: string,
    updates: Partial<Omit<WireframeComponent, 'id' | 'canvas_id'>>
  ) => {
    try {
      // Find the component to update
      const componentToUpdate = components.find(c => c.id === componentId);
      if (!componentToUpdate) return null;
      
      // Store previous state for undo
      const previousState = { ...componentToUpdate };
      
      const updatedComponent = await WireframeMemoryService.updateComponent(
        componentId,
        updates
      );
      
      if (updatedComponent) {
        // Update local state
        setComponents(prev => 
          prev.map(c => c.id === componentId ? updatedComponent : c)
        );
        
        // Record this action for undo/redo
        if (canvas) {
          await WireframeMemoryService.recordAction(
            canvas.id,
            'update_component',
            componentId,
            previousState,
            updatedComponent
          );
        }
        
        return updatedComponent;
      }
      return null;
    } catch (error: any) {
      console.error('Error updating component:', error);
      toast({
        title: 'Error',
        description: 'Failed to update component',
        variant: 'destructive',
      });
      return null;
    }
  }, [components, canvas, toast]);
  
  // Delete a component
  const deleteComponent = useCallback(async (componentId: string) => {
    try {
      if (!canvas) return false;
      
      // Find the component to delete
      const componentToDelete = components.find(c => c.id === componentId);
      if (!componentToDelete) return false;
      
      const { error } = await supabase
        .from('wireframe_canvas_components')
        .delete()
        .eq('id', componentId);
      
      if (error) throw error;
      
      // Update local state
      setComponents(prev => prev.filter(c => c.id !== componentId));
      
      // If the deleted component was selected, clear selection
      if (selectedComponentId === componentId) {
        setSelectedComponentId(null);
      }
      
      // Record this action for undo/redo
      await WireframeMemoryService.recordAction(
        canvas.id,
        'delete_component',
        componentId,
        componentToDelete,
        null
      );
      
      return true;
    } catch (error: any) {
      console.error('Error deleting component:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete component',
        variant: 'destructive',
      });
      return false;
    }
  }, [canvas, components, selectedComponentId, toast]);
  
  // Select a component
  const selectComponent = useCallback((componentId: string | null) => {
    setSelectedComponentId(componentId);
  }, []);

  // Setup real-time subscription for collaborative editing
  useEffect(() => {
    if (!canvas) return;
    
    // Subscribe to changes on the current canvas components
    const componentsChannel = supabase
      .channel(`wireframe-canvas-${canvas.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wireframe_canvas_components',
          filter: `canvas_id=eq.${canvas.id}`
        },
        (payload) => {
          console.log('Component changed:', payload);
          
          // Handle different types of changes
          if (payload.eventType === 'INSERT') {
            const newComponent = payload.new as WireframeComponent;
            setComponents(prev => {
              // Avoid duplicates
              if (prev.some(c => c.id === newComponent.id)) {
                return prev;
              }
              return [...prev, newComponent];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedComponent = payload.new as WireframeComponent;
            setComponents(prev => 
              prev.map(c => c.id === updatedComponent.id ? updatedComponent : c)
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedComponent = payload.old as WireframeComponent;
            setComponents(prev => 
              prev.filter(c => c.id !== deletedComponent.id)
            );
            
            // Clear selection if deleted
            if (selectedComponentId === deletedComponent.id) {
              setSelectedComponentId(null);
            }
          }
        }
      )
      .subscribe();
    
    // Subscribe to canvas state changes
    const canvasChannel = supabase
      .channel(`wireframe-canvas-state-${canvas.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'wireframe_canvas',
          filter: `id=eq.${canvas.id}`
        },
        (payload) => {
          console.log('Canvas state changed:', payload);
          // Only update if it wasn't our own change
          if (payload.new && payload.new.updated_at !== canvas.updated_at) {
            setCanvas(payload.new as WireframeCanvas);
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(componentsChannel);
      supabase.removeChannel(canvasChannel);
    };
  }, [canvas, selectedComponentId]);

  // Initialize editor when projectId changes
  useEffect(() => {
    if (projectId) {
      initializeEditor(projectId);
    }
  }, [projectId, initializeEditor]);

  return {
    isLoading,
    error,
    project,
    canvas,
    components,
    selectedComponent,
    selectedComponentId,
    initializeEditor,
    updateCanvasSettings,
    addComponent,
    updateComponent,
    deleteComponent,
    selectComponent
  };
}
