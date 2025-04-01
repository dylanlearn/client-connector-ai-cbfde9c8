
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { createClientAccessLink, ClientAccessLink } from "@/utils/client-service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Mail, Phone, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ClientLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLinkCreated: (link: ClientAccessLink) => void;
}

export default function ClientLinkDialog({
  open,
  onOpenChange,
  onLinkCreated
}: ClientLinkDialogProps) {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [deliveryMethods, setDeliveryMethods] = useState<{email: boolean, sms: boolean}>({
    email: true,
    sms: false
  });
  const [isSending, setIsSending] = useState<{[key: string]: boolean}>({});
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();

  const handleDeliveryMethodChange = (method: 'email' | 'sms', checked: boolean) => {
    setDeliveryMethods(prev => ({
      ...prev,
      [method]: checked
    }));
  };

  const sendClientLink = async (linkId: string, type: 'email' | 'sms', recipient: string) => {
    setIsSending(prev => ({ ...prev, [type]: true }));
    
    try {
      const response = await supabase.functions.invoke('send-client-link', {
        body: {
          linkId,
          deliveryType: type,
          recipient
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      toast.success(`Link sent to client via ${type === 'email' ? 'email' : 'SMS'}`);
    } catch (error) {
      console.error(`Error sending link via ${type}:`, error);
      toast.error(`Failed to send link via ${type}. Please try again.`);
    } finally {
      setIsSending(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleCreate = async () => {
    if (!user || !clientName.trim() || !clientEmail.trim()) {
      toast.error("Please enter client name and email");
      return;
    }

    // If SMS delivery is selected, validate phone number
    if (deliveryMethods.sms && !clientPhone.trim()) {
      toast.error("Please enter client phone number for SMS delivery");
      return;
    }

    // Simple phone validation if provided
    if (clientPhone) {
      const phoneRegex = /^\+?[0-9\s\-\(\)]+$/;
      if (!phoneRegex.test(clientPhone)) {
        toast.error("Please enter a valid phone number");
        return;
      }
    }

    // Ensure at least one delivery method is selected
    if (!deliveryMethods.email && !deliveryMethods.sms) {
      toast.error("Please select at least one delivery method");
      return;
    }

    setIsCreating(true);
    try {
      const { link, linkId } = await createClientAccessLink(
        user.id, 
        clientEmail, 
        clientName, 
        clientPhone, 
        deliveryMethods
      );
      
      if (link && linkId) {
        // Create a mock ClientAccessLink object for the UI
        const newLink: ClientAccessLink = {
          id: linkId,
          designerId: user.id,
          clientEmail,
          clientName,
          clientPhone: clientPhone || null,
          token: link.split("clientToken=")[1]?.split("&")[0] || "",
          createdAt: new Date(),
          expiresAt: new Date(new Date().setDate(new Date().getDate() + 14)),
          lastAccessedAt: null,
          status: "active"
        };
        
        onLinkCreated(newLink);
        
        // Automatically send the link via selected delivery methods
        if (deliveryMethods.email) {
          await sendClientLink(linkId, 'email', clientEmail);
        }
        
        if (deliveryMethods.sms && clientPhone) {
          await sendClientLink(linkId, 'sms', clientPhone);
        }
        
        resetForm();
        toast.success("Client hub link created and sent to the client!");
      }
    } catch (error) {
      console.error("Error creating client link:", error);
      toast.error("Failed to create client link");
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setDeliveryMethods({
      email: true,
      sms: false
    });
  };

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (!value) resetForm();
      onOpenChange(value);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Client Portal Link</DialogTitle>
          <DialogDescription>
            Enter your client's details to generate and send a personalized access link.
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
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="client-phone" className="text-right">
              Phone
            </Label>
            <Input
              id="client-phone"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              className="col-span-3"
              placeholder="+1 (555) 123-4567"
              type="tel"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Delivery
            </Label>
            <div className="col-span-3 space-y-2">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={deliveryMethods.email} 
                  onCheckedChange={(checked) => handleDeliveryMethodChange('email', checked)}
                  id="email-delivery"
                />
                <Label htmlFor="email-delivery" className="flex items-center cursor-pointer">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={deliveryMethods.sms} 
                  onCheckedChange={(checked) => handleDeliveryMethodChange('sms', checked)}
                  id="sms-delivery"
                />
                <Label htmlFor="sms-delivery" className="flex items-center cursor-pointer">
                  <Phone className="h-4 w-4 mr-2" />
                  SMS
                </Label>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={isCreating || !clientName.trim() || !clientEmail.trim() || 
                    (deliveryMethods.sms && !clientPhone.trim()) ||
                    (!deliveryMethods.email && !deliveryMethods.sms)}
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create & Send Link"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
