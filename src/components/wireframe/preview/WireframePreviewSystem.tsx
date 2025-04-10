
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DeviceType, DEVICE_DIMENSIONS, DeviceDimensions } from './DeviceInfo';
import PreviewHeader from './PreviewHeader';
import PreviewDisplay from './PreviewDisplay';
import { Button } from '@/components/ui/button';
import { Download, Copy, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface WireframePreviewSystemProps {
  wireframe: any;
  onSectionClick?: (sectionId: string) => void;
  onExport?: (format: string) => void;
  projectId?: string;
  className?: string;
}

const WireframePreviewSystem: React.FC<WireframePreviewSystemProps> = ({
  wireframe,
  onSectionClick,
  onExport,
  projectId,
  className = '',
}) => {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('desktop');
  const [previousDevice, setPreviousDevice] = useState<DeviceType | null>(null);
  const [isRotated, setIsRotated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showDevTools, setShowDevTools] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const { toast } = useToast();

  // Device rotation handler
  const handleRotate = useCallback(() => {
    if (activeDevice === 'desktop') return;

    setIsRotated(!isRotated);
    
    // Switch between portrait and landscape modes
    if (activeDevice === 'mobile' && !isRotated) {
      setActiveDevice('mobileLandscape');
    } else if (activeDevice === 'mobileLandscape' && isRotated) {
      setActiveDevice('mobile');
    } else if (activeDevice === 'tablet' && !isRotated) {
      setActiveDevice('tabletLandscape');
    } else if (activeDevice === 'tabletLandscape' && isRotated) {
      setActiveDevice('tablet');
    }
  }, [activeDevice, isRotated]);
  
  // Device change handler
  const handleDeviceChange = useCallback((device: DeviceType) => {
    setPreviousDevice(activeDevice);
    setActiveDevice(device);
    setIsRotated(device === 'mobileLandscape' || device === 'tabletLandscape');
  }, [activeDevice]);
  
  // Format dimensions for display
  const formatDimensions = useCallback(() => {
    const { width, height } = DEVICE_DIMENSIONS[activeDevice];
    return `${width} × ${height}`;
  }, [activeDevice]);

  // Export wireframe
  const handleExport = useCallback((format: string) => {
    if (onExport) {
      onExport(format);
    } else {
      toast({
        title: 'Export functionality',
        description: `Export to ${format.toUpperCase()} will be available soon!`,
        duration: 3000,
      });
    }
  }, [onExport, toast]);

  // Share wireframe
  const handleShare = useCallback(() => {
    if (projectId) {
      const shareUrl = `${window.location.origin}/wireframe-preview/${projectId}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast({
          title: 'Share link copied!',
          description: 'The preview link has been copied to your clipboard',
          duration: 3000,
        });
      });
    } else {
      toast({
        title: 'Cannot share',
        description: 'This wireframe needs to be saved first before sharing',
        duration: 3000,
      });
    }
  }, [projectId, toast]);

  // Toggle comparison view
  const toggleComparison = useCallback(() => {
    setShowComparison(!showComparison);
    if (!showComparison && !previousDevice) {
      // If entering comparison mode and no previous device, set a different device
      if (activeDevice === 'desktop') {
        setPreviousDevice('mobile');
      } else {
        setPreviousDevice('desktop');
      }
    }
  }, [showComparison, previousDevice, activeDevice]);

  // Get current dimensions
  const currentDimensions = DEVICE_DIMENSIONS[activeDevice];
  const comparisonDimensions = previousDevice ? DEVICE_DIMENSIONS[previousDevice] : null;

  return (
    <Card className={`shadow-md overflow-hidden ${className}`}>
      <PreviewHeader
        activeDevice={activeDevice}
        isRotated={isRotated}
        onDeviceChange={handleDeviceChange}
        onRotate={handleRotate}
        formatDimensions={formatDimensions}
        wireframeId={projectId}
        onCompareClick={toggleComparison}
        showCompare={true}
      />

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="px-4 pt-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="devtools" onClick={() => setShowDevTools(true)}>DevTools</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="p-0">
          <CardContent className={`flex flex-col lg:flex-row justify-center p-4 bg-gray-50 dark:bg-gray-900/30 overflow-auto transition-all ${darkMode ? "dark" : ""}`}>
            <div className="flex-1 flex justify-center">
              <PreviewDisplay
                currentDimensions={currentDimensions}
                darkMode={darkMode}
                wireframe={wireframe}
                deviceType={activeDevice}
                onSectionClick={onSectionClick}
              />
            </div>

            {showComparison && comparisonDimensions && (
              <div className="flex-1 flex justify-center mt-4 lg:mt-0 lg:ml-4 border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-4">
                <PreviewDisplay
                  currentDimensions={comparisonDimensions}
                  darkMode={darkMode}
                  wireframe={wireframe}
                  deviceType={previousDevice as DeviceType}
                  onSectionClick={onSectionClick}
                />
              </div>
            )}
          </CardContent>
        </TabsContent>

        <TabsContent value="settings">
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
              <Label htmlFor="dark-mode">Dark Mode</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                id="comparison" 
                checked={showComparison} 
                onCheckedChange={toggleComparison} 
              />
              <Label htmlFor="comparison">Side-by-side Comparison</Label>
            </div>

            {showComparison && (
              <div className="pl-6 pt-2 border-l">
                <p className="text-sm text-muted-foreground mb-2">Comparison Device</p>
                <Tabs 
                  value={previousDevice || 'desktop'} 
                  onValueChange={(v) => setPreviousDevice(v as DeviceType)}
                  className="w-full"
                >
                  <TabsList className="w-full">
                    <TabsTrigger value="desktop" className="flex-1">Desktop</TabsTrigger>
                    <TabsTrigger value="tablet" className="flex-1">Tablet</TabsTrigger>
                    <TabsTrigger value="mobile" className="flex-1">Mobile</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            )}
          </CardContent>
        </TabsContent>

        <TabsContent value="export">
          <CardContent className="space-y-4">
            <h3 className="text-lg font-medium">Export Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => handleExport('png')}
              >
                <Download className="h-4 w-4 mr-2" />
                PNG Image
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleExport('pdf')}
              >
                <Download className="h-4 w-4 mr-2" />
                PDF Document
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleExport('html')}
              >
                <Download className="h-4 w-4 mr-2" />
                HTML Code
              </Button>
            </div>
            <div className="pt-2">
              <Button 
                variant="secondary" 
                className="w-full" 
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Preview Link
              </Button>
            </div>
          </CardContent>
        </TabsContent>

        <TabsContent value="devtools">
          <CardContent className="space-y-4">
            <h3 className="text-lg font-medium">Developer Tools</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                <h4 className="font-medium mb-2">Element Inspector</h4>
                <p className="text-sm text-muted-foreground">
                  Inspect elements in the wireframe. Click on any section to view its properties.
                </p>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                <h4 className="font-medium mb-2">Responsive Checker</h4>
                <p className="text-sm text-muted-foreground">
                  Test your wireframe across different screen sizes.
                </p>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                <h4 className="font-medium mb-2">Performance Metrics</h4>
                <p className="text-sm text-muted-foreground">
                  View rendering performance statistics for your wireframe.
                </p>
              </div>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default WireframePreviewSystem;
