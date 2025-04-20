
import React, { useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { DeviceDimensions, DeviceType, DEVICE_DIMENSIONS, rotateDevice, isLandscapeOrientation, formatDimensions } from './DeviceInfo';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import DeviceControls from './DeviceControls';
import { useWireframeStore } from '@/stores/wireframe-store';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface DevicePreviewSystemProps {
  children: ReactNode;
  initialDevice?: DeviceType;
  showControls?: boolean;
  className?: string;
  onDeviceChange?: (device: DeviceType, dimensions: DeviceDimensions) => void;
}

/**
 * Device Preview System - Presents content in accurately emulated device viewports
 */
const DevicePreviewSystem: React.FC<DevicePreviewSystemProps> = ({
  children,
  initialDevice = 'desktop',
  showControls = true,
  className,
  onDeviceChange
}) => {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [activeDevice, setActiveDevice] = useState<DeviceType>(initialDevice);
  const [isRotated, setIsRotated] = useState(false);
  const [scale, setScale] = useState(1);
  const { setActiveDevice: updateStoreDevice } = useWireframeStore();
  
  // Get current device dimensions
  const currentDimensions = DEVICE_DIMENSIONS[activeDevice];
  
  // Toggle device rotation
  const handleRotateDevice = useCallback(() => {
    if (activeDevice === 'desktop') return; // Desktop cannot be rotated
    
    const rotatedDevice = rotateDevice(activeDevice);
    setActiveDevice(rotatedDevice);
    setIsRotated(!isRotated);
    updateStoreDevice(rotatedDevice);
    
    if (onDeviceChange) {
      onDeviceChange(rotatedDevice, DEVICE_DIMENSIONS[rotatedDevice]);
    }
    
    toast({
      title: "Device rotated",
      description: `Now showing ${DEVICE_DIMENSIONS[rotatedDevice].name} (${formatDimensions(DEVICE_DIMENSIONS[rotatedDevice])})`,
      duration: 2000
    });
  }, [activeDevice, isRotated, updateStoreDevice, onDeviceChange, toast]);
  
  // Handle device change
  const handleDeviceChange = useCallback((device: DeviceType) => {
    setActiveDevice(device);
    setIsRotated(isLandscapeOrientation(device));
    updateStoreDevice(device);
    
    if (onDeviceChange) {
      onDeviceChange(device, DEVICE_DIMENSIONS[device]);
    }
    
    toast({
      title: "Device changed",
      description: `Now showing ${DEVICE_DIMENSIONS[device].name} (${formatDimensions(DEVICE_DIMENSIONS[device])})`,
      duration: 2000
    });
  }, [updateStoreDevice, onDeviceChange, toast]);
  
  // Calculate proper scaling to fit the container
  useEffect(() => {
    if (!containerRef.current || !frameRef.current) return;
    
    const calculateScale = () => {
      const containerWidth = containerRef.current!.clientWidth;
      const containerHeight = containerRef.current!.clientHeight;
      const deviceWidth = currentDimensions.width;
      const deviceHeight = currentDimensions.height;
      
      // Calculate how much we need to scale down to fit the container
      // Leave some padding (0.9) for visual comfort
      const widthScale = (containerWidth / deviceWidth) * 0.9;
      const heightScale = (containerHeight / deviceHeight) * 0.9;
      
      // Use the smaller scale to ensure the device fits in the container
      const newScale = Math.min(widthScale, heightScale, 1); // Never scale up, only down
      setScale(newScale);
    };
    
    calculateScale();
    
    // Recalculate on resize
    const resizeObserver = new ResizeObserver(calculateScale);
    resizeObserver.observe(containerRef.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [currentDimensions, activeDevice]);
  
  // Format dimensions for display
  const formatDeviceDimensions = useCallback(() => {
    return `${currentDimensions.name}: ${formatDimensions(currentDimensions)}`;
  }, [currentDimensions]);
  
  const browserChrome = useCallback(() => {
    if (activeDevice === 'desktop') return null;
    
    return (
      <div className="browser-chrome flex flex-col w-full">
        <div className="browser-top flex items-center gap-2 bg-gray-100 p-1 rounded-t-lg border-b">
          <div className="browser-controls flex items-center gap-1 ml-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
          <div className="browser-url flex-1 text-xs bg-white text-gray-400 rounded px-2 py-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
            https://example.com
          </div>
        </div>
      </div>
    );
  }, [activeDevice]);
  
  const deviceNotch = useCallback(() => {
    if (activeDevice !== 'mobile' && activeDevice !== 'mobileLandscape') return null;
    
    return activeDevice === 'mobile' ? (
      <div className="device-notch absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-5 bg-black rounded-b-xl z-10"></div>
    ) : (
      <div className="device-notch absolute top-1/2 left-0 transform -translate-y-1/2 w-5 h-1/3 bg-black rounded-r-xl z-10"></div>
    );
  }, [activeDevice]);
  
  return (
    <div className={cn("device-preview-system flex flex-col h-full", className)}>
      {showControls && (
        <>
          <DeviceControls
            activeDevice={activeDevice}
            isRotated={isRotated}
            onDeviceChange={handleDeviceChange}
            onRotate={handleRotateDevice}
            formatDimensions={formatDeviceDimensions}
          />
          <Separator className="my-2" />
        </>
      )}
      
      <div 
        ref={containerRef} 
        className="device-preview-container relative flex-1 flex items-center justify-center overflow-auto bg-muted/30"
      >
        <div 
          className="device-frame relative transition-all duration-300 bg-background"
          style={{
            width: currentDimensions.width,
            height: currentDimensions.height,
            transform: `scale(${scale})`,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            borderRadius: activeDevice === 'desktop' ? '6px' : '12px',
            border: `${activeDevice === 'desktop' ? '1px' : '8px'} solid ${activeDevice === 'desktop' ? '#e2e8f0' : '#1a1a1a'}`,
            overflow: 'hidden'
          }}
        >
          {browserChrome()}
          {deviceNotch()}
          
          <div 
            ref={frameRef}
            className={cn(
              "device-content w-full bg-white transition-all",
              currentDimensions.safeArea && 'safe-area-padding'
            )}
            style={{
              height: activeDevice === 'desktop' ? '100%' : `calc(100% - ${browserChrome() ? '24px' : '0px'})`,
              paddingTop: currentDimensions.safeArea?.top,
              paddingRight: currentDimensions.safeArea?.right,
              paddingBottom: currentDimensions.safeArea?.bottom,
              paddingLeft: currentDimensions.safeArea?.left,
            }}
          >
            {children}
          </div>
        </div>
        
        <div className="device-info absolute bottom-2 left-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded border shadow-sm">
          {formatDeviceDimensions()}
          {currentDimensions.devicePixelRatio && ` @ ${currentDimensions.devicePixelRatio}x`}
          {scale !== 1 && ` (scaled: ${Math.round(scale * 100)}%)`}
        </div>
      </div>
    </div>
  );
};

export default DevicePreviewSystem;
