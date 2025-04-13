
import React, { useState, useCallback } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DeviceType, ViewMode } from './types';
import WireframeVisualizer from './WireframeVisualizer';
import WireframeAISuggestions from './ai/WireframeAISuggestions';
import WireframeCanvasFabric from './WireframeCanvasFabric';

interface EnhancedWireframeStudioProps {
  projectId: string;
  initialData?: any;
  standalone?: boolean;
  onUpdate?: (wireframe: any) => void;
  onExport?: (format: string) => void;
}

const EnhancedWireframeStudio: React.FC<EnhancedWireframeStudioProps> = ({
  projectId,
  initialData,
  standalone = false,
  onUpdate,
  onExport,
}) => {
  const [wireframeData, setWireframeData] = useState(initialData || {
    id: 'new-wireframe',
    title: 'New Wireframe',
    sections: [],
  });
  const [viewMode, setViewMode] = useState<ViewMode>('edit');
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  const handleDeviceChange = (device: DeviceType) => {
    setDeviceType(device);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleSectionClick = (sectionId: string) => {
    setSelectedSection(sectionId);
  };

  const handleAISuggestionsToggle = () => {
    setShowAISuggestions(!showAISuggestions);
  };

  const handleWireframeUpdate = (updatedWireframe: any) => {
    setWireframeData(updatedWireframe);
    if (onUpdate) {
      onUpdate(updatedWireframe);
    }
  };

  const handleExport = useCallback((format: string) => {
    if (onExport) {
      onExport(format);
    } else {
      // Default export behavior when no handler is provided
      console.log(`Export requested in ${format} format`);
      
      // For image export, we can use the browser's capabilities
      if (format === 'png' || format === 'jpg') {
        // This is a simplified version - in real implementation,
        // you'd use a canvas or html2canvas to generate the image
        const wireframeElement = document.querySelector('.wireframe-content');
        if (wireframeElement) {
          // Logic to convert the element to an image would go here
          console.log('Converting wireframe to image...');
        }
      }
    }
  }, [onExport]);

  return (
    <div className="enhanced-wireframe-studio w-full">
      <div className="toolbar flex justify-between items-center mb-4">
        <div className="device-controls flex space-x-2">
          <Button
            size="sm"
            variant={deviceType === 'desktop' ? 'default' : 'outline'}
            onClick={() => handleDeviceChange('desktop')}
          >
            Desktop
          </Button>
          <Button
            size="sm"
            variant={deviceType === 'tablet' ? 'default' : 'outline'}
            onClick={() => handleDeviceChange('tablet')}
          >
            Tablet
          </Button>
          <Button
            size="sm"
            variant={deviceType === 'mobile' ? 'default' : 'outline'}
            onClick={() => handleDeviceChange('mobile')}
          >
            Mobile
          </Button>
        </div>
        
        <div className="view-controls flex space-x-2">
          <Button
            size="sm"
            variant={viewMode === 'edit' ? 'default' : 'outline'}
            onClick={() => handleViewModeChange('edit')}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'preview' ? 'default' : 'outline'}
            onClick={() => handleViewModeChange('preview')}
          >
            Preview
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'code' ? 'default' : 'outline'}
            onClick={() => handleViewModeChange('code')}
          >
            Code
          </Button>
        </div>
        
        <div className="actions flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleAISuggestionsToggle}
          >
            AI Suggestions
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleExport('png')}
          >
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="canvas" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="canvas">Canvas</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="canvas" className="min-h-[600px]">
          <Card>
            <CardContent className="p-0">
              <WireframeCanvasFabric
                projectId={projectId}
                wireframeData={wireframeData}
                onUpdate={handleWireframeUpdate}
                readOnly={false}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview" className="min-h-[600px]">
          <Card>
            <CardContent className="p-6">
              <WireframeVisualizer
                wireframe={wireframeData}
                deviceType={deviceType}
                viewMode={viewMode}
                onSectionClick={handleSectionClick}
                selectedSectionId={selectedSection}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showAISuggestions && (
        <div className="ai-suggestions-panel mt-4">
          <Card>
            <CardContent className="p-4">
              <WireframeAISuggestions
                wireframeId={wireframeData.id}
                wireframe={wireframeData}
                onApplySuggestion={handleWireframeUpdate}
                onClose={handleAISuggestionsToggle}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EnhancedWireframeStudio;
