
import React, { useState, useEffect } from "react";
import { Mail, Phone, Check, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getLinkDeliveries } from "@/services/access-links-service";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

interface DeliveryInfo {
  id: string;
  delivery_type: string;
  recipient: string;
  status: string;
  sent_at: string | null;
  delivered_at: string | null;
  error_message: string | null;
  created_at: string;
}

interface ClientLinkDeliveryStatusProps {
  linkId: string;
  onResend?: (type: 'email' | 'sms', recipient: string) => void;
}

export default function ClientLinkDeliveryStatus({ 
  linkId,
  onResend
}: ClientLinkDeliveryStatusProps) {
  const [deliveries, setDeliveries] = useState<DeliveryInfo[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDeliveries = async () => {
      setIsLoading(true);
      try {
        const data = await getLinkDeliveries(linkId);
        setDeliveries(data);
      } catch (error) {
        console.error("Error loading deliveries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDeliveries();
  }, [linkId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'sent':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="default" className="bg-green-500">Delivered</Badge>;
      case 'sent':
        return <Badge variant="outline" className="text-amber-500 border-amber-300">Sent</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'email' 
      ? <Mail className="h-4 w-4 mr-2" /> 
      : <Phone className="h-4 w-4 mr-2" />;
  };

  const handleResend = (type: 'email' | 'sms', recipient: string) => {
    if (onResend) {
      onResend(type as 'email' | 'sms', recipient);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (!deliveries || deliveries.length === 0) {
    return <p className="text-sm text-muted-foreground">No delivery information available</p>;
  }

  return (
    <div className="space-y-2">
      {deliveries.map(delivery => (
        <div key={delivery.id} className="flex items-center justify-between p-2 rounded-md border">
          <div className="flex items-center">
            {getTypeIcon(delivery.delivery_type)}
            <span className="text-sm truncate max-w-[120px] sm:max-w-[200px]">
              {delivery.recipient}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    {getStatusIcon(delivery.status)}
                    {getStatusBadge(delivery.status)}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {delivery.status === 'delivered' && delivery.delivered_at 
                      ? `Delivered ${formatDistanceToNow(new Date(delivery.delivered_at), { addSuffix: true })}`
                      : delivery.status === 'sent' && delivery.sent_at
                        ? `Sent ${formatDistanceToNow(new Date(delivery.sent_at), { addSuffix: true })}`
                        : delivery.status === 'failed'
                          ? delivery.error_message || 'Delivery failed'
                          : 'Pending delivery'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {onResend && (delivery.status === 'pending' || delivery.status === 'failed') && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2"
                onClick={() => handleResend(
                  delivery.delivery_type as 'email' | 'sms', 
                  delivery.recipient
                )}
              >
                Resend
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
