
import React, { useState, useEffect } from 'react';
import { useResponsive } from '@/contexts/ResponsiveContext';
import { BreakpointInheritanceProvider, BreakpointValues } from './BreakpointInheritance';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { DeviceType, DEVICE_DIMENSIONS } from '../preview/DeviceInfo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, Smartphone, Tablet, RotateCw, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import BreakpointDebugger from './BreakpointDebugger';

interface ResponsivePreviewToolProps {
  children: React.ReactNode;
  className?: string;
  initialWidth?: number;
  showDeviceFrame?: boolean;
  showRulers?: boolean;
  showBreakpoints?: boolean;
  properties?: Record<string, BreakpointValues<any>>;
}

/**
 * A tool for previewing responsive components at different viewport sizes,
 * with built-in breakpoint visualization and property inheritance display.
 */
export const ResponsivePreviewTool: React.FC<ResponsivePreviewToolProps> = ({
  children,
  className,
  initialWidth = 1024,
  showDeviceFrame = true,
  showRulers = true,
  showBreakpoints = true,
  properties = {}
}) => {
  const [previewWidth, setPreviewWidth] = useState<number>(initialWidth);
  const [previewHeight, setPreviewHeight] = useState<number>(600);
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [isRotated, setIsRotated] = useState<boolean>(false);
  const [showTool, setShowTool] = useState<boolean>(true);
  
  // Update device type based on preview width
  useEffect(() => {
    if (previewWidth < 640) {
      setDeviceType('mobile');
    } else if (previewWidth < 1024) {
      setDeviceType('tablet');
    } else {
      setDeviceType('desktop');
    }
  }, [previewWidth]);
  
  // Handle device preset selection
  const selectDevicePreset = (device: DeviceType) => {
    const dimensions = DEVICE_DIMENSIONS[device];
    setPreviewWidth(dimensions.width);
    setPreviewHeight(dimensions.height);
    setDeviceType(device);
    setIsRotated(false);
  };
  
  // Handle rotation
  const rotatePreview = () => {
    setIsRotated(!isRotated);
    setPreviewWidth(previewHeight);
    setPreviewHeight(previewWidth);
  };
  
  // Generate breakpoint indicators
  const renderBreakpointIndicators = () => {
    const breakpoints = [
      { name: 'xs', width: 384 },
      { name: 'sm', width: 640 },
      { name: 'md', width: 768 },
      { name: 'lg', width: 1024 },
      { name: 'xl', width: 1280 },
      { name: '2xl', width: 1536 }
    ];
    
    return (
      <div className="relative h-6 w-full mb-2">
        {breakpoints.map((bp) => (
          <div 
            key={bp.name} 
            className="absolute top-0 flex flex-col items-center" 
            style={{ 
              left: `${Math.min(100, (bp.width / 1536) * 100)}%`,
              transform: 'translateX(-50%)' 
            }}
          >
            <div className="h-3 border-l border-gray-400"></div>
            <span className="text-xs text-gray-500">{bp.name}</span>
          </div>
        ))}
        <div 
          className="absolute top-0 flex flex-col items-center" 
          style={{ 
            left: `${Math.min(100, (previewWidth / 1536) * 100)}%`,
            transform: 'translateX(-50%)' 
          }}
        >
          <div className="h-5 border-l-2 border-primary"></div>
          <span className="text-xs font-bold text-primary">{previewWidth}px</span>
        </div>
      </div>
    );
  };
  
  // Generate horizontal ruler
  const renderRuler = () => {
    const steps = [];
    const stepSize = 100;
    const maxWidth = Math.min(1536, Math.max(previewWidth * 1.5, 1200));
    
    for (let i = 0; i <= maxWidth; i += stepSize) {
      steps.push(
        <div 
          key={i} 
          className="absolute top-0 flex flex-col items-center" 
          style={{ 
            left: `${(i / maxWidth) * 100}%`,
          }}
        >
          <div className="h-3 border-l border-gray-300"></div>
          <span className="text-xs text-gray-400">{i}</span>
        </div>
      );
    }
    
    return (
      <div className="relative h-6 w-full mb-1 mt-1">
        {steps}
      </div>
    );
  };
  
  // Get device icon based on type
  const getDeviceIcon = (type: DeviceType) => {
    switch(type) {
      case 'mobile': return <Smartphone size={18} />;
      case 'tablet': return <Tablet size={18} />;
      default: return <Monitor size={18} />;
    }
  };
  
  return (
    <BreakpointInheritanceProvider>
      <div className={cn("responsive-preview-tool", className)}>
        {showTool ? (
          <Card className="border shadow-md">
            <CardHeader className="p-3 pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  {getDeviceIcon(deviceType)}
                  <span>Responsive Preview</span>
                  <span className="text-xs text-gray-500 font-normal">
                    {previewWidth}×{previewHeight}px
                  </span>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={rotatePreview} 
                    title="Rotate preview"
                    disabled={!showDeviceFrame}
                  >
                    <RotateCw size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowTool(false)} 
                    title="Minimize tool"
                  >
                    <ExternalLink size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-3">
              {/* Device Controls */}
              <div className="flex items-center gap-2 mb-3">
                <Tabs defaultValue="desktop" onValueChange={(val) => selectDevicePreset(val as DeviceType)}>
                  <TabsList>
                    <TabsTrigger value="desktop">
                      <Monitor size={14} className="mr-1" />
                      Desktop
                    </TabsTrigger>
                    <TabsTrigger value="tablet">
                      <Tablet size={14} className="mr-1" />
                      Tablet
                    </TabsTrigger>
                    <TabsTrigger value="mobile">
                      <Smartphone size={14} className="mr-1" />
                      Mobile
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="flex-1 px-4">
                  <Slider 
                    value={[previewWidth]} 
                    min={320} 
                    max={1536} 
                    step={1}
                    onValueChange={(values) => setPreviewWidth(values[0])}
                  />
                </div>
                
                <div className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {previewWidth}px
                </div>
              </div>
              
              {/* Breakpoint Indicators */}
              {showBreakpoints && renderBreakpointIndicators()}
              
              {/* Rulers */}
              {showRulers && renderRuler()}
              
              {/* Content Preview */}
              <div 
                className={cn(
                  "responsive-preview-content border overflow-hidden mx-auto transition-all duration-300",
                  showDeviceFrame && "rounded-lg shadow-lg"
                )}
                style={{ 
                  width: `${previewWidth}px`, 
                  height: `${previewHeight}px`,
                  transform: `scale(${Math.min(1, (window.innerWidth - 100) / previewWidth)})`,
                  transformOrigin: 'top left',
                  maxWidth: '100%'
                }}
              >
                {children}
              </div>
              
              {/* Breakpoint Debugger */}
              <div className="mt-4">
                <BreakpointDebugger properties={properties} showDetails={true} />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button 
            variant="outline" 
            onClick={() => setShowTool(true)} 
            className="fixed bottom-4 right-4 shadow-md"
          >
            <Monitor size={16} className="mr-2" />
            Open Responsive Preview
          </Button>
        )}
      </div>
    </BreakpointInheritanceProvider>
  );
};

export default ResponsivePreviewTool;
