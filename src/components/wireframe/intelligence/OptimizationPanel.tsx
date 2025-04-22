
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { 
  Route, 
  FileType,
} from 'lucide-react';

import UserFlowAnalysisPanel from './UserFlowAnalysisPanel';
import ContentStructureAnalysisPanel from './ContentStructureAnalysisPanel';

interface OptimizationPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe?: (updated: WireframeData) => void;
}

const OptimizationPanel: React.FC<OptimizationPanelProps> = ({
  wireframe,
  onUpdateWireframe
}) => {
  const [activeTab, setActiveTab] = useState('userflow');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span>AI Optimization Tools</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="userflow" className="flex items-center">
              <Route className="h-4 w-4 mr-1" />
              User Flow
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center">
              <FileType className="h-4 w-4 mr-1" />
              Content Structure
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="userflow" className="p-4">
            <UserFlowAnalysisPanel 
              wireframe={wireframe} 
              onUpdateWireframe={onUpdateWireframe}
            />
          </TabsContent>
          
          <TabsContent value="content" className="p-4">
            <ContentStructureAnalysisPanel 
              wireframe={wireframe} 
              onUpdateWireframe={onUpdateWireframe}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OptimizationPanel;
