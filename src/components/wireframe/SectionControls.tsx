
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { 
  Pencil, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  GripVertical, 
  Code 
} from 'lucide-react';
import { DraggableProvided } from 'react-beautiful-dnd';

interface SectionControlsProps {
  section: WireframeSection;
  sectionIndex: number;
  totalSections: number;
  isVisible: boolean;
  provided: DraggableProvided;
  onEdit: () => void;
  onAdvancedEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleVisibility: () => void;
}

const SectionControls: React.FC<SectionControlsProps> = ({
  section,
  sectionIndex,
  totalSections,
  isVisible,
  provided,
  onEdit,
  onAdvancedEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onToggleVisibility
}) => {
  const isFirst = sectionIndex === 0;
  const isLast = sectionIndex === totalSections - 1;

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className="border rounded-md mb-2 bg-card"
    >
      <div className="flex items-center p-3">
        <div {...provided.dragHandleProps} className="mr-2">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center">
            <span className="font-medium truncate max-w-[150px]">{section.name}</span>
            <span className="ml-2 text-xs text-muted-foreground">({section.sectionType})</span>
          </div>
        </div>
        
        <TooltipProvider>
          <div className="flex space-x-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleVisibility}
                  className="h-8 w-8"
                >
                  {isVisible ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isVisible ? 'Hide' : 'Show'}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onEdit}
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onAdvancedEdit}
                  className="h-8 w-8"
                >
                  <Code className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Advanced Edit</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onDelete}
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
      
      <div className="border-t grid grid-cols-2">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-none border-r"
          onClick={onMoveUp}
          disabled={isFirst}
        >
          <ChevronUp className="h-3 w-3 mr-1" />
          Up
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-none"
          onClick={onMoveDown}
          disabled={isLast}
        >
          <ChevronDown className="h-3 w-3 mr-1" />
          Down
        </Button>
      </div>
    </div>
  );
};

export default SectionControls;
