
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useClientLinks } from "@/hooks/use-client-links";
import { useRealtimeSubscriptions } from "@/hooks/use-realtime-subscriptions";
import ClientLinkDialog from "./ClientLinkDialog";
import ClientManagerHeader from "./ClientManagerHeader";
import ClientLinksTabContent from "./ClientLinksTabContent";
import { ClientAccessLink } from "@/types/client";

export default function ClientsManager() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { 
    clientLinks, 
    isLoading, 
    loadClientLinks, 
    checkExpiredLinks,
    setClientLinks
  } = useClientLinks();
  
  // Set up realtime subscriptions
  useRealtimeSubscriptions(user?.id, loadClientLinks);
  
  useEffect(() => {
    if (user) {
      loadClientLinks();
      
      // Check for expired links initially and every hour
      checkExpiredLinks();
      const expirationTimer = setInterval(checkExpiredLinks, 60 * 60 * 1000);
      
      return () => {
        clearInterval(expirationTimer);
      };
    }
  }, [user]);
  
  const handleCreateLink = () => {
    setIsDialogOpen(true);
  };
  
  const handleLinkCreated = (newLink: ClientAccessLink) => {
    setClientLinks(prev => [newLink, ...prev]);
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <ClientManagerHeader 
        isLoading={isLoading}
        onRefresh={loadClientLinks}
        onCreateLink={handleCreateLink}
      />
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-4">
          <ClientLinksTabContent 
            links={clientLinks}
            isLoading={isLoading}
            status="active"
            onRefresh={loadClientLinks}
          />
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          <ClientLinksTabContent 
            links={clientLinks}
            isLoading={isLoading}
            status="completed"
            onRefresh={loadClientLinks}
          />
        </TabsContent>
        
        <TabsContent value="expired" className="mt-4">
          <ClientLinksTabContent 
            links={clientLinks}
            isLoading={isLoading}
            status="expired"
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
