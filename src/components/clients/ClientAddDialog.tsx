
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { createClientAccessLink } from "@/utils/client-service";
import { useAuth } from "@/hooks/use-auth";
import ClientInfoFields from "./link-dialog/ClientInfoFields";
import DeliveryMethodsSection from "./link-dialog/DeliveryMethodsSection";
import ProjectSelector from "./link-dialog/ProjectSelector";

interface ClientAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ClientAddDialog = ({ open, onOpenChange }: ClientAddDialogProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    industry: 'design',
    personalMessage: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIndustryChange = (value: string) => {
    setFormData(prev => ({ ...prev, industry: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientName || !formData.clientEmail) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    if (!user) {
      toast.error("You must be logged in to create a client");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create a client access link using the existing service with the correct parameters
      await createClientAccessLink(
        user.id,
        formData.clientEmail,
        formData.clientName,
        formData.clientPhone || null,
        { email: true, sms: false },
        null, // projectId
        formData.personalMessage || null
      );
      
      toast.success(`Client ${formData.clientName} added successfully`);
      onOpenChange(false);
      
      // Reset the form
      setFormData({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        industry: 'design',
        personalMessage: '',
      });
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error('Failed to add client. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[485px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Enter client details to add them to your client database.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Client Info Fields */}
          <ClientInfoFields 
            clientName={formData.clientName}
            setClientName={(value) => setFormData(prev => ({ ...prev, clientName: value }))}
            clientEmail={formData.clientEmail}
            setClientEmail={(value) => setFormData(prev => ({ ...prev, clientEmail: value }))}
            clientPhone={formData.clientPhone}
            setClientPhone={(value) => setFormData(prev => ({ ...prev, clientPhone: value }))}
            personalMessage={formData.personalMessage}
            setPersonalMessage={(value) => setFormData(prev => ({ ...prev, personalMessage: value }))}
          />
          
          {/* Industry Selector - Using standard Select from ui */}
          <div className="grid grid-cols-4 items-center gap-4">
            <ProjectSelector
              selectedProjectId={null}
              setSelectedProjectId={() => {}}
              projects={[]}
              isLoading={false}
            />
          </div>
          
          {/* Delivery Methods */}
          <DeliveryMethodsSection
            deliveryMethods={{ email: true, sms: false }}
            onDeliveryMethodChange={() => {}}
          />
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoadingSpinner className="mr-2" size="sm" />
                  Adding...
                </>
              ) : "Add Client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientAddDialog;
