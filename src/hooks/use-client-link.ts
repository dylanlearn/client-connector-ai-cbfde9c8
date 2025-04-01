
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createClientAccessLink } from "@/utils/client-service";
import { supabase } from "@/integrations/supabase/client";
import { ClientAccessLink } from "@/types/client";
import { Project } from "@/types/project";

interface UseClientLinkProps {
  userId: string;
  projects: Project[];
  onLinkCreated: (link: ClientAccessLink) => void;
}

export const useClientLink = ({ userId, projects, onLinkCreated }: UseClientLinkProps) => {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [deliveryMethods, setDeliveryMethods] = useState<{email: boolean, sms: boolean}>({
    email: true,
    sms: false
  });
  const [isSending, setIsSending] = useState<{[key: string]: boolean}>({});
  const [isCreating, setIsCreating] = useState(false);

  // Prefill client information if a project is selected
  useEffect(() => {
    if (selectedProjectId) {
      const selectedProject = projects.find(p => p.id === selectedProjectId);
      if (selectedProject) {
        setClientName(selectedProject.client_name);
        setClientEmail(selectedProject.client_email);
      }
    }
  }, [selectedProjectId, projects]);

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
    if (!userId || !clientName.trim() || !clientEmail.trim()) {
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
        userId, 
        clientEmail, 
        clientName, 
        clientPhone, 
        deliveryMethods,
        selectedProjectId
      );
      
      if (link && linkId) {
        // Create a mock ClientAccessLink object for the UI
        const newLink: ClientAccessLink = {
          id: linkId,
          designerId: userId,
          projectId: selectedProjectId,
          projectTitle: selectedProjectId 
            ? projects.find(p => p.id === selectedProjectId)?.title || null 
            : null,
          clientEmail,
          clientName,
          clientPhone: clientPhone || null,
          token: link.split("clientToken=")[1]?.split("&")[0] || "",
          createdAt: new Date(),
          expiresAt: new Date(new Date().setDate(new Date().getDate() + 7)),
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
    setSelectedProjectId(null);
    setDeliveryMethods({
      email: true,
      sms: false
    });
  };

  return {
    clientName,
    setClientName,
    clientEmail,
    setClientEmail,
    clientPhone,
    setClientPhone,
    selectedProjectId,
    setSelectedProjectId,
    deliveryMethods,
    handleDeliveryMethodChange,
    isSending,
    isCreating,
    handleCreate,
    resetForm
  };
};
