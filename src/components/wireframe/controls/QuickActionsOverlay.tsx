
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Copy, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  RotateCw, 
  Edit, 
  Lock,
  Unlock,
  AlignCenter,
  Layers
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: 'default' | 'primary' | 'destructive';
}

interface QuickActionsOverlayProps {
  show: boolean;
  actions: QuickAction[];
  position?: 'top' | 'right' | 'bottom' | 'left' | 'top-right';
  className?: string;
}

const QuickActionsOverlay: React.FC<QuickActionsOverlayProps> = ({
  show,
  actions,
  position = 'top-right',
  className
}) => {
  if (!show || actions.length === 0) return null;
  
  const positionClasses = {
    'top': 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-1',
    'right': 'right-0 top-1/2 transform translate-x-full -translate-y-1/2 ml-1',
    'bottom': 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-1',
    'left': 'left-0 top-1/2 transform -translate-x-full -translate-y-1/2 mr-1',
    'top-right': 'top-0 right-0 transform translate-x-0 -translate-y-full mb-1'
  };
  
  const colorClasses = {
    default: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200',
    primary: 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300',
    destructive: 'bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/50 text-red-700 dark:text-red-300',
  };
  
  return (
    <TooltipProvider delayDuration={200}>
      <div 
        className={cn(
          "absolute z-50 flex items-center gap-1 p-1 bg-background/90 backdrop-blur-sm shadow-md rounded-md border animate-in fade-in zoom-in-95",
          positionClasses[position],
          className
        )}
      >
        {actions.map((action) => (
          <Tooltip key={action.id}>
            <TooltipTrigger asChild>
              <button
                className={cn(
                  "w-6 h-6 flex items-center justify-center rounded p-1 transition-colors",
                  colorClasses[action.color || 'default']
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                }}
                title={action.label}
              >
                {action.icon}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={5}>
              {action.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default QuickActionsOverlay;

// Pre-configured action helpers
export const createDefaultQuickActions = (
  onDuplicate: () => void,
  onDelete: () => void,
  onBringForward: () => void,
  onSendBackward: () => void,
  onRotate: () => void, // Changed from accepting an event to no arguments
  onEdit: () => void,
  isLocked: boolean = false,
  onToggleLock: () => void
): QuickAction[] => {
  return [
    {
      id: 'edit',
      icon: <Edit size={14} />,
      label: 'Edit',
      onClick: onEdit
    },
    {
      id: 'duplicate',
      icon: <Copy size={14} />,
      label: 'Duplicate',
      onClick: onDuplicate
    },
    {
      id: 'rotate',
      icon: <RotateCw size={14} />,
      label: 'Rotate',
      onClick: onRotate // This function now properly matches the expected signature
    },
    {
      id: 'toggle-lock',
      icon: isLocked ? <Unlock size={14} /> : <Lock size={14} />,
      label: isLocked ? 'Unlock' : 'Lock',
      onClick: onToggleLock
    },
    {
      id: 'bring-forward',
      icon: <MoveUp size={14} />,
      label: 'Bring Forward',
      onClick: onBringForward
    },
    {
      id: 'send-backward',
      icon: <MoveDown size={14} />,
      label: 'Send Backward',
      onClick: onSendBackward
    },
    {
      id: 'delete',
      icon: <Trash2 size={14} />,
      label: 'Delete',
      onClick: onDelete,
      color: 'destructive'
    }
  ];
};
