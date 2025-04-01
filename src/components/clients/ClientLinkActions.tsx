
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Mail, Phone, Loader2 } from "lucide-react";
import { resendClientLink } from "@/utils/client-service";
import { toast } from "sonner";
import ClientLinkDeliveryStatus from "./ClientLinkDeliveryStatus";

interface ClientLinkActionsProps {
  linkId: string;
  token: string;
  designerId: string;
  clientEmail: string;
  clientPhone: string | null;
  onRefresh: () => void;
}

export default function ClientLinkActions({ 
  linkId, 
  token, 
  designerId, 
  clientEmail, 
  clientPhone, 
  onRefresh 
}: ClientLinkActionsProps) {
  const [sendingStatus, setSendingStatus] = useState<{email?: boolean, sms?: boolean}>({});

  const handleCopyLink = async () => {
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
  
  const handleResendLink = async (type: 'email' | 'sms', recipient: string) => {
    setSendingStatus(prev => ({
      ...prev,
      [type]: true
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
        [type]: false
      }));
    }
  };

  return (
    <div>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopyLink}
          title="Copy link"
        >
          <Copy className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleResendLink('email', clientEmail)}
          disabled={!!sendingStatus.email}
          title="Send via email"
        >
          {sendingStatus.email ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
        </Button>
        
        {clientPhone && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleResendLink('sms', clientPhone)}
            disabled={!!sendingStatus.sms}
            title="Send via SMS"
          >
            {sendingStatus.sms ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Phone className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      
      <ClientLinkDeliveryStatus linkId={linkId} />
    </div>
  );
}
