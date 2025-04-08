import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { IntakeFormData } from "@/types/intake-form";
import SiteTypeFields from "./site-type-fields/SiteTypeFields";
import { getFormSchema, getDefaultValues, getSiteTypeName } from "./utils/form-helpers";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import { useAIContent } from "@/hooks/ai-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DesignPreferencesFields from "./site-types/DesignPreferencesFields";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WireframeVisualizer } from "@/components/wireframe";

interface SpecificQuestionsStepProps {
  formData: IntakeFormData;
  updateFormData: (data: Partial<IntakeFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isSaving?: boolean;
}

const sampleWireframes = [
  {
    id: "wire-1",
    title: "Modern Business Website",
    description: "Clean, professional design with clear CTAs",
    imageUrl: "/wireframes/business-modern.jpg",
    sections: [
      { 
        id: "hero-1", 
        name: "Hero Section", 
        description: "Bold, minimal hero with single CTA", 
        imageUrl: "/wireframes/sections/hero-1.jpg",
        sectionType: "hero",
        componentVariant: "hero-centered",
        data: {}
      },
      { 
        id: "features-1", 
        name: "Feature Grid", 
        description: "3-column feature highlights with icons", 
        imageUrl: "/wireframes/sections/features-1.jpg",
        sectionType: "feature-grid",
        componentVariant: "feature-grid",
        data: {}
      },
      { 
        id: "testimonial-1", 
        name: "Testimonials", 
        description: "Customer quotes with avatars", 
        imageUrl: "/wireframes/sections/testimonials-1.jpg",
        sectionType: "testimonial",
        componentVariant: "testimonial",
        data: {}
      }
    ],
    version: "1.0",
    lastUpdated: new Date().toLocaleDateString()
  },
  {
    id: "wire-2",
    title: "Bold E-commerce Store",
    description: "Vibrant, image-focused product showcase",
    imageUrl: "/wireframes/ecommerce-bold.jpg",
    sections: [
      { 
        id: "product-grid", 
        name: "Product Grid", 
        description: "Dynamic product listing with filters", 
        imageUrl: "/wireframes/sections/products-1.jpg",
        sectionType: "product-grid",
        componentVariant: "product-grid",
        data: {}
      },
      { 
        id: "product-detail", 
        name: "Product Detail", 
        description: "Comprehensive product information", 
        imageUrl: "/wireframes/sections/product-detail-1.jpg",
        sectionType: "product-detail",
        componentVariant: "product-detail",
        data: {}
      }
    ],
    version: "1.0",
    lastUpdated: new Date().toLocaleDateString()
  },
  {
    id: "wire-3",
    title: "Minimal SaaS Platform",
    description: "Clean, functional interface for SaaS products",
    imageUrl: "/wireframes/saas-minimal.jpg",
    sections: [
      { 
        id: "dashboard", 
        name: "Dashboard", 
        description: "User dashboard with key metrics", 
        imageUrl: "/wireframes/sections/dashboard-1.jpg",
        sectionType: "dashboard",
        componentVariant: "dashboard",
        data: {}
      },
      { 
        id: "features", 
        name: "Features Overview", 
        description: "Visual feature breakdown", 
        imageUrl: "/wireframes/sections/features-2.jpg",
        sectionType: "feature-grid",
        componentVariant: "feature-grid",
        data: {}
      }
    ],
    version: "1.0",
    lastUpdated: new Date().toLocaleDateString()
  }
];

const SpecificQuestionsStep = ({ 
  formData, 
  updateFormData, 
  onNext, 
  onPrevious, 
  isSaving 
}: SpecificQuestionsStepProps) => {
  const siteType = formData.siteType || "business";
  const schema = getFormSchema(siteType);
  const [showTooltips, setShowTooltips] = useState(false);
  const [aiPowered, setAiPowered] = useState(false);
  const [isAiInitializing, setIsAiInitializing] = useState(false);
  const [activeTab, setActiveTab] = useState("requirements");
  const [selectedWireframeId, setSelectedWireframeId] = useState<string | null>(null);
  const [showWireframePreview, setShowWireframePreview] = useState(false);
  const [wireframeTab, setWireframeTab] = useState("wireframe-1");
  const { isGenerating } = useAIContent({
    showToasts: true,
    autoRetry: true
  });
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(siteType, formData),
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (Object.values(value).some(v => v !== undefined)) {
        updateFormData(value as Partial<IntakeFormData>);
      }
    });
    return () => {
      subscription?.unsubscribe?.();
    };
  }, [form, updateFormData]);

  const onSubmit = (values: any) => {
    if (selectedWireframeId) {
      const updatedValues = {...values, wireframeSelection: selectedWireframeId};
      updateFormData(updatedValues);
    } else {
      updateFormData(values);
    }
    onNext();
  };

  const initializeAI = useCallback(async () => {
    setIsAiInitializing(true);
    
    await new Promise(resolve => setTimeout(resolve, 700));
    
    setAiPowered(true);
    setIsAiInitializing(false);
    
    toast("AI examples enabled", {
      description: "Hover over the info icons to see AI-generated example answers tailored to your project"
    });
  }, []);

  const handleAIToggle = (enabled: boolean) => {
    if (enabled) {
      initializeAI();
    } else {
      setAiPowered(false);
    }
  };

  const handleSelectWireframe = (id: string) => {
    setSelectedWireframeId(id);
    toast("Wireframe selected", {
      description: "You can preview this design in the wireframe tab"
    });
  };

  const selectedWireframe = sampleWireframes.find(w => w.id === selectedWireframeId);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="text-sm text-muted-foreground mb-4">
          These questions are tailored to your {getSiteTypeName(siteType)} project. Please provide as much detail as possible.
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Label htmlFor="show-examples" className="text-sm text-gray-500">
              Show example answers
            </Label>
            <Switch
              id="show-examples"
              checked={showTooltips}
              onCheckedChange={setShowTooltips}
            />
          </div>
          
          {showTooltips && (
            <div className="flex items-center space-x-3 mt-2 sm:mt-0">
              <Label htmlFor="ai-powered" className={`text-sm ${isAiInitializing || aiPowered ? 'text-primary' : 'text-gray-500'}`}>
                AI-powered examples
              </Label>
              
              {isAiInitializing ? (
                <div className="flex items-center space-x-2">
                  <LoadingIndicator size="xs" color="border-primary" />
                  <span className="text-xs text-primary">Initializing AI...</span>
                </div>
              ) : (
                <Switch
                  id="ai-powered"
                  checked={aiPowered}
                  onCheckedChange={handleAIToggle}
                  className="data-[state=checked]:bg-primary"
                  disabled={isAiInitializing || isGenerating}
                />
              )}
            </div>
          )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="requirements">Project Requirements</TabsTrigger>
            <TabsTrigger value="design">Design Preferences</TabsTrigger>
            <TabsTrigger value="wireframes">Wireframe Selection</TabsTrigger>
          </TabsList>
          
          <TabsContent value="requirements">
            <SiteTypeFields 
              siteType={siteType} 
              form={form} 
              showTooltips={showTooltips}
              aiPowered={aiPowered && showTooltips}
            />
          </TabsContent>
          
          <TabsContent value="design">
            <DesignPreferencesFields 
              form={form}
              showTooltips={showTooltips}
              aiPowered={aiPowered && showTooltips}
            />
          </TabsContent>
          
          <TabsContent value="wireframes" className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-2">Select a Starting Wireframe</h3>
              <p className="text-sm text-muted-foreground">
                Choose a wireframe that best matches your vision. This will serve as a starting point for your design.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sampleWireframes.map((wireframe) => (
                <Card 
                  key={wireframe.id} 
                  className={`overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                    selectedWireframeId === wireframe.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleSelectWireframe(wireframe.id)}
                >
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg">{wireframe.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{wireframe.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="aspect-video bg-muted/60 overflow-hidden">
                      {wireframe.imageUrl ? (
                        <img 
                          src={wireframe.imageUrl} 
                          alt={wireframe.title} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">No preview</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {selectedWireframeId && (
              <div className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowWireframePreview(!showWireframePreview)}
                >
                  {showWireframePreview ? "Hide Preview" : "Show Full Preview"}
                </Button>
                
                {showWireframePreview && selectedWireframe && (
                  <div className="mt-6">
                    <Tabs value={wireframeTab} onValueChange={setWireframeTab}>
                      <TabsList className="mb-4">
                        <TabsTrigger value="wireframe-1">Desktop View</TabsTrigger>
                        <TabsTrigger value="wireframe-2">Mobile View</TabsTrigger>
                        <TabsTrigger value="wireframe-3">Sections</TabsTrigger>
                      </TabsList>
                      <TabsContent value="wireframe-1">
                        <WireframeVisualizer 
                          wireframe={selectedWireframe} 
                          deviceType="desktop" 
                        />
                      </TabsContent>
                      <TabsContent value="wireframe-2">
                        <WireframeVisualizer 
                          wireframe={selectedWireframe}
                          deviceType="mobile" 
                        />
                      </TabsContent>
                      <TabsContent value="wireframe-3">
                        <WireframeVisualizer 
                          wireframe={selectedWireframe}
                          deviceType="desktop"
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onPrevious}>
            Back
          </Button>
          <Button type="submit" disabled={isAiInitializing}>Continue</Button>
        </div>
      </form>
    </Form>
  );
};

export default SpecificQuestionsStep;
