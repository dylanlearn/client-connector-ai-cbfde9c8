
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from './use-toast';

export interface Project {
  id: string;
  title: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
}

export const useProject = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Mock project data
        const mockProject: Project = {
          id: projectId,
          title: `Project ${projectId.substring(0, 8)}`,
          description: 'This is a sample project description',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'active'
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        setProject(mockProject);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch project');
        setError(error);
        toast({
          title: 'Error',
          description: 'Failed to load project details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId, toast]);

  return {
    project,
    isLoading,
    error,
    setProject
  };
};

export default useProject;
