
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalSpaceBetween,
  AlignHorizontalSpaceBetween
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface AlignmentControlsProps {
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
  enabled: boolean;
  className?: string;
}

const AlignmentControls: React.FC<AlignmentControlsProps> = ({
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
  enabled = true,
  className
}) => {
  return (
    <div className={cn("alignment-controls flex flex-col gap-2", className)}>
      <TooltipProvider>
        <div className="flex flex-col border rounded-md p-1">
          <h4 className="text-xs font-medium text-muted-foreground px-2 py-1">Align</h4>
          
          <div className="grid grid-cols-3 gap-1">
            {/* Horizontal alignment */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={onAlignLeft}
                  disabled={!enabled}
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Align left edges</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={onAlignCenterH}
                  disabled={!enabled}
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Align horizontal centers</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={onAlignRight}
                  disabled={!enabled}
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Align right edges</p>
              </TooltipContent>
            </Tooltip>
            
            {/* Vertical alignment */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={onAlignTop}
                  disabled={!enabled}
                >
                  <AlignHorizontalJustifyStart className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Align top edges</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={onAlignMiddle}
                  disabled={!enabled}
                >
                  <AlignHorizontalJustifyCenter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Align vertical centers</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={onAlignBottom}
                  disabled={!enabled}
                >
                  <AlignHorizontalJustifyEnd className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Align bottom edges</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        
        <div className="flex flex-col border rounded-md p-1">
          <h4 className="text-xs font-medium text-muted-foreground px-2 py-1">Distribute</h4>
          
          <div className="grid grid-cols-2 gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={onDistributeHorizontally}
                  disabled={!enabled}
                >
                  <AlignVerticalSpaceBetween className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Distribute horizontally</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={onDistributeVertically}
                  disabled={!enabled}
                >
                  <AlignHorizontalSpaceBetween className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Distribute vertically</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={onSpaceEvenlyHorizontal}
                  disabled={!enabled}
                >
                  <AlignVerticalJustifyCenter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Space evenly horizontally</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={onSpaceEvenlyVertical}
                  disabled={!enabled}
                >
                  <AlignVerticalJustifyCenter className="h-4 w-4 rotate-90" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Space evenly vertically</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default AlignmentControls;
