
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProjectFile } from '@/types/project-file';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export const useProjectFiles = (projectId?: string) => {
  const queryClient = useQueryClient();

  const {
    data: files,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['project-files', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', projectId)
        .eq('is_deleted', false)
        .order('uploaded_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching project files:', error);
        throw error;
      }
      
      return data as ProjectFile[];
    },
    enabled: !!projectId,
  });

  const uploadFile = useMutation({
    mutationFn: async ({ 
      file, 
      projectId, 
      description 
    }: { 
      file: File; 
      projectId: string;
      description?: string;
    }) => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');
      
      const userId = user.id;
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${userId}/${projectId}/${fileName}`;
      
      // Upload file to storage
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('project_files')
        .upload(filePath, file);
      
      if (storageError) {
        throw storageError;
      }
      
      // Add file record to database
      const { data, error: dbError } = await supabase
        .from('project_files')
        .insert({
          project_id: projectId,
          user_id: userId,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          storage_path: filePath,
          description: description || null,
        })
        .select()
        .single();
      
      if (dbError) {
        // Try to clean up the uploaded file if database insert fails
        await supabase.storage.from('project_files').remove([filePath]);
        throw dbError;
      }
      
      return data as ProjectFile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-files', projectId] });
      toast.success('File uploaded successfully');
    },
    onError: (error) => {
      console.error('Upload file error:', error);
      toast.error('Failed to upload file', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  });

  const deleteFile = useMutation({
    mutationFn: async (fileId: string) => {
      // We perform a soft delete by updating the is_deleted flag
      const { data, error } = await supabase
        .from('project_files')
        .update({ is_deleted: true })
        .eq('id', fileId)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data as ProjectFile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-files', projectId] });
      toast.success('File deleted successfully');
    },
    onError: (error) => {
      console.error('Delete file error:', error);
      toast.error('Failed to delete file');
    }
  });

  const getFileUrl = async (filePath: string): Promise<string> => {
    const { data } = await supabase
      .storage
      .from('project_files')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  };

  return {
    files,
    isLoading,
    error,
    uploadFile,
    deleteFile,
    getFileUrl,
  };
};
