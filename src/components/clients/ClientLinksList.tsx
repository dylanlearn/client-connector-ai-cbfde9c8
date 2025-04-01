
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowUpRight, 
  Copy, 
  MoreHorizontal, 
  Check,
  RefreshCcw,
  Clock,
  Mail,
  Phone
} from "lucide-react";
import { ClientAccessLink, resendClientLink } from "@/utils/client-service";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ClientLinkDeliveryStatus from "./ClientLinkDeliveryStatus";

interface ClientLinksListProps {
  links: ClientAccessLink[];
  isLoading: boolean;
  onRefresh: () => void;
}

export default function ClientLinksList({ links, isLoading, onRefresh }: ClientLinksListProps) {
  const [expandedLink, setExpandedLink] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [resendingTo, setResendingTo] = useState<{[key: string]: boolean}>({});

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No client links found in this category</p>
      </div>
    );
  }

  const generateClientHubLink = (link: ClientAccessLink): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/client-hub?clientToken=${link.token}&designerId=${link.designerId}`;
  };

  const copyToClipboard = (link: ClientAccessLink) => {
    const hubLink = generateClientHubLink(link);
    navigator.clipboard.writeText(hubLink);
    setCopiedLink(link.id);
    toast.success("Link copied to clipboard");
    
    setTimeout(() => {
      setCopiedLink(null);
    }, 2000);
  };

  const handleResend = async (link: ClientAccessLink, type: 'email' | 'sms', recipient: string) => {
    setResendingTo(prev => ({ ...prev, [`${link.id}-${type}`]: true }));
    
    try {
      const success = await resendClientLink(link.id, type, recipient);
      
      if (success) {
        toast.success(`Link resent to client via ${type === 'email' ? 'email' : 'SMS'}`);
        onRefresh(); // Refresh to show updated delivery status
      } else {
        throw new Error("Failed to resend link");
      }
    } catch (error) {
      console.error(`Error resending link via ${type}:`, error);
      toast.error(`Failed to resend link. Please try again.`);
    } finally {
      setResendingTo(prev => ({ ...prev, [`${link.id}-${type}`]: false }));
    }
  };

  const toggleExpanded = (linkId: string) => {
    setExpandedLink(prev => prev === linkId ? null : linkId);
  };

  const getLinkStatusColor = (link: ClientAccessLink): string => {
    if (link.status !== 'active') {
      return 'text-red-500 bg-red-50';
    }
    
    const now = new Date();
    const expiresIn = Math.ceil((link.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (expiresIn <= 3) {
      return 'text-orange-500 bg-orange-50';
    }
    
    return 'text-green-500 bg-green-50';
  };

  return (
    <div className="space-y-4">
      {links.map(link => (
        <Card key={link.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              {/* Client info */}
              <div className="space-y-1 min-w-0">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold truncate">{link.clientName}</h3>
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getLinkStatusColor(link)}`}>
                    {link.status === 'active' 
                      ? `Expires in ${formatDistanceToNow(link.expiresAt)}`
                      : 'Expired'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{link.clientEmail}</p>
                {link.clientPhone && (
                  <p className="text-sm text-muted-foreground truncate">{link.clientPhone}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Created {formatDistanceToNow(link.createdAt, { addSuffix: true })}
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(link)}
                  className="h-8 px-2"
                >
                  {copiedLink === link.id ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(generateClientHubLink(link), '_blank')}
                  className="h-8 px-2"
                >
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Open
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-8 w-8"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => toggleExpanded(link.id)}>
                      {expandedLink === link.id ? "Hide details" : "View details"}
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuLabel>Resend Link</DropdownMenuLabel>
                    {link.clientEmail && (
                      <DropdownMenuItem 
                        onClick={() => handleResend(link, 'email', link.clientEmail)}
                        disabled={resendingTo[`${link.id}-email`]}
                      >
                        {resendingTo[`${link.id}-email`] ? (
                          <>
                            <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                          </>
                        )}
                      </DropdownMenuItem>
                    )}
                    
                    {link.clientPhone && (
                      <DropdownMenuItem 
                        onClick={() => handleResend(link, 'sms', link.clientPhone!)}
                        disabled={resendingTo[`${link.id}-sms`]}
                      >
                        {resendingTo[`${link.id}-sms`] ? (
                          <>
                            <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Phone className="h-4 w-4 mr-2" />
                            SMS
                          </>
                        )}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Expanded view */}
            {expandedLink === link.id && (
              <div className="mt-4 pt-4 border-t">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Link Details</h4>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Created: {format(link.createdAt, 'PPpp')}</p>
                      <p>Expires: {format(link.expiresAt, 'PPpp')}</p>
                      {link.lastAccessedAt && (
                        <p>Last accessed: {format(link.lastAccessedAt, 'PPpp')}</p>
                      )}
                      <p>Status: {link.status}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Delivery Status</h4>
                    <ClientLinkDeliveryStatus 
                      linkId={link.id} 
                      onResend={(type, recipient) => handleResend(link, type, recipient)}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
