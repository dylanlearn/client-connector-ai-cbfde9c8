
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProjectFile, FileUploadResponse, ProjectFileResponse } from '@/types/project-file';
import { withRetry } from '@/utils/retry-utils';
import { toast } from 'sonner';

/**
 * Enterprise-grade hook for managing project files
 */
export const useProjectFiles = (projectId?: string) => {
  const queryClient = useQueryClient();

  /**
   * Fetch all files for a project
   */
  const {
    data: files,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['project-files', projectId],
    queryFn: async (): Promise<ProjectFile[]> => {
      if (!projectId) return [];

      return withRetry(async () => {
        const { data, error } = await supabase
          .from('project_files')
          .select('*')
          .eq('project_id', projectId)
          .eq('is_deleted', false)
          .order('uploaded_at', { ascending: false });

        if (error) throw new Error(`Error fetching project files: ${error.message}`);
        return data as ProjectFileResponse;
      });
    },
    enabled: !!projectId,
  });

  /**
   * Upload a new file to the project
   */
  const uploadFile = useMutation({
    mutationFn: async ({
      file,
      description,
    }: {
      file: File;
      description?: string;
    }): Promise<ProjectFile> => {
      if (!projectId) throw new Error('Project ID is required');
      
      const userId = await getCurrentUserId();
      if (!userId) throw new Error('User must be authenticated to upload files');

      // First upload the file to storage
      const fileName = `${new Date().getTime()}_${file.name}`;
      const storagePath = `projects/${projectId}/${fileName}`;
      
      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project_files')
        .upload(storagePath, file);

      if (uploadError) throw new Error(`Error uploading file: ${uploadError.message}`);

      // Now create the database record
      const { data: fileData, error: fileError } = await supabase
        .from('project_files')
        .insert({
          project_id: projectId,
          user_id: userId,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          storage_path: storagePath,
          description: description || null,
        })
        .select()
        .single();

      if (fileError) {
        // If database insert fails, try to clean up the uploaded file
        try {
          await supabase.storage.from('project_files').remove([storagePath]);
        } catch (cleanupError) {
          console.error('Failed to clean up orphaned file:', cleanupError);
        }
        throw new Error(`Error creating file record: ${fileError.message}`);
      }

      return fileData as ProjectFile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-files', projectId] });
      toast.success('File uploaded successfully');
    },
    onError: (error: Error) => {
      toast.error('File upload failed', {
        description: error.message
      });
    },
  });

  /**
   * Delete a file (mark as deleted)
   */
  const deleteFile = useMutation({
    mutationFn: async (fileId: string) => {
      const { error } = await supabase
        .from('project_files')
        .update({ is_deleted: true })
        .eq('id', fileId);

      if (error) throw new Error(`Error deleting file: ${error.message}`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-files', projectId] });
      toast.success('File deleted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete file', {
        description: error.message
      });
    },
  });

  /**
   * Get a signed URL for a file (for download)
   */
  const getFileUrl = async (filePath: string): Promise<string> => {
    try {
      const { data, error } = await supabase.storage
        .from('project_files')
        .createSignedUrl(filePath, 60 * 5); // 5 minutes expiry

      if (error) throw new Error(`Error generating download URL: ${error.message}`);
      return data.signedUrl;
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  };

  /**
   * Get current authenticated user ID
   */
  const getCurrentUserId = async (): Promise<string | null> => {
    const { data } = await supabase.auth.getSession();
    return data?.session?.user?.id || null;
  };

  return {
    files,
    isLoading,
    error,
    uploadFile,
    deleteFile,
    getFileUrl,
    refetch,
  };
};
