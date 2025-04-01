
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, AlertTriangle, Check, Clock, ExternalLink } from "lucide-react";
import { getLinkDeliveries } from "@/utils/client-service";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ClientLinkDeliveryStatusProps {
  linkId: string;
}

interface DeliveryInfo {
  id: string;
  delivery_type: 'email' | 'sms';
  status: 'pending' | 'sent' | 'delivered' | 'error';
  recipient: string;
  sent_at: string | null;
  delivered_at: string | null;
  error_message: string | null;
}

export default function ClientLinkDeliveryStatus({ linkId }: ClientLinkDeliveryStatusProps) {
  const [deliveries, setDeliveries] = useState<DeliveryInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadDeliveries = async () => {
      setIsLoading(true);
      try {
        const data = await getLinkDeliveries(linkId);
        if (data) {
          setDeliveries(data);
        }
      } catch (error) {
        console.error("Error loading deliveries:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDeliveries();
    
    // Set up polling for status updates
    const interval = setInterval(loadDeliveries, 10000);
    return () => clearInterval(interval);
  }, [linkId]);
  
  if (isLoading) {
    return (
      <div className="flex gap-1 mt-2 justify-end">
        <Badge variant="outline" className="animate-pulse">
          Loading...
        </Badge>
      </div>
    );
  }
  
  if (deliveries.length === 0) {
    return null;
  }
  
  return (
    <div className="flex gap-1 mt-2 justify-end">
      {deliveries.map((delivery) => {
        const isSms = delivery.delivery_type === 'sms';
        const isPending = delivery.status === 'pending';
        const isError = delivery.status === 'error';
        const isSent = delivery.status === 'sent';
        const isDelivered = delivery.status === 'delivered';
        
        // Determine the appropriate badge variant and icon
        let badgeVariant: "destructive" | "default" | "secondary" | "outline" = "secondary";
        let statusIcon = <Clock className="h-3 w-3" />;
        
        if (isError) {
          badgeVariant = "destructive";
          statusIcon = <AlertTriangle className="h-3 w-3" />;
        } else if (isSent || isDelivered) {
          badgeVariant = "default";
          statusIcon = <Check className="h-3 w-3" />;
        }
        
        return (
          <TooltipProvider key={delivery.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge 
                  variant={badgeVariant}
                  className="flex items-center gap-1 text-xs cursor-help"
                >
                  {isSms ? <Phone className="h-3 w-3" /> : <Mail className="h-3 w-3" />}
                  {statusIcon}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <p className="font-semibold">
                    {isSms ? "SMS" : "Email"} {
                      isPending ? "Sending..." : 
                      isError ? "Failed" : 
                      isDelivered ? "Delivered" :
                      isSent ? "Sent" : delivery.status
                    }
                  </p>
                  {delivery.recipient && (
                    <p className="text-xs">
                      To: {delivery.recipient}
                    </p>
                  )}
                  {isError && delivery.error_message && (
                    <p className="text-xs text-red-500 max-w-[200px] break-words">
                      Error: {delivery.error_message}
                    </p>
                  )}
                  {isSent && delivery.sent_at && (
                    <p className="text-xs">
                      Sent: {new Date(delivery.sent_at).toLocaleString()}
                    </p>
                  )}
                  {isDelivered && delivery.delivered_at && (
                    <p className="text-xs">
                      Delivered: {new Date(delivery.delivered_at).toLocaleString()}
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}
