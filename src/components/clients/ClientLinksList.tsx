
import { useState } from "react";
import { ClientAccessLink, resendClientLink } from "@/utils/client-service";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import ClientLinkDeliveryStatus from "./ClientLinkDeliveryStatus";
import { Copy, Send, Mail, Phone, Loader2, PlusCircle, Briefcase } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

interface ClientLinksListProps {
  links: ClientAccessLink[];
  isLoading: boolean;
  onRefresh: () => void;
}

export default function ClientLinksList({ links, isLoading, onRefresh }: ClientLinksListProps) {
  const [sendingStatus, setSendingStatus] = useState<Record<string, {email?: boolean, sms?: boolean}>>({});
  const navigate = useNavigate();

  const handleCopyLink = async (token: string, designerId: string) => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/client-hub?clientToken=${token}&designerId=${designerId}`;
    
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard");
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast.error("Failed to copy link");
    }
  };
  
  const handleResendLink = async (linkId: string, type: 'email' | 'sms', recipient: string) => {
    setSendingStatus(prev => ({
      ...prev,
      [linkId]: {
        ...prev[linkId],
        [type]: true
      }
    }));
    
    try {
      const success = await resendClientLink(linkId, type, recipient);
      
      if (success) {
        toast.success(`Link sent to client via ${type === 'email' ? 'email' : 'SMS'}`);
        onRefresh();
      } else {
        throw new Error(`Failed to send link via ${type}`);
      }
    } catch (error) {
      toast.error(`Failed to send link: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSendingStatus(prev => ({
        ...prev,
        [linkId]: {
          ...prev[linkId],
          [type]: false
        }
      }));
    }
  };

  const handleCreateProject = () => {
    navigate('/new-project');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (links.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <div className="space-y-3">
          <div className="bg-primary/10 h-12 w-12 rounded-full inline-flex items-center justify-center">
            <PlusCircle className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium">No client links found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Create a client portal link to share with your clients and track their progress.
          </p>
          <div className="pt-3">
            <Button variant="outline" onClick={handleCreateProject}>
              <Briefcase className="mr-2 h-4 w-4" />
              Create a Project First
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Last Access</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links.map((link) => (
            <TableRow key={link.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{link.clientName}</div>
                  <div className="text-sm text-muted-foreground">{link.clientEmail}</div>
                  {link.clientPhone && (
                    <div className="text-sm text-muted-foreground">{link.clientPhone}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {link.projectTitle ? (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {link.projectTitle}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">Not assigned</span>
                )}
              </TableCell>
              <TableCell>
                <Badge 
                  variant={link.status === 'active' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  {link.status}
                </Badge>
              </TableCell>
              <TableCell>
                {formatDistanceToNow(link.createdAt, { addSuffix: true })}
              </TableCell>
              <TableCell>
                {formatDistanceToNow(link.expiresAt, { addSuffix: true })}
              </TableCell>
              <TableCell>
                {link.lastAccessedAt 
                  ? formatDistanceToNow(link.lastAccessedAt, { addSuffix: true })
                  : "Never"
                }
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopyLink(link.token, link.designerId)}
                    title="Copy link"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleResendLink(link.id, 'email', link.clientEmail)}
                    disabled={!!sendingStatus[link.id]?.email}
                    title="Send via email"
                  >
                    {sendingStatus[link.id]?.email ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                  </Button>
                  
                  {link.clientPhone && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleResendLink(link.id, 'sms', link.clientPhone!)}
                      disabled={!!sendingStatus[link.id]?.sms}
                      title="Send via SMS"
                    >
                      {sendingStatus[link.id]?.sms ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Phone className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
                
                <ClientLinkDeliveryStatus linkId={link.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
