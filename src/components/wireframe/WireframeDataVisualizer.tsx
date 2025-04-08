
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WireframeCanvasEngine } from './canvas';
import { WireframeDataVisualizerProps } from './types';
import { JSONView } from './renderers/JSONView';
import { Button } from '@/components/ui/button';
import { 
  Layers, Code, Grid3X3, Smartphone, Tablet, Monitor, 
  Sun, Moon, Download, Share2, Eye 
} from 'lucide-react';

const WireframeDataVisualizer: React.FC<WireframeDataVisualizerProps> = ({
  wireframeData,
  darkMode = false,
  deviceType = 'desktop',
  viewMode = 'preview'
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'data'>('visual');
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'tablet' | 'mobile'>(deviceType);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(darkMode);
  const [currentViewMode, setCurrentViewMode] = useState<'preview' | 'flowchart'>(
    viewMode === 'flowchart' ? 'flowchart' : 'preview'
  );

  // Process wireframe data for visualization
  const processedData = wireframeData || {
    title: "No data",
    description: "No wireframe data available",
    sections: []
  };

  // Handle view mode toggle
  const toggleViewMode = () => {
    setCurrentViewMode(currentViewMode === 'preview' ? 'flowchart' : 'preview');
  };

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Handle device type change
  const handleDeviceChange = (device: 'desktop' | 'tablet' | 'mobile') => {
    setActiveDevice(device);
  };

  // Handle data export
  const handleExport = () => {
    // Create blob and download it
    const dataStr = "data:text/json;charset=utf-8," + 
      encodeURIComponent(JSON.stringify(processedData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `wireframe-${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className={`wireframe-data-visualizer ${isDarkMode ? 'dark' : ''}`}>
      <Card className={isDarkMode ? 'bg-gray-900 text-gray-100 border-gray-800' : ''}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">
              {processedData.title || 'Wireframe Visualization'}
            </CardTitle>
            
            <div className="flex gap-2">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'visual' | 'data')}>
                <TabsList>
                  <TabsTrigger value="visual" className="flex items-center gap-1">
                    <Layers className="h-4 w-4" />
                    Visual
                  </TabsTrigger>
                  <TabsTrigger value="data" className="flex items-center gap-1">
                    <Code className="h-4 w-4" />
                    Data
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-3 flex justify-between">
            <div className="flex gap-2">
              {/* Device switcher */}
              <Button
                variant={activeDevice === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDeviceChange('desktop')}
                className="px-2"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={activeDevice === 'tablet' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDeviceChange('tablet')}
                className="px-2"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={activeDevice === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleDeviceChange('mobile')}
                className="px-2"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
              
              {/* View mode toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleViewMode}
                className="ml-2"
              >
                {currentViewMode === 'preview' ? (
                  <>
                    <Grid3X3 className="h-4 w-4 mr-1" />
                    Flowchart
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex gap-2">
              {/* Dark mode toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleDarkMode}
                className="px-2"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              
              {/* Export button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="px-2"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="relative">
            {activeTab === 'visual' ? (
              <div>
                {processedData.sections && processedData.sections.length > 0 ? (
                  <WireframeCanvasEngine
                    sections={processedData.sections}
                    darkMode={isDarkMode}
                    deviceType={activeDevice}
                    readOnly={true}
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 border border-dashed rounded-md">
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                      No sections available to display
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <JSONView data={processedData} darkMode={isDarkMode} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WireframeDataVisualizer;
