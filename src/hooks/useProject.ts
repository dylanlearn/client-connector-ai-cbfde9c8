
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from './use-toast';

// Mock project type
interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}

export function useProject() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function loadProject() {
      if (!projectId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Create mock project data
        const projectData: Project = {
          id: projectId,
          name: `Project ${projectId.slice(0, 5)}`,
          description: 'This is a sample project description',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'active'
        };
        
        setProject(projectData);
      } catch (err) {
        console.error('Error loading project:', err);
        setError('Failed to load project data');
        toast({
          title: 'Error',
          description: 'Failed to load project data',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadProject();
  }, [projectId, toast]);

  return {
    project,
    isLoading,
    error,
    projectId
  };
}
