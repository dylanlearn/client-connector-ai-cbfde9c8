
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TemplatePurchaseDialog from "@/components/templates/TemplatePurchaseDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PublicTemplateMarketplace from "@/components/templates/PublicTemplateMarketplace";
import TemplateGrid from "@/components/templates/TemplateGrid";

// Mock template data - would be fetched from Supabase in production
const mockTemplates = [
  {
    id: "1",
    title: "Agency Website Pack",
    description: "Complete website template pack for digital agencies with 5 pages",
    price: 39,
    previewImageUrl: "/placeholder.svg"
  },
  {
    id: "2",
    title: "E-commerce Starter",
    description: "Fully responsive e-commerce template with product listings and cart",
    price: 49,
    previewImageUrl: "/placeholder.svg"
  },
  {
    id: "3",
    title: "Portfolio Showcase",
    description: "Minimalist portfolio template perfect for designers and creatives",
    price: 29,
    previewImageUrl: "/placeholder.svg"
  }
];

const Templates = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);

  const handlePurchaseClick = (template) => {
    setSelectedTemplate(template);
    setIsPurchaseDialogOpen(true);
  };

  const handlePurchaseComplete = async (purchaseData) => {
    try {
      // Rather than directly using the template_purchases table,
      // we'll use a custom function for now to record the purchase
      // This is a temporary workaround until we update the type definitions
      
      console.log("Recording purchase:", {
        user_id: user?.id || purchaseData.guestUserId,
        template_id: selectedTemplate.id,
        price_paid: selectedTemplate.price,
        customer_name: purchaseData.name,
        customer_email: purchaseData.email,
        transaction_id: `tr_${Date.now()}`
      });
      
      // Using a direct fetch call to work around TypeScript limitations
      // This bypasses the type checking that's causing the error
      const response = await fetch(
        `${process.env.SUPABASE_URL || "https://bmkhbqxukiakhafqllux.supabase.co"}/rest/v1/rpc/record_template_purchase`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJta2hicXh1a2lha2hhZnFsbHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0ODY2OTksImV4cCI6MjA1OTA2MjY5OX0.uqt5fokVkLgGQOlqF2BLiMgW4ZSy9gxkZXy35o97iXI",
            'Authorization': `Bearer ${supabase.auth.getSession().then(({ data }) => data.session?.access_token || "")}`,
          },
          body: JSON.stringify({
            p_user_id: user?.id || purchaseData.guestUserId,
            p_template_id: selectedTemplate.id,
            p_price_paid: selectedTemplate.price,
            p_transaction_id: `tr_${Date.now()}`
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to record purchase');
      }

      toast({
        title: "Purchase Successful!",
        description: `You now have access to the ${selectedTemplate.title} template.`,
      });
      
      setIsPurchaseDialogOpen(false);
    } catch (error) {
      console.error("Purchase error:", error);
      toast({
        title: "Purchase Failed",
        description: "There was a problem processing your purchase. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Render different layouts based on authentication status
  if (!user) {
    return (
      <>
        <PublicTemplateMarketplace 
          templates={mockTemplates}
          onPurchaseClick={handlePurchaseClick}
        />
        {selectedTemplate && (
          <TemplatePurchaseDialog 
            open={isPurchaseDialogOpen}
            onOpenChange={setIsPurchaseDialogOpen}
            template={selectedTemplate}
            onPurchaseComplete={handlePurchaseComplete}
          />
        )}
      </>
    );
  }

  // For authenticated users, show the Dashboard layout
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Template Marketplace</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Featured Templates</CardTitle>
          <CardDescription>
            Pre-made templates to jumpstart your design process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TemplateGrid 
            templates={mockTemplates}
            onPurchaseClick={handlePurchaseClick}
          />
        </CardContent>
      </Card>

      {selectedTemplate && (
        <TemplatePurchaseDialog 
          open={isPurchaseDialogOpen}
          onOpenChange={setIsPurchaseDialogOpen}
          template={selectedTemplate}
          onPurchaseComplete={handlePurchaseComplete}
        />
      )}
    </DashboardLayout>
  );
};

export default Templates;
