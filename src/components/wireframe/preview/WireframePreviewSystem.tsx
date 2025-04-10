
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { DeviceType, DEVICE_DIMENSIONS, mapDeviceType } from './DeviceInfo';
import PreviewDisplay from './PreviewDisplay';
import PreviewHeader from './PreviewHeader';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { exportWireframe } from '@/utils/wireframe/export-utils';
import WireframeExportDialog from '../export/WireframeExportDialog';
import { WireframeAnalyticsService } from '@/services/analytics/wireframe-analytics-service';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { Maximize2, Minimize2, Code, Download, Copy, Wrench } from 'lucide-react';

interface WireframePreviewSystemProps {
  wireframe: WireframeData;
  defaultDevice?: DeviceType;
  darkMode?: boolean;
  onSectionClick?: (sectionId: string) => void;
  onExport?: (format: string) => void;
  projectId?: string;
}

const WireframePreviewSystem: React.FC<WireframePreviewSystemProps> = ({
  wireframe,
  defaultDevice = 'desktop',
  darkMode: initialDarkMode = false,
  onSectionClick,
  onExport,
  projectId
}) => {
  const { user } = useAuth();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [deviceType, setDeviceType] = useState<DeviceType>(defaultDevice);
  const [previousDevice, setPreviousDevice] = useState<DeviceType>(defaultDevice);
  const [isRotated, setIsRotated] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [darkMode, setDarkMode] = useState(initialDarkMode);
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'developer'>('preview');
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Calculate device dimensions
  const currentDimensions = useCallback(() => {
    const dimensions = { ...DEVICE_DIMENSIONS[deviceType] };
    
    // Swap dimensions if rotated (except desktop)
    if (isRotated && deviceType !== 'desktop') {
      return { 
        ...dimensions,
        width: dimensions.height,
        height: dimensions.width,
        name: `${dimensions.name} (Rotated)`
      };
    }
    
    return dimensions;
  }, [deviceType, isRotated]);
  
  // Format dimensions for display
  const formatDimensions = useCallback(() => {
    const dimensions = currentDimensions();
    return `${dimensions.width} × ${dimensions.height}`;
  }, [currentDimensions]);
  
  // Handle device rotation
  const handleRotate = useCallback(() => {
    if (deviceType === 'desktop') return;
    setIsRotated(prev => !prev);
  }, [deviceType]);
  
  // Handle device type change with analytics tracking
  const handleDeviceChange = useCallback((device: DeviceType) => {
    setPreviousDevice(deviceType);
    setDeviceType(device);
    
    // Reset rotation when changing devices
    setIsRotated(false);
    
    // Track device change in analytics
    if (user && wireframe) {
      WireframeAnalyticsService.trackDeviceChange(
        user.id,
        wireframe.id,
        deviceType,
        device
      );
    }
  }, [deviceType, user, wireframe]);
  
  // Handle export with onExport callback and analytics
  const handleExport = useCallback((format: string) => {
    // Call onExport callback if provided
    if (onExport) {
      onExport(format);
    }
    
    // Track export in analytics
    if (user && wireframe) {
      WireframeAnalyticsService.trackExport(
        user.id,
        wireframe.id,
        format
      );
    }
    
    // Show export dialog for advanced export options
    setShowExportDialog(true);
  }, [onExport, user, wireframe]);

  // Copy wireframe JSON to clipboard
  const handleCopyJSON = useCallback(() => {
    try {
      const wireframeJson = JSON.stringify(wireframe, null, 2);
      navigator.clipboard.writeText(wireframeJson);
      toast('Wireframe JSON copied to clipboard');
    } catch (error) {
      console.error('Error copying wireframe JSON:', error);
      toast('Failed to copy wireframe JSON');
    }
  }, [wireframe]);

  // Toggle fullscreen mode
  const toggleFullscreen = useCallback(() => {
    setFullscreen(prev => !prev);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  // Track section views
  const handleSectionClick = useCallback((sectionId: string) => {
    if (onSectionClick) {
      onSectionClick(sectionId);
    }
    
    // Track section view in analytics
    if (user && wireframe) {
      const section = wireframe.sections.find(s => s.id === sectionId);
      if (section) {
        WireframeAnalyticsService.trackSectionView(
          user.id,
          wireframe.id,
          sectionId,
          section.sectionType || 'unknown'
        );
      }
    }
  }, [onSectionClick, user, wireframe]);

  return (
    <div className={`wireframe-preview-system ${fullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      <Card className="h-full shadow-sm border">
        <CardHeader className="p-0">
          <PreviewHeader
            activeDevice={deviceType}
            isRotated={isRotated}
            onDeviceChange={handleDeviceChange}
            onRotate={handleRotate}
            formatDimensions={formatDimensions}
            wireframeId={wireframe.id}
            onFeedbackClick={() => {
              // Feedback functionality could be implemented here
              toast('Feedback functionality would be shown here');
            }}
            onCompareClick={() => {
              // Compare functionality could be implemented here
              toast('Compare functionality would be shown here');
            }}
            showCompare={true}
          />
          
          <div className="border-b">
            <Tabs defaultValue="preview" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
              <div className="flex justify-between px-4 pt-1">
                <TabsList>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="developer">Developer</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline" 
                    size="icon"
                    onClick={toggleDarkMode}
                    className="h-8 w-8"
                    title={darkMode ? "Light Mode" : "Dark Mode"}
                  >
                    {darkMode ? "🌞" : "🌙"}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="h-8 w-8"
                    title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleExport('any')}
                    className="h-8 w-8"
                    title="Export"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Tabs>
          </div>
        </CardHeader>
        
        <CardContent className={`p-0 ${fullscreen ? 'h-[calc(100vh-112px)]' : 'h-[500px]'}`}>
          <TabsContent value="preview" className="m-0 h-full">
            <div className="flex h-full">
              <div className="hidden lg:block lg:w-64 border-r p-4">
                <h3 className="font-medium text-sm mb-2">Sections</h3>
                <ScrollArea className="h-[calc(100%-2rem)]">
                  <div className="space-y-1">
                    {wireframe.sections.map((section) => (
                      <div 
                        key={section.id}
                        className="px-2 py-1.5 text-sm rounded hover:bg-accent/10 cursor-pointer"
                        onClick={() => handleSectionClick(section.id)}
                      >
                        {section.name || section.sectionType || 'Unnamed Section'}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              <div ref={canvasRef} className="flex-1 flex items-center justify-center p-4 overflow-auto">
                <PreviewDisplay
                  currentDimensions={currentDimensions()}
                  darkMode={darkMode}
                  wireframe={wireframe}
                  deviceType={mapDeviceType(deviceType)}
                  onSectionClick={handleSectionClick}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="code" className="m-0 h-full">
            <div className="flex h-full">
              <div className="flex-1 p-4">
                <div className="flex justify-between mb-4">
                  <h3 className="font-medium">Wireframe JSON</h3>
                  <Button variant="outline" size="sm" onClick={handleCopyJSON}>
                    <Copy className="h-3.5 w-3.5 mr-1" /> Copy JSON
                  </Button>
                </div>
                <ScrollArea className="h-[calc(100%-3rem)] bg-muted/20 rounded-md border">
                  <pre className="p-4 text-xs font-mono whitespace-pre-wrap">
                    {JSON.stringify(wireframe, null, 2)}
                  </pre>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="developer" className="m-0 h-full">
            <div className="flex h-full">
              <div className="flex-1 p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <h3 className="text-sm font-medium">Device Information</h3>
                    </CardHeader>
                    <CardContent className="text-xs">
                      <ul className="space-y-1">
                        <li><strong>Type:</strong> {deviceType}</li>
                        <li><strong>Dimensions:</strong> {formatDimensions()}</li>
                        <li><strong>Rotated:</strong> {isRotated ? 'Yes' : 'No'}</li>
                        <li><strong>User Agent:</strong> {typeof window !== 'undefined' ? window.navigator.userAgent.substring(0, 50) + '...' : 'Not available'}</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <h3 className="text-sm font-medium">Wireframe Information</h3>
                    </CardHeader>
                    <CardContent className="text-xs">
                      <ul className="space-y-1">
                        <li><strong>ID:</strong> {wireframe.id}</li>
                        <li><strong>Title:</strong> {wireframe.title}</li>
                        <li><strong>Sections:</strong> {wireframe.sections.length}</li>
                        <li><strong>Project ID:</strong> {projectId || 'Not available'}</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="lg:col-span-2">
                    <CardHeader className="pb-2">
                      <h3 className="text-sm font-medium">Developer Tools</h3>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleExport('html')}>
                          Export HTML
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleExport('json')}>
                          Export JSON
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
                          Export PDF
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleCopyJSON}>
                          Copy JSON
                        </Button>
                        <Button variant="outline" size="sm" onClick={toggleDarkMode}>
                          Toggle Dark Mode
                        </Button>
                        <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                          Toggle Fullscreen
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Card>
      
      <WireframeExportDialog
        wireframe={wireframe}
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        canvasElement={canvasRef.current?.querySelector('canvas') as HTMLCanvasElement}
      />
    </div>
  );
};

export default WireframePreviewSystem;
