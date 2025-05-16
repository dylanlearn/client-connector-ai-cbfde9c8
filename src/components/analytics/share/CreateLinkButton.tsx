
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ClientInfoForm from "./ClientInfoForm";
import { useAuth } from "@/hooks/useAuth";
import { createClientAccessLink } from "@/utils/client-service";
import { toast } from "sonner";

interface CreateLinkButtonProps {
  onLinkCreated: (link: string, linkId: string) => void;
}

const CreateLinkButton = ({ onLinkCreated }: CreateLinkButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();

  const handleGenerateLink = () => {
    if (!user) {
      toast.error("You must be logged in to generate a share link");
      return;
    }
    
    setIsDialogOpen(true);
  };

  const handleCreateClientLink = async () => {
    if (!user || !clientName.trim() || !clientEmail.trim()) {
      toast.error("Please enter both client name and email");
      return;
    }

    setIsCreating(true);
    try {
      const result = await createClientAccessLink(
        user.id, 
        clientEmail, 
        clientName,
        null,
        { email: true, sms: false },
        selectedProjectId
      );
      
      if (result && result.link) {
        onLinkCreated(result.link, result.linkId);
        setIsDialogOpen(false);
        toast.success("Client hub link generated! It will expire in 7 days.");
      }
    } catch (error) {
      console.error("Error creating client link:", error);
      toast.error("Failed to generate client link");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <Button 
        onClick={handleGenerateLink}
        variant="outline"
        className="w-full sm:w-auto"
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Create client portal link
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Client Portal Link</DialogTitle>
            <DialogDescription>
              Enter your client's details to generate a personalized access link.
            </DialogDescription>
          </DialogHeader>
          
          <ClientInfoForm 
            clientName={clientName}
            setClientName={setClientName}
            clientEmail={clientEmail}
            setClientEmail={setClientEmail}
            selectedProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateClientLink} 
              disabled={isCreating || !clientName.trim() || !clientEmail.trim()}
            >
              {isCreating ? "Creating..." : "Create Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateLinkButton;
