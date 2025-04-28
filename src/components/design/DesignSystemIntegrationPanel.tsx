
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaintBucket, Brush, ImageIcon, Database } from "lucide-react";
import { DesignSystemSync } from "./DesignSystemSync";
import { DesignTokenManager } from "./DesignTokenManager";
import { AssetManager } from "./AssetManager";
import { DataSourceConnector } from "./DataSourceConnector";

interface DesignSystemIntegrationPanelProps {
  projectId: string;
  wireframeId: string;
}

export function DesignSystemIntegrationPanel({ projectId, wireframeId }: DesignSystemIntegrationPanelProps) {
  const [activeTab, setActiveTab] = useState<string>('tokens');
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Design System Integration</CardTitle>
        <CardDescription>
          Manage design tokens, assets, and data connections for your wireframes
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tokens" className="flex items-center">
              <PaintBucket className="h-4 w-4 mr-2" />
              Design Tokens
            </TabsTrigger>
            <TabsTrigger value="sync" className="flex items-center">
              <Brush className="h-4 w-4 mr-2" />
              Sync System
            </TabsTrigger>
            <TabsTrigger value="assets" className="flex items-center">
              <ImageIcon className="h-4 w-4 mr-2" />
              Assets
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center">
              <Database className="h-4 w-4 mr-2" />
              Data Sources
            </TabsTrigger>
          </TabsList>
          
          <div className="pt-4">
            <TabsContent value="tokens">
              <DesignTokenManager projectId={projectId} />
            </TabsContent>
            
            <TabsContent value="sync">
              <DesignSystemSync projectId={projectId} wireframeId={wireframeId} />
            </TabsContent>
            
            <TabsContent value="assets">
              <AssetManager projectId={projectId} wireframeId={wireframeId} />
            </TabsContent>
            
            <TabsContent value="data">
              <DataSourceConnector projectId={projectId} wireframeId={wireframeId} />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
