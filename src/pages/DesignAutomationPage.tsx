
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DesignWorkflowManager } from "@/components/design/workflow/DesignWorkflowManager";
import { ExternalServiceManager } from "@/components/external-service/ExternalServiceManager";
import { PlatformOutputManager } from "@/components/platform-output/PlatformOutputManager";

const DesignAutomationPage: React.FC = () => {
  const { projectId, wireframeId } = useParams<{ projectId: string; wireframeId?: string }>();
  const [activeTab, setActiveTab] = useState('workflow');
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Design Automation</h1>
      
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="workflow">Design-to-Development Workflow</TabsTrigger>
              <TabsTrigger value="services">External Service Connectors</TabsTrigger>
              <TabsTrigger value="platforms">Multi-Platform Output</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="workflow">
                <DesignWorkflowManager 
                  projectId={projectId} 
                  designId={wireframeId}
                />
              </TabsContent>
              
              <TabsContent value="services">
                <ExternalServiceManager 
                  projectId={projectId} 
                />
              </TabsContent>
              
              <TabsContent value="platforms">
                <PlatformOutputManager
                  projectId={projectId}
                  wireframeId={wireframeId}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesignAutomationPage;
