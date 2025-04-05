// Import our utility function for type conversion
import { toStringArray } from '@/utils/type-guards';
import { supabase } from "@/integrations/supabase/client";

export interface VersionHistoryItem {
  id: string;
  versionName: string;
  createdAt: string;
}

export async function getVersionHistory(projectId: string): Promise<VersionHistoryItem[]> {
  try {
    const { data, error } = await supabase
      .from('wireframe_versions')
      .select('id')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching version IDs:", error);
      return [];
    }
    
    // Fix the type error by using our utility function
    const versionIds = toStringArray(data.map(item => item.id));

    const versionHistory = versionIds.map((id, index) => ({
      id: id,
      versionName: `Version ${index + 1}`,
      createdAt: new Date().toISOString(),
    }));

    return versionHistory;
  } catch (error) {
    console.error("Error fetching version history:", error);
    return [];
  }
}
