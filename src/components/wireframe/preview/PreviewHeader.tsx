
import React from 'react';
import { Button } from '@/components/ui/button';
import { Monitor, Tablet, Smartphone, Sun, Moon, RotateCcw, Download } from 'lucide-react';
import { DeviceType } from './DeviceInfo';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface PreviewHeaderProps {
  activeDevice: DeviceType;
  isRotated: boolean;
  darkMode: boolean;
  onDeviceChange: (device: DeviceType) => void;
  onRotate: () => void;
  onToggleDarkMode: () => void;
  formatDimensions: () => string;
  onExport?: () => void;
}

const PreviewHeader: React.FC<PreviewHeaderProps> = ({
  activeDevice,
  isRotated,
  darkMode,
  onDeviceChange,
  onRotate,
  onToggleDarkMode,
  formatDimensions,
  onExport
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeviceChange('desktop')}
              className={activeDevice === 'desktop' ? 'text-primary' : ''}
            >
              <Monitor className="h-4 w-4" />
              <span className="sr-only">Desktop view</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Desktop view</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeviceChange('tablet')}
              className={activeDevice === 'tablet' ? 'text-primary' : ''}
            >
              <Tablet className="h-4 w-4" />
              <span className="sr-only">Tablet view</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Tablet view</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeviceChange('mobile')}
              className={activeDevice === 'mobile' ? 'text-primary' : ''}
            >
              <Smartphone className="h-4 w-4" />
              <span className="sr-only">Mobile view</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Mobile view</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRotate}
              disabled={activeDevice === 'desktop'}
            >
              <RotateCcw className="h-4 w-4" />
              <span className="sr-only">Rotate device</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Rotate device</TooltipContent>
        </Tooltip>
      </div>

      <div className="text-xs text-muted-foreground">
        {formatDimensions()}
      </div>

      <div className="flex items-center space-x-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleDarkMode}
            >
              {darkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="sr-only">
                {darkMode ? 'Light mode' : 'Dark mode'}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {darkMode ? 'Light mode' : 'Dark mode'}
          </TooltipContent>
        </Tooltip>

        {onExport && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onExport}
              >
                <Download className="h-4 w-4" />
                <span className="sr-only">Export</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export wireframe</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default PreviewHeader;
