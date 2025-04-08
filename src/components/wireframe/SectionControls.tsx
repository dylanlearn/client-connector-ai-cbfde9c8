
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Edit, Trash2, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  onToggleVisibility
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
          <div {...provided.dragHandleProps} className="cursor-grab">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
        
        <div className="flex-1">
          <p className="font-medium text-sm">{section.name}</p>
          <p className="text-xs text-muted-foreground truncate">{section.sectionType}</p>
        </div>
        
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={onToggleVisibility}
            className="px-2 h-8"
            title={isVisible ? "Hide section" : "Show section"}
          >
            {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
          
          {!provided && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={onMoveUp}
                disabled={sectionIndex === 0}
                className="px-2 h-8"
                title="Move up"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={onMoveDown}
                disabled={sectionIndex === totalSections - 1}
                className="px-2 h-8"
                title="Move down"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            onClick={onEdit}
            className="px-2 h-8"
            title="Edit section"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={onDelete}
            className="px-2 h-8 text-destructive hover:text-destructive"
            title="Delete section"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SectionControls;
