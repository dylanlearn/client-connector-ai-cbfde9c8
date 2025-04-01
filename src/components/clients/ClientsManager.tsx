
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Copy, ExternalLink, RefreshCw, Check } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  getClientLinks, 
  createClientAccessLink, 
  ClientAccessLink,
  getClientTasksProgress
} from "@/utils/client-service";
import { format } from "date-fns";

const ClientsManager = () => {
  const { user } = useAuth();
  const [clientLinks, setClientLinks] = useState<ClientAccessLink[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedLink, setSelectedLink] = useState<ClientAccessLink | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [clientProgress, setClientProgress] = useState<Record<string, Record<string, boolean>>>({});
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);

  useEffect(() => {
    if (user) {
      loadClientLinks();
    }
  }, [user]);

  const loadClientLinks = async () => {
    setIsLoading(true);
    try {
      if (user) {
        const links = await getClientLinks(user.id);
        setClientLinks(links || []);
        
        // Load progress for all links
        if (links && links.length > 0) {
          await loadAllClientProgress(links);
        }
      }
    } catch (error) {
      console.error("Error loading client links:", error);
      toast.error("Failed to load client links");
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllClientProgress = async (links: ClientAccessLink[]) => {
    setIsLoadingProgress(true);
    try {
      const progressPromises = links.map(link => 
        getClientTasksProgress(link.id).then(progress => ({ 
          linkId: link.id, 
          progress 
        }))
      );
      
      const progressResults = await Promise.all(progressPromises);
      const progressMap: Record<string, Record<string, boolean>> = {};
      
      progressResults.forEach(result => {
        if (result.progress) {
          progressMap[result.linkId] = result.progress;
        }
      });
      
      setClientProgress(progressMap);
    } catch (error) {
      console.error("Error loading client progress:", error);
    } finally {
      setIsLoadingProgress(false);
    }
  };

  const handleCreateClient = () => {
    setClientName("");
    setClientEmail("");
    setIsDialogOpen(true);
  };

  const handleCreateClientLink = async () => {
    if (!user || !clientName.trim() || !clientEmail.trim()) {
      toast.error("Please enter both client name and email");
      return;
    }

    setIsCreating(true);
    try {
      const link = await createClientAccessLink(user.id, clientEmail, clientName);
      if (link) {
        setSelectedLink({
          id: '', // Will be updated after refresh
          designerId: user.id,
          clientEmail,
          clientName,
          token: '',
          createdAt: new Date(),
          expiresAt: new Date(new Date().setDate(new Date().getDate() + 14)),
          lastAccessedAt: null,
          status: 'active'
        });
        setIsDialogOpen(false);
        toast.success("Client link created successfully!");
        
        // Reload the client links to get the new one with proper ID
        loadClientLinks();
      }
    } catch (error) {
      console.error("Error creating client link:", error);
      toast.error("Failed to create client link");
    } finally {
      setIsCreating(false);
    }
  };

  const copyLinkToClipboard = (link: ClientAccessLink) => {
    const baseUrl = window.location.origin;
    const fullLink = `${baseUrl}/client-hub?clientToken=${link.token}&designerId=${link.designerId}`;
    
    navigator.clipboard.writeText(fullLink);
    setCopiedLinkId(link.id);
    toast.success("Link copied to clipboard!");
    
    setTimeout(() => {
      setCopiedLinkId(null);
    }, 2000);
  };

  const getTaskCompletionStatus = (linkId: string): string => {
    if (!clientProgress[linkId]) return "Not started";
    
    const progress = clientProgress[linkId];
    const totalTasks = Object.keys(progress).length;
    const completedTasks = Object.values(progress).filter(Boolean).length;
    
    if (completedTasks === 0) return "Not started";
    if (completedTasks < totalTasks) return `${completedTasks}/${totalTasks} completed`;
    return "All completed";
  };

  const getProgressColor = (linkId: string): string => {
    if (!clientProgress[linkId]) return "bg-gray-200";
    
    const progress = clientProgress[linkId];
    const totalTasks = Object.keys(progress).length;
    const completedTasks = Object.values(progress).filter(Boolean).length;
    
    if (completedTasks === 0) return "bg-gray-200";
    if (completedTasks < totalTasks) return "bg-amber-400";
    return "bg-green-500";
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <Alert>
        <AlertTitle>Authentication Required</AlertTitle>
        <AlertDescription>
          You need to be logged in to manage clients.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Client Management</h2>
        <Button onClick={handleCreateClient}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Client
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Portal Links</CardTitle>
          <CardDescription>
            Manage access links for your clients to complete tasks and view their design journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {clientLinks && clientLinks.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientLinks.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{link.clientName}</div>
                          <div className="text-sm text-muted-foreground">{link.clientEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>{format(link.createdAt, 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        {format(link.expiresAt, 'MMM d, yyyy')}
                        {new Date() > link.expiresAt && (
                          <Badge variant="destructive" className="ml-2">Expired</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getProgressColor(link.id)}`}></div>
                          <span>{getTaskCompletionStatus(link.id)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyLinkToClipboard(link)}
                          >
                            {copiedLinkId === link.id ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/client-hub?clientToken=${link.token}&designerId=${link.designerId}`, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">You haven't created any client links yet.</p>
              <Button onClick={handleCreateClient}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Your First Client
              </Button>
            </div>
          )}
        </CardContent>
        {clientLinks && clientLinks.length > 0 && (
          <CardFooter className="border-t px-6 py-4 flex justify-between">
            <Button variant="outline" onClick={loadClientLinks} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <p className="text-sm text-muted-foreground">
              {clientLinks.length} client{clientLinks.length !== 1 ? 's' : ''}
            </p>
          </CardFooter>
        )}
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Create a unique link for your client to access their design portal.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client-name" className="text-right">
                Name
              </Label>
              <Input
                id="client-name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="col-span-3"
                placeholder="Client Name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client-email" className="text-right">
                Email
              </Label>
              <Input
                id="client-email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="col-span-3"
                placeholder="client@example.com"
                type="email"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateClientLink} 
              disabled={isCreating || !clientName.trim() || !clientEmail.trim()}
            >
              {isCreating ? "Creating..." : "Create Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientsManager;
