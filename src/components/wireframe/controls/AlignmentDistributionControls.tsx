
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignLeft,
  AlignRight,
  AlignTop,
  AlignBottom,
  AlignHorizontalSpaceAround,
  AlignVerticalSpaceAround,
  AlignHorizontalSpaceBetween,
  AlignVerticalSpaceBetween,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export interface AlignmentDistributionControlsProps {
  onAlignLeft: () => void;
  onAlignCenterH: () => void;
  onAlignRight: () => void;
  onAlignTop: () => void;
  onAlignMiddle: () => void;
  onAlignBottom: () => void;
  onDistributeHorizontally: () => void;
  onDistributeVertically: () => void;
  onSpaceEvenlyHorizontal: () => void;
  onSpaceEvenlyVertical: () => void;
  multipleSelected: boolean;
  className?: string;
}

const AlignmentDistributionControls: React.FC<AlignmentDistributionControlsProps> = ({
  onAlignLeft,
  onAlignCenterH,
  onAlignRight,
  onAlignTop,
  onAlignMiddle,
  onAlignBottom,
  onDistributeHorizontally,
  onDistributeVertically,
  onSpaceEvenlyHorizontal,
  onSpaceEvenlyVertical,
  multipleSelected,
  className
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex border rounded-md overflow-hidden">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onAlignLeft}
              className="h-8 w-8 rounded-none border-r"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Left</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onAlignCenterH}
              className="h-8 w-8 rounded-none border-r"
            >
              <AlignCenterHorizontal className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Center Horizontally</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onAlignRight}
              className="h-8 w-8 rounded-none"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Right</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex border rounded-md overflow-hidden">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onAlignTop}
              className="h-8 w-8 rounded-none border-r"
            >
              <AlignTop className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Top</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onAlignMiddle}
              className="h-8 w-8 rounded-none border-r"
            >
              <AlignCenterVertical className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Middle</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onAlignBottom}
              className="h-8 w-8 rounded-none"
            >
              <AlignBottom className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Bottom</TooltipContent>
        </Tooltip>
      </div>

      {multipleSelected && (
        <>
          <div className="flex border rounded-md overflow-hidden">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onDistributeHorizontally}
                  className="h-8 w-8 rounded-none border-r"
                >
                  <AlignHorizontalSpaceBetween className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Distribute Horizontally</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onDistributeVertically}
                  className="h-8 w-8 rounded-none"
                >
                  <AlignVerticalSpaceBetween className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Distribute Vertically</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex border rounded-md overflow-hidden">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onSpaceEvenlyHorizontal}
                  className="h-8 w-8 rounded-none border-r"
                >
                  <AlignHorizontalSpaceAround className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Space Evenly Horizontally</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onSpaceEvenlyVertical}
                  className="h-8 w-8 rounded-none"
                >
                  <AlignVerticalSpaceAround className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Space Evenly Vertically</TooltipContent>
            </Tooltip>
          </div>
        </>
      )}
    </div>
  );
};

export default AlignmentDistributionControls;
