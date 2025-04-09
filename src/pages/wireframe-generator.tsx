
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ComponentRegistration } from "@/components/wireframe/registry/ComponentRegistration";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { AdvancedWireframeGenerator } from "@/components/wireframe";
import { v4 as uuidv4 } from "uuid";
import WireframeTest from "@/components/wireframe/WireframeTest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const WireframeGenerator = () => {
  // Use a real UUID for the project ID rather than a demo ID
  const [projectId] = useState(() => uuidv4());
  
  return (
    <DashboardLayout>
      {/* Register components */}
      <ComponentRegistration />
      
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Wireframe Generator</h1>
          <p className="text-muted-foreground">
            Create wireframes by selecting components and customizing your layout
          </p>
        </div>
        
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            You need to be logged in to save wireframes. All changes will be stored in your browser until you log in.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="generator">
          <TabsList className="mb-4">
            <TabsTrigger value="generator">Wireframe Generator</TabsTrigger>
            <TabsTrigger value="test">Wireframe Test</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generator">
            <TooltipProvider>
              <AdvancedWireframeGenerator 
                projectId={projectId}
                viewMode="editor"
              />
            </TooltipProvider>
          </TabsContent>
          
          <TabsContent value="test">
            <WireframeTest />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default WireframeGenerator;
