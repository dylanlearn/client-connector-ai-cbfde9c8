
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useProjects } from "@/hooks/use-projects";
import { ClientAccessLink } from "@/types/client";
import { useClientLink } from "@/hooks/use-client-link";
import ProjectSelector from "./link-dialog/ProjectSelector";
import ClientInfoFields from "./link-dialog/ClientInfoFields";
import DeliveryMethodsSection from "./link-dialog/DeliveryMethodsSection";

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
  const { user } = useAuth();
  const { projects, isLoading: isLoadingProjects } = useProjects();
  
  const {
    clientName,
    setClientName,
    clientEmail,
    setClientEmail,
    clientPhone,
    setClientPhone,
    personalMessage,
    setPersonalMessage,
    selectedProjectId,
    setSelectedProjectId,
    deliveryMethods,
    handleDeliveryMethodChange,
    isCreating,
    handleCreate,
    resetForm
  } = useClientLink({
    userId: user?.id || '',
    projects: projects as any,
    onLinkCreated
  });

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
            The link will expire in 7 days.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <ProjectSelector
            selectedProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
            projects={projects as any}
            isLoading={isLoadingProjects}
          />
          
          <ClientInfoFields
            clientName={clientName}
            setClientName={setClientName}
            clientEmail={clientEmail}
            setClientEmail={setClientEmail}
            clientPhone={clientPhone}
            setClientPhone={setClientPhone}
            personalMessage={personalMessage}
            setPersonalMessage={setPersonalMessage}
          />

          <DeliveryMethodsSection
            deliveryMethods={deliveryMethods}
            onDeliveryMethodChange={handleDeliveryMethodChange}
          />
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
}
