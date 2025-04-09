
import React from 'react';
import { cn } from '@/lib/utils';
import { Copy, Trash, ArrowUp, ArrowDown, Lock, Unlock, Eye, EyeOff, Layers, Maximize, Minimize } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface QuickAction {
  label: string;
  icon: React.ReactNode;
  action: () => void;
  disabled?: boolean;
}

interface QuickActionsMenuProps {
  show: boolean;
  position: { x: number; y: number } | null;
  actions: QuickAction[];
  className?: string;
}

const QuickActionsMenu: React.FC<QuickActionsMenuProps> = ({ 
  show,
  position,
  actions,
  className
}) => {
  if (!show || !position) return null;
  
  return (
    <TooltipProvider>
      <div 
        className={cn(
          "quick-actions-menu absolute bg-background/90 backdrop-blur-sm border rounded-md shadow-md p-1 flex gap-1 z-30",
          className
        )}
        style={{
          top: `${position.y}px`,
          left: `${position.x}px`,
          transform: 'translate(-50%, -100%)',
        }}
      >
        {actions.map((action, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={action.action}
                disabled={action.disabled}
                className={cn(
                  "p-1.5 rounded-sm hover:bg-primary/10",
                  "focus:outline-none focus:ring-1 focus:ring-primary focus:bg-primary/5",
                  action.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
                )}
              >
                {action.icon}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{action.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

// Pre-defined action creators for common operations
export const createDuplicateAction = (onDuplicate: () => void): QuickAction => ({
  label: 'Duplicate',
  icon: <Copy size={16} />,
  action: onDuplicate
});

export const createDeleteAction = (onDelete: () => void): QuickAction => ({
  label: 'Delete',
  icon: <Trash size={16} />,
  action: onDelete
});

export const createMoveUpAction = (onMoveUp: () => void, isFirst: boolean = false): QuickAction => ({
  label: 'Move Up',
  icon: <ArrowUp size={16} />,
  action: onMoveUp,
  disabled: isFirst
});

export const createMoveDownAction = (onMoveDown: () => void, isLast: boolean = false): QuickAction => ({
  label: 'Move Down',
  icon: <ArrowDown size={16} />,
  action: onMoveDown,
  disabled: isLast
});

export const createToggleLockAction = (isLocked: boolean, onToggle: () => void): QuickAction => ({
  label: isLocked ? 'Unlock' : 'Lock',
  icon: isLocked ? <Unlock size={16} /> : <Lock size={16} />,
  action: onToggle
});

export const createToggleVisibilityAction = (isVisible: boolean, onToggle: () => void): QuickAction => ({
  label: isVisible ? 'Hide' : 'Show',
  icon: isVisible ? <EyeOff size={16} /> : <Eye size={16} />,
  action: onToggle
});

export const createBringToTopAction = (onBringToTop: () => void): QuickAction => ({
  label: 'Bring to Front',
  icon: <Layers size={16} />,
  action: onBringToTop
});

export const createMaximizeAction = (isMaximized: boolean, onToggle: () => void): QuickAction => ({
  label: isMaximized ? 'Minimize' : 'Maximize',
  icon: isMaximized ? <Minimize size={16} /> : <Maximize size={16} />,
  action: onToggle
});

export default QuickActionsMenu;
