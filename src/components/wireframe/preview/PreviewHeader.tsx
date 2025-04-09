
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ExternalLink } from 'lucide-react';
import DeviceControls from './DeviceControls';
import { DeviceType } from './DeviceInfo';

interface PreviewHeaderProps {
  activeDevice: DeviceType;
  isRotated: boolean;
  onDeviceChange: (device: DeviceType) => void;
  onRotate: () => void;
  formatDimensions: () => string;
}

const PreviewHeader: React.FC<PreviewHeaderProps> = ({
  activeDevice,
  isRotated,
  onDeviceChange,
  onRotate,
  formatDimensions
}) => {
  return (
    <div className="pb-3 border-b">
      <div className="flex justify-between items-center">
        <CardTitle className="text-lg font-medium">
          Multi-Device Preview
        </CardTitle>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <DeviceControls 
        activeDevice={activeDevice}
        isRotated={isRotated}
        onDeviceChange={onDeviceChange}
        onRotate={onRotate}
        formatDimensions={formatDimensions}
      />
    </div>
  );
};

export default PreviewHeader;
