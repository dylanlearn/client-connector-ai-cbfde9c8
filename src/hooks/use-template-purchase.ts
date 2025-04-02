
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface Template {
  id: string;
  title: string;
  description: string;
  price: number;
  previewImageUrl: string;
}

export interface PurchaseFormValues {
  name: string;
  email: string;
}

export function useTemplatePurchase() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchaseClick = (template: Template) => {
    setSelectedTemplate(template);
    setIsPurchaseDialogOpen(true);
  };

  const handlePurchaseComplete = async (purchaseData: PurchaseFormValues) => {
    if (!selectedTemplate) return;
    
    setIsProcessing(true);
    
    try {
      // Create a Stripe checkout session using our edge function
      const { data, error } = await supabase.functions.invoke('create-template-checkout', {
        body: {
          templateId: selectedTemplate.id,
          price: selectedTemplate.price,
          title: selectedTemplate.title,
          guestEmail: !user ? purchaseData.email : undefined,
          guestName: !user ? purchaseData.name : undefined,
          returnUrl: window.location.origin + '/templates'
        }
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to create checkout session');
      }
      
      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
      
    } catch (error) {
      console.error("Purchase error:", error);
      toast({
        title: "Checkout Failed",
        description: "There was a problem setting up the payment. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  return {
    selectedTemplate,
    isPurchaseDialogOpen,
    isProcessing,
    handlePurchaseClick,
    handlePurchaseComplete,
    setIsPurchaseDialogOpen
  };
}
