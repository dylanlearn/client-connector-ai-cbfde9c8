
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, AlertTriangle, Check } from "lucide-react";
import { getLinkDeliveries } from "@/utils/client-service";

interface ClientLinkDeliveryStatusProps {
  linkId: string;
}

export default function ClientLinkDeliveryStatus({ linkId }: ClientLinkDeliveryStatusProps) {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  
  useEffect(() => {
    const loadDeliveries = async () => {
      try {
        const data = await getLinkDeliveries(linkId);
        if (data) {
          setDeliveries(data);
        }
      } catch (error) {
        console.error("Error loading deliveries:", error);
      }
    };
    
    loadDeliveries();
  }, [linkId]);
  
  if (deliveries.length === 0) {
    return null;
  }
  
  return (
    <div className="flex gap-1 mt-2 justify-end">
      {deliveries.map((delivery) => {
        const isSms = delivery.delivery_type === 'sms';
        const isError = delivery.status === 'error';
        const isSuccess = delivery.status === 'success';
        
        return (
          <Badge 
            key={delivery.id} 
            variant={isError ? "destructive" : isSuccess ? "default" : "secondary"}
            className="flex items-center gap-1 text-xs"
            title={delivery.error_message || `${delivery.delivery_type} delivery ${delivery.status}`}
          >
            {isSms ? <Phone className="h-3 w-3" /> : <Mail className="h-3 w-3" />}
            {isError ? <AlertTriangle className="h-3 w-3" /> : 
              isSuccess ? <Check className="h-3 w-3" /> : null}
          </Badge>
        );
      })}
    </div>
  );
}
