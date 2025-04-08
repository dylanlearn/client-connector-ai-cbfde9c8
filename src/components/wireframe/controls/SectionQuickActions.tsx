
import React from 'react';
import {
  Copy,
  Trash2,
  MoveUp,
  MoveDown,
  Pencil,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface SectionQuickActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  className?: string;
  compact?: boolean;
}

const SectionQuickActions: React.FC<SectionQuickActionsProps> = ({
  onEdit,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  className,
  compact = false
}) => {
  if (compact) {
    return (
      <div className={cn("quick-actions absolute top-1 right-1 z-10", className)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full bg-background/80 backdrop-blur-sm">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="h-3 w-3 mr-2" />
                Edit
              </DropdownMenuItem>
            )}
            {onDuplicate && (
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="h-3 w-3 mr-2" />
                Duplicate
              </DropdownMenuItem>
            )}
            {onMoveUp && (
              <DropdownMenuItem onClick={onMoveUp}>
                <MoveUp className="h-3 w-3 mr-2" />
                Move Up
              </DropdownMenuItem>
            )}
            {onMoveDown && (
              <DropdownMenuItem onClick={onMoveDown}>
                <MoveDown className="h-3 w-3 mr-2" />
                Move Down
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="h-3 w-3 mr-2" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
  
  return (
    <div className={cn("quick-actions absolute top-2 right-2 flex items-center gap-1 z-10", className)}>
      {onEdit && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onEdit} 
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit Section</TooltipContent>
        </Tooltip>
      )}
      
      {onDuplicate && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onDuplicate} 
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Duplicate</TooltipContent>
        </Tooltip>
      )}
      
      {onDelete && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onDelete} 
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete Section</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export default SectionQuickActions;
