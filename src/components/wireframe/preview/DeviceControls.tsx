
import React from 'react';
import { Monitor, Tablet, Smartphone, RotateCcw } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DeviceType } from './DeviceInfo';

interface DeviceControlsProps {
  activeDevice: DeviceType;
  isRotated: boolean;
  onDeviceChange: (device: DeviceType) => void;
  onRotate: () => void;
  formatDimensions: () => string;
}

const DeviceControls: React.FC<DeviceControlsProps> = ({
  activeDevice,
  isRotated,
  onDeviceChange,
  onRotate,
  formatDimensions
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {formatDimensions()}
        </span>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRotate}
                disabled={activeDevice === 'desktop'}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rotate device</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Tabs
        value={activeDevice}
        onValueChange={(v) => onDeviceChange(v as DeviceType)}
        className="w-full"
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
    </div>
  );
};

export default DeviceControls;
