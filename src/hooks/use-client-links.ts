
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { getClientLinks } from "@/utils/client-service";
import { supabase } from "@/integrations/supabase/client";
import { ClientAccessLink } from "@/types/client";

export function useClientLinks() {
  const { user } = useAuth();
  const [clientLinks, setClientLinks] = useState<ClientAccessLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadClientLinks = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const links = await getClientLinks(user.id);
      if (links) {
        setClientLinks(links);
      }
    } catch (error) {
      console.error("Error loading client links:", error);
      toast.error("Failed to load client links");
    } finally {
      setIsLoading(false);
    }
  };

  const checkExpiredLinks = async () => {
    if (!user) return;
    
    try {
      // Use a direct database query with type assertion
      const { data, error } = await supabase
        .from('client_access_links')
        .update({ status: 'expired' })
        .eq('designer_id', user.id)
        .eq('status', 'active')
        .lt('expires_at', new Date().toISOString())
        .select('id');
      
      if (error) {
        console.error("Error checking expired links:", error);
        return;
      }
      
      if (data && data.length > 0) {
        console.log(`${data.length} client links marked as expired`);
        loadClientLinks();
      }
    } catch (error) {
      console.error("Error in checkExpiredLinks:", error);
    }
  };

  return { 
    clientLinks, 
    isLoading, 
    loadClientLinks,
    checkExpiredLinks,
    setClientLinks
  };
}
