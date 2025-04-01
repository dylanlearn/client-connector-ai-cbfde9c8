
import { useState } from "react";
import { PaintBucket, PlusCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import EmptyState from "@/components/dashboard/EmptyState";
import TemplatePurchaseDialog from "@/components/templates/TemplatePurchaseDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
      
      // Use a custom RPC function or projects table temporarily
      // Instead of: supabase.from("template_purchases").insert({...})
      const { error } = await supabase.rpc('record_template_purchase', {
        p_user_id: user?.id || purchaseData.guestUserId,
        p_template_id: selectedTemplate.id,
        p_price_paid: selectedTemplate.price,
        p_transaction_id: `tr_${Date.now()}`
      });

      if (error) throw error;

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
          {mockTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTemplates.map((template) => (
                <Card key={template.id} className="overflow-hidden border hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-muted">
                    <img 
                      src={template.previewImageUrl} 
                      alt={template.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <span className="font-bold text-lg">${template.price}</span>
                    <Button onClick={() => handlePurchaseClick(template)}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Purchase
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState 
              title="Coming Soon"
              description="Our template marketplace will be available shortly. Stay tuned!"
              buttonText="Create Custom Template"
              buttonAction={() => {}}
              icon={PaintBucket}
            />
          )}
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
