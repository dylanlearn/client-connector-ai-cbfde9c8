
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Project } from '@/types/projects';
import { ProjectService } from '@/services/project-service';
import { toast } from 'sonner';

export const useProjects = () => {
  const queryClient = useQueryClient();
  
  // Fetch projects
  const { 
    data: projects = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['projects'],
    queryFn: ProjectService.getProjects,
  });
  
  // Update project mutation
  const { mutate: updateProject } = useMutation({
    mutationFn: (project: Partial<Project>) => {
      if (!project.id) {
        throw new Error('Project ID is required for updates');
      }
      return ProjectService.updateProject(project.id, project);
    },
    onSuccess: (updatedProject) => {
      queryClient.setQueryData(['projects'], (oldData: Project[] | undefined) => {
        if (!oldData) return [updatedProject];
        return oldData.map(p => p.id === updatedProject.id ? updatedProject : p);
      });
      toast.success('Project updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update project');
      console.error('Error updating project:', error);
    }
  });
  
  // Archive project mutation
  const { mutate: archiveProject } = useMutation({
    mutationFn: ProjectService.archiveProject,
    onSuccess: (_, projectId) => {
      queryClient.setQueryData(['projects'], (oldData: Project[] | undefined) => {
        if (!oldData) return [];
        return oldData.map(p => p.id === projectId ? { ...p, status: 'archived' } : p);
      });
      toast.success('Project archived');
    },
    onError: (error) => {
      toast.error('Failed to archive project');
      console.error('Error archiving project:', error);
    }
  });
  
  // Delete project mutation
  const { mutate: deleteProject } = useMutation({
    mutationFn: ProjectService.deleteProject,
    onSuccess: (_, projectId) => {
      queryClient.setQueryData(['projects'], (oldData: Project[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(p => p.id !== projectId);
      });
      toast.success('Project deleted permanently');
    },
    onError: (error) => {
      toast.error('Failed to delete project');
      console.error('Error deleting project:', error);
    }
  });

  return {
    projects,
    isLoading,
    error,
    updateProject,
    archiveProject,
    deleteProject
  };
};
