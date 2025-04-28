
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContentHierarchyVisualizer from '@/components/content-hierarchy/ContentHierarchyVisualizer';
import ContextComponentSelector from '@/components/context-aware/ContextComponentSelector';
import DeviceContextAdapter from '@/components/device-adaptation/DeviceContextAdapter';
import CulturalDesignAdapter from '@/components/cultural-adaptation/CulturalDesignAdapter';
import { DeviceContext } from '@/hooks/use-device-context-adaptation';
import { CulturalContext } from '@/hooks/use-cultural-design-adaptation';
import { AlertMessage } from '@/components/ui/alert-message';

const AdvancedDesignSystemPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('hierarchy');
  const [selectedDeviceContext, setSelectedDeviceContext] = useState<DeviceContext | null>(null);
  const [selectedCulturalContext, setSelectedCulturalContext] = useState<CulturalContext | null>(null);
  const [projectId] = useState('3fa85f64-5717-4562-b3fc-2c963f66afa6'); // Placeholder project ID
  
  const handleSelectComponent = (componentType: string) => {
    console.log('Selected component:', componentType);
    // Here we would typically add the component to the wireframe
  };
  
  const handleDeviceChange = (deviceContext: DeviceContext) => {
    setSelectedDeviceContext(deviceContext);
    console.log('Selected device:', deviceContext.name);
  };
  
  const handleCultureChange = (culturalContext: CulturalContext) => {
    setSelectedCulturalContext(culturalContext);
    console.log('Selected culture:', culturalContext.name);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Advanced Design System</h1>
      <p className="text-muted-foreground mb-6">
        Powerful tools for content hierarchy, contextual components, device adaptation, and cultural design
      </p>
      
      {selectedDeviceContext && selectedCulturalContext && (
        <AlertMessage
          type="info"
          className="mb-6"
        >
          Designing for {selectedDeviceContext.name} in {selectedCulturalContext.region} context
        </AlertMessage>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="hierarchy">Content Hierarchy</TabsTrigger>
          <TabsTrigger value="context">Contextual Components</TabsTrigger>
          <TabsTrigger value="device">Device Adaptation</TabsTrigger>
          <TabsTrigger value="cultural">Cultural Adaptation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hierarchy" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <ContentHierarchyVisualizer projectId={projectId} />
          </div>
        </TabsContent>
        
        <TabsContent value="context" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <ContextComponentSelector 
                onSelectComponent={handleSelectComponent}
              />
            </div>
            <div className="border rounded-md p-6 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Component Preview</h3>
                <p className="text-sm text-muted-foreground">
                  Select a component from the recommendations to preview it here
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="device" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DeviceContextAdapter 
              onCultureChange={handleCultureChange}
              onDeviceChange={handleDeviceChange}
            />
            <div className="border rounded-md p-6 bg-gray-50">
              <h3 className="text-lg font-medium mb-2">Device Adaptation Preview</h3>
              {selectedDeviceContext ? (
                <div>
                  <p className="font-medium">{selectedDeviceContext.name}</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Category: {selectedDeviceContext.category}, Screen: {selectedDeviceContext.screen_size_class}
                  </p>
                  
                  <h4 className="text-sm font-medium mt-4">Input Methods:</h4>
                  <p className="text-sm">{selectedDeviceContext.input_methods?.join(', ')}</p>
                  
                  <h4 className="text-sm font-medium mt-4">Capabilities:</h4>
                  <pre className="text-xs bg-white p-2 rounded border mt-1 overflow-auto">
                    {JSON.stringify(selectedDeviceContext.capabilities, null, 2)}
                  </pre>
                  
                  <h4 className="text-sm font-medium mt-4">Constraints:</h4>
                  <pre className="text-xs bg-white p-2 rounded border mt-1 overflow-auto">
                    {JSON.stringify(selectedDeviceContext.constraints, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Select a device to see adaptation preview
                </p>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="cultural" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CulturalDesignAdapter 
              onCultureChange={handleCultureChange}
            />
            <div className="border rounded-md p-6 bg-gray-50">
              <h3 className="text-lg font-medium mb-2">Cultural Adaptation Preview</h3>
              {selectedCulturalContext ? (
                <div>
                  <p className="font-medium">{selectedCulturalContext.name}</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Region: {selectedCulturalContext.region}, Language: {selectedCulturalContext.language || 'Not specified'}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium">Reading Direction:</h4>
                      <p className="text-sm">
                        {selectedCulturalContext.reading_direction === 'rtl' ? 'Right to Left' : 
                         selectedCulturalContext.reading_direction === 'ttb' ? 'Top to Bottom' : 'Left to Right'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium">Color Preferences:</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedCulturalContext.color_preferences && 
                          Object.entries(selectedCulturalContext.color_preferences).map(([key, value]) => (
                            <div 
                              key={key} 
                              className="w-5 h-5 rounded-full border" 
                              style={{ backgroundColor: String(value) }}
                              title={`${key}: ${value}`}
                            />
                          ))
                        }
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="text-sm font-medium">Layout Preferences:</h4>
                  <pre className="text-xs bg-white p-2 rounded border mt-1 mb-3 overflow-auto">
                    {JSON.stringify(selectedCulturalContext.layout_preferences, null, 2)}
                  </pre>
                  
                  <h4 className="text-sm font-medium">Typography:</h4>
                  <pre className="text-xs bg-white p-2 rounded border mt-1 overflow-auto">
                    {JSON.stringify(selectedCulturalContext.typography_adjustments, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Select a cultural context to see adaptation preview
                </p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedDesignSystemPage;
