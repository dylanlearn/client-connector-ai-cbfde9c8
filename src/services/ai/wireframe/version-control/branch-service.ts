
import { supabase } from "@/integrations/supabase/client";
import { BranchInfo } from "../wireframe-types";

// Example branch service implementation
export const branchService = {
  getAllBranches: async (wireframeId: string): Promise<BranchInfo[]> => {
    try {
      const { data, error } = await supabase
        .rpc('get_wireframe_branches', { p_wireframe_id: wireframeId });
      
      if (error) {
        console.error("Error fetching branches:", error);
        return [];
      }
      
      return data as BranchInfo[];
    } catch (error) {
      console.error("Error in getAllBranches:", error);
      return [];
    }
  }
};
