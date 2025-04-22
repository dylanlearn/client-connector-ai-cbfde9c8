
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Braces, FileBarChart, Brush, Boxes, LayoutGrid, MoveHorizontal } from 'lucide-react';
import { StyleConsistencyPanel } from './StyleConsistencyPanel';
import { DesignDecisionPanel } from './DesignDecisionPanel';
import { ContentGenerationPanel } from './ContentGenerationPanel';
import { UserFlowAnalysisPanel } from './UserFlowAnalysisPanel';
import { ContentStructureAnalysisPanel } from './ContentStructureAnalysisPanel';
import { OptimizationPanel } from './OptimizationPanel';
import { ComponentCompositionPanel } from './ComponentCompositionPanel';
import { ComponentConstraintPanel } from './ComponentConstraintPanel';

interface DesignIntelligencePanelProps {
  wireframe: WireframeData;
  onUpdateWireframe?: (updated: WireframeData) => void;
}

const DesignIntelligencePanel: React.FC<DesignIntelligencePanelProps> = ({
  wireframe,
  onUpdateWireframe
}) => {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Braces className="h-5 w-5" />
          Design Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="optimizations">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="optimizations">
              <FileBarChart className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Optimizations</span>
            </TabsTrigger>
            <TabsTrigger value="styles">
              <Brush className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Styles</span>
            </TabsTrigger>
            <TabsTrigger value="components">
              <Boxes className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Components</span>
            </TabsTrigger>
            <TabsTrigger value="constraints">
              <LayoutGrid className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Constraints</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="optimizations" className="space-y-4">
            <Tabs defaultValue="user-flow">
              <TabsList className="w-full">
                <TabsTrigger value="user-flow">User Flow</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="optimization">Optimization</TabsTrigger>
              </TabsList>
              
              <TabsContent value="user-flow">
                <UserFlowAnalysisPanel 
                  wireframe={wireframe} 
                  onUpdateWireframe={onUpdateWireframe} 
                />
              </TabsContent>
              
              <TabsContent value="content">
                <ContentStructureAnalysisPanel 
                  wireframe={wireframe} 
                  onUpdateWireframe={onUpdateWireframe} 
                />
              </TabsContent>
              
              <TabsContent value="optimization">
                <OptimizationPanel 
                  wireframe={wireframe} 
                  onUpdateWireframe={onUpdateWireframe} 
                />
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          <TabsContent value="styles" className="space-y-4">
            <Tabs defaultValue="consistency">
              <TabsList className="w-full">
                <TabsTrigger value="consistency">Style Consistency</TabsTrigger>
                <TabsTrigger value="decisions">Design Decisions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="consistency">
                <StyleConsistencyPanel 
                  wireframe={wireframe} 
                  onUpdateWireframe={onUpdateWireframe} 
                />
              </TabsContent>
              
              <TabsContent value="decisions">
                <DesignDecisionPanel 
                  wireframe={wireframe} 
                  onUpdateWireframe={onUpdateWireframe} 
                />
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          <TabsContent value="components" className="space-y-4">
            <ComponentCompositionPanel 
              wireframe={wireframe} 
              onUpdateWireframe={onUpdateWireframe} 
            />
          </TabsContent>
          
          <TabsContent value="constraints" className="space-y-4">
            <ComponentConstraintPanel 
              wireframe={wireframe} 
              onUpdateWireframe={onUpdateWireframe} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DesignIntelligencePanel;
