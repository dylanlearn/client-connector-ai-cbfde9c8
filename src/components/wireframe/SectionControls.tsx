
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Edit, Trash2, ArrowUp, ArrowDown, GripVertical, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SectionControlsProps {
  section: WireframeSection;
  sectionIndex: number;
  totalSections: number;
  isVisible: boolean;
  provided?: any; // For drag-and-drop
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleVisibility: () => void;
  onAdvancedEdit?: () => void; // New handler for advanced editing
}

const SectionControls: React.FC<SectionControlsProps> = ({
  section,
  sectionIndex,
  totalSections,
  isVisible,
  provided,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onToggleVisibility,
  onAdvancedEdit
}) => {
  return (
    <div 
      className={cn(
        "border rounded-md p-2 bg-background transition-colors",
        isVisible ? "border-input" : "border-dashed border-gray-300 opacity-70"
      )}
      ref={provided?.innerRef}
      {...(provided?.draggableProps || {})}
    >
      <div className="flex items-center gap-2">
        {provided && (
          <div 
            {...provided.dragHandleProps} 
            className="cursor-grab hover:bg-muted p-1 rounded-md transition-colors"
            aria-label="Drag to reorder section"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
        
        <div className="flex-1">
          <p className="font-medium text-sm">{section.name}</p>
          <p className="text-xs text-muted-foreground truncate">{section.sectionType}</p>
        </div>
        
        <div className="flex gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onToggleVisibility}
                  className="px-2 h-8"
                >
                  {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isVisible ? "Hide section" : "Show section"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {!provided && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={onMoveUp}
                      disabled={sectionIndex === 0}
                      className="px-2 h-8"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Move up</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={onMoveDown}
                      disabled={sectionIndex === totalSections - 1}
                      className="px-2 h-8"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Move down</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onEdit}
                  className="px-2 h-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Basic edit</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {onAdvancedEdit && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onAdvancedEdit}
                    className="px-2 h-8 border-primary text-primary hover:bg-primary/10"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Advanced edit</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onDelete}
                  className="px-2 h-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete section</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default SectionControls;
