
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ArrowUp, ArrowDown, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionQuickActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  compact?: boolean;
  className?: string;
}

const SectionQuickActions: React.FC<SectionQuickActionsProps> = ({
  onEdit,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  compact = false,
  className
}) => {
  return (
    <div 
      className={cn(
        "section-quick-actions absolute right-1 top-1 flex gap-1 bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 z-10",
        className
      )}
    >
      {onEdit && (
        <Button 
          variant="ghost" 
          size={compact ? "icon" : "sm"} 
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          title="Edit section"
        >
          <Edit className="h-3 w-3" />
          {!compact && <span className="ml-1">Edit</span>}
        </Button>
      )}
      
      {onDuplicate && (
        <Button 
          variant="ghost" 
          size={compact ? "icon" : "sm"} 
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          title="Duplicate section"
        >
          <Copy className="h-3 w-3" />
          {!compact && <span className="ml-1">Duplicate</span>}
        </Button>
      )}
      
      {onMoveUp && (
        <Button 
          variant="ghost" 
          size={compact ? "icon" : "sm"} 
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp();
          }}
          title="Move section up"
        >
          <ArrowUp className="h-3 w-3" />
          {!compact && <span className="ml-1">Up</span>}
        </Button>
      )}
      
      {onMoveDown && (
        <Button 
          variant="ghost" 
          size={compact ? "icon" : "sm"} 
          onClick={(e) => {
            e.stopPropagation();
            onMoveDown();
          }}
          title="Move section down"
        >
          <ArrowDown className="h-3 w-3" />
          {!compact && <span className="ml-1">Down</span>}
        </Button>
      )}
      
      {onDelete && (
        <Button 
          variant="ghost" 
          size={compact ? "icon" : "sm"} 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
          title="Delete section"
        >
          <Trash2 className="h-3 w-3" />
          {!compact && <span className="ml-1">Delete</span>}
        </Button>
      )}
    </div>
  );
};

export default SectionQuickActions;
