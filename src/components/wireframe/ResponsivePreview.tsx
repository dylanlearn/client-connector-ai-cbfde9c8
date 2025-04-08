
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, Tablet, Smartphone, RotateCcw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import WireframeCanvas from './WireframeCanvas';
import { useWireframeStore } from '@/stores/wireframe-store';

const DEVICE_DIMENSIONS = {
  desktop: { 
    width: '100%', 
    height: '600px',
    label: 'Desktop (1024px+)'
  },
  tablet: { 
    width: '768px', 
    height: '1024px',
    label: 'Tablet (768px)'
  },
  tabletLandscape: {
    width: '1024px',
    height: '768px',
    label: 'Tablet Landscape'
  },
  mobile: { 
    width: '375px', 
    height: '667px',
    label: 'Mobile (375px)'
  },
  mobileLandscape: {
    width: '667px',
    height: '375px',
    label: 'Mobile Landscape'
  },
  mobileSm: {
    width: '320px',
    height: '568px',
    label: 'Small Mobile (320px)'
  }
};

type DeviceType = keyof typeof DEVICE_DIMENSIONS;

interface ResponsivePreviewProps {
  className?: string;
  onSectionClick?: (sectionId: string) => void;
}

const ResponsivePreview: React.FC<ResponsivePreviewProps> = ({ className, onSectionClick }) => {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('desktop');
  const [isRotated, setIsRotated] = useState(false);
  const { darkMode, wireframe } = useWireframeStore();
  
  // Handle device rotation
  const handleRotate = () => {
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
  };
  
  // Handle device change
  const handleDeviceChange = (device: DeviceType) => {
    setActiveDevice(device);
    setIsRotated(device === 'mobileLandscape' || device === 'tabletLandscape');
  };
  
  // Get current dimensions
  const currentDimensions = DEVICE_DIMENSIONS[activeDevice];
  
  // Format device dimensions for display
  const formatDimensions = () => {
    const { width, height } = currentDimensions;
    return `${width} × ${height}`;
  };
  
  return (
    <Card className={cn("shadow-md overflow-hidden", className)}>
      <CardHeader className="pb-3 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">
            Multi-Device Preview
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {formatDimensions()}
            </span>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRotate}
                    disabled={activeDevice === 'desktop'}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Rotate device</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs
          value={activeDevice}
          onValueChange={(v) => handleDeviceChange(v as DeviceType)}
          className="w-full mt-2"
        >
          <TabsList className="w-full">
            <TabsTrigger value="desktop" className="flex items-center gap-1 w-full">
              <Monitor className="h-4 w-4" />
              <span className="hidden md:inline">Desktop</span>
            </TabsTrigger>
            <TabsTrigger value="tablet" className="flex items-center gap-1 w-full">
              <Tablet className="h-4 w-4" />
              <span className="hidden md:inline">Tablet</span>
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex items-center gap-1 w-full">
              <Smartphone className="h-4 w-4" />
              <span className="hidden md:inline">Mobile</span>
            </TabsTrigger>
            <TabsTrigger value="mobileSm" className="flex items-center gap-1 w-full">
              <Smartphone className="h-4 w-4" />
              <span className="hidden md:inline">Small</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent className={cn(
        "flex justify-center p-4 bg-gray-50 dark:bg-gray-900/30 overflow-auto transition-all",
        darkMode ? "dark" : "",
      )}>
        <div 
          className={cn(
            "flex items-center justify-center transition-all duration-300 overflow-hidden", 
            darkMode ? "bg-gray-900" : "bg-white",
            "border rounded-md shadow-sm"
          )}
          style={{
            width: currentDimensions.width,
            height: currentDimensions.height,
            maxHeight: '80vh'
          }}
        >
          <div className="w-full h-full overflow-auto">
            <WireframeCanvas
              className="border-0 shadow-none"
              deviceType={activeDevice.includes('mobile') 
                ? 'mobile' 
                : activeDevice.includes('tablet') ? 'tablet' : 'desktop'
              }
              onSectionClick={onSectionClick}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponsivePreview;
