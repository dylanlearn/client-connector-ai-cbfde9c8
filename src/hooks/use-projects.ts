
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Project } from '@/types/projects';
import { CreateProjectData } from '@/types/project';
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
  
  // Create project mutation
  const createProject = useMutation({
    mutationFn: (projectData: CreateProjectData) => {
      return ProjectService.createProject(projectData);
    },
    onSuccess: (newProject) => {
      queryClient.setQueryData(['projects'], (oldData: Project[] | undefined) => {
        if (!oldData) return [newProject];
        return [...oldData, newProject];
      });
      toast.success('Project created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create project');
      console.error('Error creating project:', error);
    }
  });
  
  // Update project mutation
  const updateProject = useMutation({
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
  const archiveProject = useMutation({
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
  const deleteProject = useMutation({
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
    createProject,
    updateProject,
    archiveProject,
    deleteProject
  };
};
