
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { UserPlus, RefreshCw, Share2 } from "lucide-react";
import { ClientAccessLink, getClientLinks } from "@/utils/client-service";
import ClientLinkDialog from "./ClientLinkDialog";
import ClientLinksList from "./ClientLinksList";

export default function ClientsManager() {
  const { user } = useAuth();
  const [clientLinks, setClientLinks] = useState<ClientAccessLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    if (user) {
      loadClientLinks();
    }
  }, [user]);
  
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
