
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, AlertTriangle, Check, Clock } from "lucide-react";
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

export default function ClientLinkDeliveryStatus({ linkId }: ClientLinkDeliveryStatusProps) {
  const [deliveries, setDeliveries] = useState<any[]>([]);
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
        
        return (
          <TooltipProvider key={delivery.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge 
                  variant={isError ? "destructive" : isSent ? "default" : "secondary"}
                  className="flex items-center gap-1 text-xs cursor-help"
                >
                  {isSms ? <Phone className="h-3 w-3" /> : <Mail className="h-3 w-3" />}
                  {isError ? <AlertTriangle className="h-3 w-3" /> : 
                   isPending ? <Clock className="h-3 w-3" /> : 
                   isSent ? <Check className="h-3 w-3" /> : null}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <p className="font-semibold">
                    {isSms ? "SMS" : "Email"} {
                      isPending ? "Sending..." : 
                      isError ? "Failed" : 
                      isSent ? "Sent" : delivery.status
                    }
                  </p>
                  {delivery.recipient && <p className="text-xs">{delivery.recipient}</p>}
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
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}
