
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WireframeVersion, WireframeData } from '@/types/wireframe';
import { useToast } from '@/hooks/use-toast';

export function useWireframeVersionControl() {
  const [versions, setVersions] = useState<WireframeVersion[]>([]);
  const [currentVersion, setCurrentVersion] = useState<WireframeVersion | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Load wireframe versions
  const loadWireframeVersions = useCallback(async (projectId: string, wireframeId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('wireframe_versions')
        .select('*')
        .eq('wireframe_id', wireframeId)
        .order('version_number', { ascending: false });
      
      if (fetchError) throw new Error(fetchError.message);
      
      setVersions(data as WireframeVersion[]);
      
      // Set the current version as the one with is_current = true, or the most recent one
      const currentVersionData = data.find((v: any) => v.is_current === true) || data[0];
      if (currentVersionData) {
        setCurrentVersion(currentVersionData as WireframeVersion);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load wireframe versions'));
      toast({
        title: 'Error',
        description: 'Failed to load wireframe versions',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Create a new version
  const createVersion = useCallback(async (
    wireframeId: string, 
    data: WireframeData, 
    changeDescription?: string
  ) => {
    setIsLoading(true);
    
    try {
      // Get the latest version number
      const { data: latestVersions, error: fetchError } = await supabase
        .from('wireframe_versions')
        .select('version_number')
        .eq('wireframe_id', wireframeId)
        .order('version_number', { ascending: false })
        .limit(1);
      
      if (fetchError) throw new Error(fetchError.message);
      
      const versionNumber = (latestVersions.length > 0) 
        ? latestVersions[0].version_number + 1 
        : 1;
      
      // Prepare the new version data
      const versionData = {
        wireframe_id: wireframeId,
        version_number: versionNumber,
        data,
        is_current: true,
        change_description: changeDescription || `Version ${versionNumber}`,
        created_at: new Date().toISOString()
      };
      
      // Update all existing versions to not be current
      await supabase
        .from('wireframe_versions')
        .update({ is_current: false })
        .eq('wireframe_id', wireframeId);
      
      // Insert the new version
      const { data: newVersion, error: insertError } = await supabase
        .from('wireframe_versions')
        .insert(versionData)
        .select();
      
      if (insertError) throw new Error(insertError.message);
      
      // Reload versions
      loadWireframeVersions(wireframeId, wireframeId);
      
      toast({
        title: 'Success',
        description: `Created version ${versionNumber}`,
      });
      
      return newVersion[0] as WireframeVersion;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create version'));
      toast({
        title: 'Error',
        description: 'Failed to create version',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [loadWireframeVersions, toast]);

  return {
    versions,
    currentVersion,
    isLoading,
    error,
    loadWireframeVersions,
    createVersion
  };
}
