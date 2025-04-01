
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { UserPlus, RefreshCw } from "lucide-react";
import { getClientLinks } from "@/utils/client-service";
import { supabase } from "@/integrations/supabase/client";
import ClientLinkDialog from "./ClientLinkDialog";
import ClientLinksList from "./ClientLinksList";
import { setupRealtimeForClientTables } from "@/utils/realtime-utils";
import { ClientAccessLink } from "@/types/client";

export default function ClientsManager() {
  const { user } = useAuth();
  const [clientLinks, setClientLinks] = useState<ClientAccessLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    if (user) {
      loadClientLinks();
      
      // Initialize realtime setup
      setupRealtimeForClientTables().catch(error => {
        console.error("Error setting up realtime:", error);
      });
      
      // Check for expired links initially and every hour
      checkExpiredLinks();
      const expirationTimer = setInterval(checkExpiredLinks, 60 * 60 * 1000);
      
      // Set up real-time subscription for client links changes
      const linksChannel = supabase.channel('public:client_access_links')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'client_access_links',
            filter: `designer_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Client links changed:', payload);
            // Reload links when changes occur
            loadClientLinks();
            
            // Show toast notification based on the event
            if (payload.eventType === 'INSERT') {
              toast.info(`New client link created`);
            } else if (payload.eventType === 'UPDATE') {
              // Only show toast if status changed (e.g., from active to expired)
              if ((payload.old as any).status !== (payload.new as any).status) {
                toast.info(`Client link status changed to ${(payload.new as any).status}`);
              }
            }
          }
        )
        .subscribe();
        
      // Set up real-time subscription for client tasks changes
      const tasksChannel = supabase.channel('public:client_tasks')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'client_tasks',
            filter: `status=eq.completed`
          },
          async (payload) => {
            // We need to check if this task belongs to one of our clients
            try {
              const { data: linkData } = await supabase
                .from('client_access_links')
                .select('client_name, client_email, project_id')
                .eq('id', (payload.new as any).link_id)
                .eq('designer_id', user.id)
                .single();
                
              if (linkData) {
                const taskType = (payload.new as any).task_type;
                const taskName = taskType === 'intakeForm' 
                  ? 'Project Intake Form' 
                  : taskType === 'designPicker' 
                    ? 'Design Preferences' 
                    : 'Template Selection';
                
                let notificationMessage = `${linkData.client_name} completed ${taskName}`;
                
                if (linkData.project_id) {
                  const { data: projectData } = await supabase
                    .from('projects')
                    .select('title')
                    .eq('id', linkData.project_id)
                    .single();
                    
                  if (projectData) {
                    notificationMessage += ` for project "${projectData.title}"`;
                  }
                }
                
                toast.success(notificationMessage);
              }
            } catch (error) {
              // Silently fail - likely means this task isn't related to this designer
              console.log('Task update not relevant to current user');
            }
          }
        )
        .subscribe();
      
      return () => {
        clearInterval(expirationTimer);
        supabase.removeChannel(linksChannel);
        supabase.removeChannel(tasksChannel);
      };
    }
  }, [user]);
  
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
  
  const handleCreateLink = () => {
    setIsDialogOpen(true);
  };
  
  const handleLinkCreated = (newLink: ClientAccessLink) => {
    setClientLinks(prev => [newLink, ...prev]);
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Client Management</h1>
          <p className="text-muted-foreground">Create and manage client access portals</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadClientLinks}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          
          <Button size="sm" onClick={handleCreateLink}>
            <UserPlus className="h-4 w-4 mr-2" />
            New Client
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Links</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-4">
          <ClientLinksList 
            links={clientLinks.filter(link => link.status === 'active')} 
            isLoading={isLoading}
            onRefresh={loadClientLinks}
          />
        </TabsContent>
        
        <TabsContent value="expired" className="mt-4">
          <ClientLinksList 
            links={clientLinks.filter(link => link.status !== 'active')} 
            isLoading={isLoading}
            onRefresh={loadClientLinks}
          />
        </TabsContent>
      </Tabs>
      
      <ClientLinkDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onLinkCreated={handleLinkCreated}
      />
    </div>
  );
}
