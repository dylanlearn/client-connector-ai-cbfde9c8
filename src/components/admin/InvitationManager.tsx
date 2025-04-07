
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CreateInvitationForm } from "./CreateInvitationForm";
import { InvitationsList } from "./InvitationsList";

export function InvitationManager() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-api", {
        body: { action: "list_invitations" },
      });

      if (error) {
        throw error;
      }

      setInvitations(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch invitations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <CreateInvitationForm onInvitationCreated={fetchInvitations} />
      <InvitationsList 
        invitations={invitations} 
        isLoading={isLoading} 
        onRevokeSuccess={fetchInvitations} 
      />
    </div>
  );
}
