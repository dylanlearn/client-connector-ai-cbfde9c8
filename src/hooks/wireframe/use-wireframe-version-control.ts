
import { useState, useCallback } from 'react';
import { WireframeVersion } from '@/types/wireframe';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useWireframeVersionControl() {
  const [versions, setVersions] = useState<WireframeVersion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const loadWireframeVersions = useCallback(async (projectId: string, wireframeId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('wireframe_versions')
        .select('*')
        .eq('wireframe_id', wireframeId)
        .order('version_number', { ascending: false });
        
      if (error) {
        throw new Error(`Failed to load wireframe versions: ${error.message}`);
      }
      
      setVersions(data || []);
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load wireframe versions';
      setError(errorMessage);
      toast({ 
        title: 'Error loading versions', 
        description: errorMessage, 
        variant: 'destructive'
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  const createVersion = useCallback(async (
    wireframeId: string, 
    data: any, 
    description: string,
    branchName: string = 'main'
  ) => {
    try {
      setIsLoading(true);
      
      // First get the latest version number
      const { data: latestVersions, error: fetchError } = await supabase
        .from('wireframe_versions')
        .select('version_number')
        .eq('wireframe_id', wireframeId)
        .eq('branch_name', branchName)
        .order('version_number', { ascending: false })
        .limit(1);
        
      if (fetchError) {
        throw new Error(`Failed to check latest version: ${fetchError.message}`);
      }
      
      const nextVersionNumber = latestVersions && latestVersions.length > 0 
        ? (latestVersions[0].version_number + 1)
        : 1;
      
      const newVersion = {
        wireframe_id: wireframeId,
        version_number: nextVersionNumber,
        branch_name: branchName,
        data: data,
        is_current: true,
        change_description: description,
        created_at: new Date().toISOString()
      };
      
      // Update any existing current version to not be current
      await supabase
        .from('wireframe_versions')
        .update({ is_current: false })
        .eq('wireframe_id', wireframeId)
        .eq('is_current', true);
      
      // Insert the new version
      const { data: savedVersion, error: insertError } = await supabase
        .from('wireframe_versions')
        .insert(newVersion)
        .select();
        
      if (insertError) {
        throw new Error(`Failed to save version: ${insertError.message}`);
      }
      
      // Refresh the versions list
      await loadWireframeVersions(wireframeId, wireframeId);
      
      toast({
        title: 'Version created',
        description: `Version ${nextVersionNumber} created successfully`,
      });
      
      return savedVersion;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create version';
      setError(errorMessage);
      toast({ 
        title: 'Error creating version', 
        description: errorMessage, 
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [loadWireframeVersions, toast]);
  
  return {
    versions,
    isLoading,
    error,
    loadWireframeVersions,
    createVersion
  };
}
