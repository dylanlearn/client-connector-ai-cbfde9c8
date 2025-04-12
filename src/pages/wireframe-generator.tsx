
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ComponentRegistration } from "@/components/wireframe/registry/ComponentRegistration";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { AdvancedWireframeGenerator } from "@/components/wireframe"; 
import { v4 as uuidv4 } from "uuid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { WireframeGenerationResult } from "@/services/ai/wireframe/wireframe-types";

const WireframeGenerator = () => {
  // Use a real UUID for the project ID rather than a demo ID
  const [projectId] = useState(() => uuidv4());
  const { toast } = useToast();
  const [currentWireframe, setCurrentWireframe] = useState<WireframeGenerationResult | null>(null);
  
  return (
    <div className="container mx-auto p-6">
      {/* Register components */}
      <ComponentRegistration />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Wireframe Generator</h1>
        <p className="text-muted-foreground">
          Create wireframes by describing your layout needs
        </p>
      </div>
      
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>How to Use the Wireframe Generator</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            Enter a detailed description of the wireframe you want to generate. For best results:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Include specific sections (navigation, hero, features, etc.)</li>
            <li>Describe the layout structure</li>
            <li>Mention responsive behavior if needed</li>
            <li>Specify any special requirements</li>
          </ul>
          <p className="mt-2">
            Example: "Generate a landing page with sticky navigation, hero section, 3-column feature grid, 
            testimonials slider, pricing table, and footer."
          </p>
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="generator">
        <TabsList className="mb-4">
          <TabsTrigger value="generator">Wireframe Generator</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator">
          <TooltipProvider>
            <AdvancedWireframeGenerator 
              projectId={projectId}
              viewMode="edit"
              onWireframeGenerated={(wireframe) => {
                setCurrentWireframe(wireframe);
                toast({
                  title: "Wireframe Generated",
                  description: "Your wireframe has been created successfully",
                });
              }}
              onError={(err) => {
                toast({
                  title: "Generation Failed",
                  description: err.message,
                  variant: "destructive"
                });
              }}
            />
          </TooltipProvider>
        </TabsContent>
        
        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample templates will go here */}
            <div className="border rounded-lg p-4 text-center flex flex-col items-center justify-center h-60">
              <p className="text-muted-foreground">Template gallery coming soon</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WireframeGenerator;
