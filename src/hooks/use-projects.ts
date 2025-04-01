
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Project, CreateProjectData, UpdateProjectData } from '@/types/project';
import { useToast } from '@/components/ui/use-toast';

export const useProjects = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all projects for the current user
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }

      return data as Project[];
    },
  });

  // Create a new project
  const createProject = useMutation({
    mutationFn: async (projectData: CreateProjectData) => {
      const { data, error } = await supabase
        .from('projects')
        .insert([
          { 
            ...projectData, 
            status: projectData.status || 'draft' 
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating project:', error);
        throw error;
      }

      return data as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: 'Project created',
        description: 'Your project has been created successfully.',
      });
    },
    onError: (error) => {
      console.error('Create project error:', error);
      toast({
        title: 'Failed to create project',
        description: 'An error occurred while creating your project. Please try again.',
        variant: 'destructive',
      });
    }
  });

  // Update an existing project
  const updateProject = useMutation({
    mutationFn: async ({ id, ...updateData }: UpdateProjectData & { id: string }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating project:', error);
        throw error;
      }

      return data as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: 'Project updated',
        description: 'Your project has been updated successfully.',
      });
    },
    onError: (error) => {
      console.error('Update project error:', error);
      toast({
        title: 'Failed to update project',
        description: 'An error occurred while updating your project. Please try again.',
        variant: 'destructive',
      });
    }
  });

  // Delete a project
  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting project:', error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: 'Project deleted',
        description: 'Your project has been deleted successfully.',
      });
    },
    onError: (error) => {
      console.error('Delete project error:', error);
      toast({
        title: 'Failed to delete project',
        description: 'An error occurred while deleting your project. Please try again.',
        variant: 'destructive',
      });
    }
  });

  return {
    projects: projects || [],
    isLoading,
    error,
    createProject,
    updateProject,
    deleteProject,
  };
};
