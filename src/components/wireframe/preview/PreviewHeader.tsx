
import React from 'react';
import { DeviceType } from './DeviceInfo';
import DeviceControls from './DeviceControls';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { MessageSquare, ThumbsUp, ArrowLeftRight } from 'lucide-react';

interface PreviewHeaderProps {
  activeDevice: DeviceType;
  isRotated: boolean;
  onDeviceChange: (device: DeviceType) => void;
  onRotate: () => void;
  formatDimensions: () => string;
  wireframeId?: string;
  onFeedbackClick?: () => void;
  onCompareClick?: () => void;
  showCompare?: boolean;
}

const PreviewHeader: React.FC<PreviewHeaderProps> = ({
  activeDevice,
  isRotated,
  onDeviceChange,
  onRotate,
  formatDimensions,
  wireframeId,
  onFeedbackClick,
  onCompareClick,
  showCompare = false
}) => {
  return (
    <div className="flex items-center justify-between p-3 border-b bg-card">
      <h3 className="text-lg font-medium">Device Preview</h3>
      
      <div className="flex items-center gap-2">
        {wireframeId && onFeedbackClick && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onFeedbackClick}
            className="flex items-center gap-1"
          >
            <ThumbsUp className="h-4 w-4" />
            <span className="hidden md:inline">Feedback</span>
          </Button>
        )}
        
        {showCompare && onCompareClick && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCompareClick}
            className="flex items-center gap-1"
          >
            <ArrowLeftRight className="h-4 w-4" />
            <span className="hidden md:inline">Compare</span>
          </Button>
        )}
        
        <TooltipProvider>
          <DeviceControls 
            activeDevice={activeDevice}
            isRotated={isRotated}
            onDeviceChange={onDeviceChange}
            onRotate={onRotate}
            formatDimensions={formatDimensions}
          />
        </TooltipProvider>
      </div>
    </div>
  );
};

export default PreviewHeader;
