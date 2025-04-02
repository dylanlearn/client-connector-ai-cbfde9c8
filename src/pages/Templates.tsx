
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TemplatePurchaseDialog from "@/components/templates/TemplatePurchaseDialog";
import { useAuth } from "@/contexts/AuthContext";
import PublicTemplateMarketplace from "@/components/templates/PublicTemplateMarketplace";
import TemplateGrid from "@/components/templates/TemplateGrid";
import { useTemplatePurchase } from "@/hooks/use-template-purchase";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const checkoutStatus = searchParams.get('checkout');
  const templateId = searchParams.get('template_id');
  
  const {
    selectedTemplate,
    isPurchaseDialogOpen,
    isProcessing,
    handlePurchaseClick,
    handlePurchaseComplete,
    setIsPurchaseDialogOpen
  } = useTemplatePurchase();

  // Handle checkout redirect results
  useEffect(() => {
    if (checkoutStatus === 'success') {
      toast({
        title: "Purchase Successful!",
        description: `You now have access to the template.`,
      });
    } else if (checkoutStatus === 'canceled') {
      toast({
        title: "Purchase Canceled",
        description: "Your template purchase was canceled. No charge was made.",
        variant: "destructive"
      });
    }
  }, [checkoutStatus, templateId, toast]);

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
            isProcessing={isProcessing}
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
          isProcessing={isProcessing}
        />
      )}
    </DashboardLayout>
  );
};

export default Templates;
