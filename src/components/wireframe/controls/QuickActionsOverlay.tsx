
import React from 'react';
import { Button } from '@/components/ui/button';
import { DuplicateIcon, TrashIcon, Undo2, Redo2, ChevronUp, ChevronDown, Edit, Lock, Unlock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface QuickActionsOverlayProps {
  show: boolean;
  actions: QuickAction[];
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function createDefaultQuickActions(
  onDuplicate: () => void,
  onDelete: () => void,
  onBringForward: () => void,
  onSendBackward: () => void,
  onRotate: () => void,
  onEdit: () => void,
  isLocked: boolean,
  onToggleLock: () => void
): QuickAction[] {
  return [
    {
      id: 'duplicate',
      icon: <DuplicateIcon className="h-4 w-4" />,
      label: "Duplicate",
      onClick: onDuplicate,
      disabled: isLocked
    },
    {
      id: 'delete',
      icon: <TrashIcon className="h-4 w-4" />,
      label: "Delete",
      onClick: onDelete,
      disabled: isLocked
    },
    {
      id: 'bring-forward',
      icon: <ChevronUp className="h-4 w-4" />,
      label: "Bring Forward",
      onClick: onBringForward,
      disabled: isLocked
    },
    {
      id: 'send-backward',
      icon: <ChevronDown className="h-4 w-4" />,
      label: "Send Backward",
      onClick: onSendBackward,
      disabled: isLocked
    },
    {
      id: 'edit',
      icon: <Edit className="h-4 w-4" />,
      label: "Edit",
      onClick: onEdit,
      disabled: isLocked
    },
    {
      id: 'lock',
      icon: isLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />,
      label: isLocked ? "Unlock" : "Lock",
      onClick: onToggleLock,
      disabled: false
    }
  ];
}

const QuickActionsOverlay: React.FC<QuickActionsOverlayProps> = ({
  show,
  actions,
  position = 'top-right'
}) => {
  if (!show) return null;
  
  const positionClasses = {
    'top-left': 'top-0 left-0 -translate-x-1/4 -translate-y-1/4',
    'top-right': 'top-0 right-0 translate-x-1/4 -translate-y-1/4',
    'bottom-left': 'bottom-0 left-0 -translate-x-1/4 translate-y-1/4',
    'bottom-right': 'bottom-0 right-0 translate-x-1/4 translate-y-1/4'
  };
  
  return (
    <TooltipProvider>
      <div
        className={`absolute ${positionClasses[position]} flex flex-col gap-1 z-10`}
      >
        {actions.map((action) => (
          <Tooltip key={action.id}>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-7 w-7 rounded-full shadow-md bg-white"
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {action.icon}
              </Button>
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

export default QuickActionsOverlay;
