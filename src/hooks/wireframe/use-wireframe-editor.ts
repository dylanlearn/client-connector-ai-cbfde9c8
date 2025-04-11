import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import wireframeMemoryService from '@/services/ai/wireframe/wireframe-memory-service';
import { WireframeData, WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import useWireframeHistory from './use-wireframe-history';
import { useToast } from '@/hooks/use-toast';

export function useWireframeEditor(projectId: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [projectData, setProjectData] = useState<WireframeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
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

        const project = await wireframeMemoryService.getProject(projectId)
          .catch(err => {
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
        
        toast({
          title: 'Error loading wireframe editor',
          description: err.message || 'Failed to load wireframe project',
          variant: 'destructive'
        });
        
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

  const saveProject = useCallback(async (projectData: Partial<WireframeData>) => {
    if (!projectId) return;
    
    try {
      setIsLoading(true);
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
