
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientAccessLink } from "@/utils/client-service";
import { Copy, Check, Mail, Phone, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { formatDistance } from "date-fns";
import ClientLinkDeliveryStatus from "./ClientLinkDeliveryStatus";

interface ClientLinksListProps {
  links: ClientAccessLink[];
  isLoading: boolean;
  onRefresh: () => void;
  onResendLink?: (linkId: string, type: 'email' | 'sms', recipient: string) => void;
}

const ClientLinksList = ({ 
  links, 
  isLoading, 
  onRefresh,
  onResendLink 
}: ClientLinksListProps) => {
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [expandedLinkId, setExpandedLinkId] = useState<string | null>(null);

  const handleCopyLink = (link: ClientAccessLink) => {
    const baseUrl = window.location.origin;
    const shareLink = `${baseUrl}/client-hub?clientToken=${link.token}&designerId=${link.designerId}`;
    
    navigator.clipboard.writeText(shareLink);
    setCopiedLinkId(link.id);
    toast.success("Link copied to clipboard");
    
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  const toggleExpand = (linkId: string) => {
    setExpandedLinkId(prev => prev === linkId ? null : linkId);
  };

  const handleResendLink = (linkId: string, type: 'email' | 'sms', recipient: string) => {
    if (onResendLink) {
      onResendLink(linkId, type, recipient);
    } else {
      toast.info("Resend functionality not implemented yet");
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-[150px]" />
                <Skeleton className="h-6 w-[80px]" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[180px]" />
                <Skeleton className="h-4 w-[120px]" />
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-9 w-[100px]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (links.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
          <p className="text-muted-foreground mb-4">No client links found</p>
          <Button variant="outline" onClick={onRefresh} size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {links.map((link) => (
        <Card key={link.id}>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row justify-between mb-2">
              <h3 className="font-medium">{link.clientName}</h3>
              <span className={`text-sm ${link.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
                {link.status === 'active' ? 'Active' : 'Expired'}
              </span>
            </div>
            
            <div className="space-y-1 mb-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5 mr-2" />
                {link.clientEmail}
              </div>
              
              {link.clientPhone && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 mr-2" />
                  {link.clientPhone}
                </div>
              )}
              
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                Created {formatDistance(link.createdAt, new Date(), { addSuffix: true })}
                {link.lastAccessedAt && (
                  <span className="ml-2">
                    • Last accessed {formatDistance(link.lastAccessedAt, new Date(), { addSuffix: true })}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs underline-offset-4 hover:underline"
                onClick={() => toggleExpand(link.id)}
              >
                {expandedLinkId === link.id ? "Hide details" : "Show delivery details"}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyLink(link)}
                className="ml-auto"
              >
                {copiedLinkId === link.id ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
            
            {expandedLinkId === link.id && (
              <div className="mt-4 pt-3 border-t">
                <h4 className="text-sm font-medium mb-2">Delivery Status</h4>
                <ClientLinkDeliveryStatus 
                  linkId={link.id} 
                  onResend={(type, recipient) => handleResendLink(link.id, type, recipient)}
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClientLinksList;
