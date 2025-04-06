import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createClientAccessLink } from "@/services/clients";
import { supabase } from "@/integrations/supabase/client";
import { ClientAccessLink } from "@/types/client";
import { Project } from "@/types/project";
import { validatePersonalMessage } from "@/utils/validation-utils";

interface UseClientLinkProps {
  userId: string;
  projects: Project[];
  onLinkCreated: (link: ClientAccessLink) => void;
}

export const useClientLink = ({ userId, projects, onLinkCreated }: UseClientLinkProps) => {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [deliveryMethods, setDeliveryMethods] = useState<{email: boolean, sms: boolean}>({
    email: true,
    sms: false
  });
  const [isSending, setIsSending] = useState<{[key: string]: boolean}>({});
  const [isCreating, setIsCreating] = useState(false);

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
          recipient,
          personalMessage: personalMessage.trim() || null
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

    if (deliveryMethods.sms && !clientPhone.trim()) {
      toast.error("Please enter client phone number for SMS delivery");
      return;
    }

    if (clientPhone) {
      const phoneRegex = /^\+?[0-9\s\-\(\)]+$/;
      if (!phoneRegex.test(clientPhone)) {
        toast.error("Please enter a valid phone number");
        return;
      }
    }

    if (!deliveryMethods.email && !deliveryMethods.sms) {
      toast.error("Please select at least one delivery method");
      return;
    }

    const messageValidation = validatePersonalMessage(personalMessage);
    if (!messageValidation.valid) {
      toast.error(messageValidation.errorMessage || "Invalid personal message");
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
        selectedProjectId,
        personalMessage.trim() || null
      );
      
      if (link && linkId) {
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
          personalMessage: personalMessage.trim() || null,
          token: link.split("clientToken=")[1]?.split("&")[0] || "",
          created_at: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          expires_at: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
          expiresAt: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
          last_accessed_at: null,
          lastAccessedAt: null,
          status: "active"
        };
        
        onLinkCreated(newLink);
        
        if (deliveryMethods.email) {
          await sendClientLink(linkId, 'email', clientEmail);
        }
        
        if (deliveryMethods.sms && clientPhone) {
          await sendClientLink(linkId, 'sms', clientPhone);
        }
        
        resetForm();
        toast.success("Client hub link created and sent to the client!");
      }
    } catch (error: any) {
      console.error("Error creating client link:", error);
      toast.error(error.message || "Failed to create client link");
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setPersonalMessage("");
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
    personalMessage,
    setPersonalMessage,
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
