import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { wireframeMemoryService } from '@/services/ai/wireframe/wireframe-memory-service';
import { v4 as uuidv4 } from 'uuid';

export function useWireframeEditor(projectId: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [projectData, setProjectData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load the wireframe project
  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        // Create a default project if no ID provided
        setProjectData({
          id: uuidv4(),
          title: 'New Wireframe Project',
          description: '',
          settings: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Try to fetch the project
        const project = await wireframeMemoryService.getProject(projectId)
          .catch(err => {
            // If project not found, create a default project
            console.warn(`Project ${projectId} not found, creating default:`, err);
            return {
              id: projectId,
              title: 'New Wireframe Project',
              description: '',
              settings: {},
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
          });

        setProjectData(project);
      } catch (err: any) {
        console.error('Error initializing wireframe editor:', err);
        setError(err.message || 'Failed to load wireframe project');
        
        // Show error toast
        toast({
          title: 'Error loading wireframe editor',
          description: err.message || 'Failed to load wireframe project',
          variant: 'destructive'
        });
        
        // Create a default project on error
        setProjectData({
          id: projectId || uuidv4(),
          title: 'New Wireframe Project',
          description: '',
          settings: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectId, toast]);

  // Save project changes
  const saveProject = useCallback(async (projectData: Partial<any>) => {
    if (!projectId) return;
    
    try {
      setIsLoading(true);
      // Pass both projectId and projectData to saveProject
      const result = await wireframeMemoryService.saveProject(projectId, projectData);
      return result;
    } catch (error) {
      console.error("Error saving project data:", error);
      toast({
        title: "Failed to save project",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [projectId, toast]);

  return {
    isLoading,
    projectData,
    error,
    saveProject,
    setProjectData
  };
}
