
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
  LayoutGrid,
  Lightbulb,
  Puzzle,
  Route,
  BookOpen
} from 'lucide-react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import LayoutAnalysisPanel from './LayoutAnalysisPanel';
import ContentGenerationPanel from './ContentGenerationPanel';
import AccessibilityAnalysisPanel from './AccessibilityAnalysisPanel';
import SmartLayoutAlternativesPanel from './SmartLayoutAlternativesPanel';
import DesignPrincipleAnalysisPanel from './DesignPrincipleAnalysisPanel';
import ComponentRecommendationPanel from './ComponentRecommendationPanel';
import UserFlowAnalysisPanel from './UserFlowAnalysisPanel';
import ContentStructureAnalysisPanel from './ContentStructureAnalysisPanel';

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
        <TabsList className="grid grid-cols-8">
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
          <TabsTrigger value="principles" className="text-xs">
            <Lightbulb className="h-4 w-4 mr-1" />
            Principles
          </TabsTrigger>
          <TabsTrigger value="components" className="text-xs">
            <Puzzle className="h-4 w-4 mr-1" />
            Components
          </TabsTrigger>
          <TabsTrigger value="userflow" className="text-xs">
            <Route className="h-4 w-4 mr-1" />
            User Flow
          </TabsTrigger>
          <TabsTrigger value="structure" className="text-xs">
            <BookOpen className="h-4 w-4 mr-1" />
            Structure
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
            onContentGenerated={(content) => {
              // Handle generated content if needed
              console.log('Content generated:', content);
            }}
            onUpdate={onUpdateWireframe}
          />
        </TabsContent>
        
        <TabsContent value="accessibility" className="pt-4">
          <AccessibilityAnalysisPanel
            wireframe={wireframe}
            onUpdateWireframe={onUpdateWireframe}
          />
        </TabsContent>
        
        <TabsContent value="alternatives" className="pt-4">
          <SmartLayoutAlternativesPanel
            wireframe={wireframe}
            onUpdateWireframe={onUpdateWireframe}
          />
        </TabsContent>
        
        <TabsContent value="principles" className="pt-4">
          <DesignPrincipleAnalysisPanel
            wireframe={wireframe}
            onUpdateWireframe={onUpdateWireframe}
          />
        </TabsContent>
        
        <TabsContent value="components" className="pt-4">
          <ComponentRecommendationPanel
            wireframe={wireframe}
            onUpdateWireframe={onUpdateWireframe}
          />
        </TabsContent>
        
        <TabsContent value="userflow" className="pt-4">
          <UserFlowAnalysisPanel
            wireframe={wireframe}
            onUpdateWireframe={onUpdateWireframe}
          />
        </TabsContent>
        
        <TabsContent value="structure" className="pt-4">
          <ContentStructureAnalysisPanel
            wireframe={wireframe}
            onUpdateWireframe={onUpdateWireframe}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DesignIntelligencePanel;
