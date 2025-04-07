
import React from 'react';
import { 
  ArrowUp, ArrowDown, Trash, Move, Settings, Eye, EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';

interface SectionControlsProps {
  section: WireframeSection;
  sectionIndex: number;
  totalSections: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onToggleVisibility: () => void;
  isVisible?: boolean;
}

const SectionControls: React.FC<SectionControlsProps> = ({
  section,
  sectionIndex,
  totalSections,
  onMoveUp,
  onMoveDown,
  onDelete,
  onEdit,
  onToggleVisibility,
  isVisible = true
}) => {
  return (
    <Card className="p-2 flex items-center justify-between bg-muted/50 mb-2">
      <div className="flex items-center gap-1">
        <Move className="h-4 w-4 text-muted-foreground cursor-move" />
        <span className="text-sm font-medium ml-2 truncate">{section.name || section.sectionType}</span>
      </div>
      
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={onToggleVisibility}
            >
              {isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isVisible ? 'Hide Section' : 'Show Section'}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={onMoveUp}
              disabled={sectionIndex === 0}
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Move Up</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={onMoveDown}
              disabled={sectionIndex === totalSections - 1}
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Move Down</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={onEdit}
            >
              <Settings className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit Section</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-destructive" 
              onClick={onDelete}
            >
              <Trash className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete Section</TooltipContent>
        </Tooltip>
      </div>
    </Card>
  );
};

export default SectionControls;
