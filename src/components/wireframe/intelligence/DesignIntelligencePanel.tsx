
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  LayoutTemplate, 
  Accessibility, 
  FileText, 
  Brain, 
  LayoutGrid
} from 'lucide-react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import LayoutAnalysisPanel from './LayoutAnalysisPanel';
import ContentGenerationPanel from './ContentGenerationPanel';
import AccessibilityAnalysisPanel from './AccessibilityAnalysisPanel';
import SmartLayoutAlternativesPanel from './SmartLayoutAlternativesPanel';

interface DesignIntelligencePanelProps {
  wireframe: WireframeData;
  onUpdateWireframe: (updated: WireframeData) => void;
  onClose?: () => void;
}

const DesignIntelligencePanel: React.FC<DesignIntelligencePanelProps> = ({
  wireframe,
  onUpdateWireframe,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('layout');
  
  return (
    <div className="design-intelligence-panel border rounded-lg shadow-sm bg-white">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="flex items-center font-medium">
          <Brain className="h-5 w-5 text-primary mr-2" />
          Design Intelligence
        </h2>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="layout" className="text-xs">
            <LayoutTemplate className="h-4 w-4 mr-1" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="content" className="text-xs">
            <FileText className="h-4 w-4 mr-1" />
            Content
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="text-xs">
            <Accessibility className="h-4 w-4 mr-1" />
            Accessibility
          </TabsTrigger>
          <TabsTrigger value="alternatives" className="text-xs">
            <LayoutGrid className="h-4 w-4 mr-1" />
            Alternatives
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="layout" className="pt-4">
          <LayoutAnalysisPanel
            wireframe={wireframe}
            onUpdate={onUpdateWireframe}
          />
        </TabsContent>
        
        <TabsContent value="content" className="pt-4">
          <ContentGenerationPanel 
            wireframe={wireframe}
            onUpdate={onUpdateWireframe}
          />
        </TabsContent>
        
        <TabsContent value="accessibility" className="pt-4">
          <AccessibilityAnalysisPanel
            wireframe={wireframe}
            onUpdate={onUpdateWireframe}
          />
        </TabsContent>
        
        <TabsContent value="alternatives" className="pt-4">
          <SmartLayoutAlternativesPanel
            wireframe={wireframe}
            onUpdate={onUpdateWireframe}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DesignIntelligencePanel;
