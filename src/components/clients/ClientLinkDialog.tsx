
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
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();

  const handleCreate = async () => {
    if (!user || !clientName.trim() || !clientEmail.trim()) {
      toast.error("Please enter both client name and email");
      return;
    }

    setIsCreating(true);
    try {
      const linkUrl = await createClientAccessLink(user.id, clientEmail, clientName);
      if (linkUrl) {
        toast.success("Client hub link generated! It will expire in 14 days.");
        
        // Create a mock ClientAccessLink object for the UI
        // In a real implementation, we would get the full object from the API
        const newLink: ClientAccessLink = {
          id: Math.random().toString(), // This is just for the UI
          designerId: user.id,
          clientEmail,
          clientName,
          token: linkUrl.split("clientToken=")[1]?.split("&")[0] || "",
          createdAt: new Date(),
          expiresAt: new Date(new Date().setDate(new Date().getDate() + 14)),
          lastAccessedAt: null,
          status: "active"
        };
        
        onLinkCreated(newLink);
        resetForm();
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
            Enter your client's details to generate a personalized access link.
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={isCreating || !clientName.trim() || !clientEmail.trim()}
          >
            {isCreating ? "Creating..." : "Create Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
