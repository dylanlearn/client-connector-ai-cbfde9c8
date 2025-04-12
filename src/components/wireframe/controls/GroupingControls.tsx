
import React from 'react';
import { Button } from '@/components/ui/button';
import { Group, Ungroup } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import useGroupSelection from '@/hooks/wireframe/use-group-selection';
import { fabric } from 'fabric';

interface GroupingControlsProps {
  canvas: fabric.Canvas | null;
  selectedObjects: fabric.Object[];
  onGroupCreated?: () => void;
  onGroupReleased?: () => void;
}

const GroupingControls: React.FC<GroupingControlsProps> = ({ 
  canvas, 
  selectedObjects,
  onGroupCreated,
  onGroupReleased
}) => {
  const { 
    createGroup, 
    ungroup, 
    hasMultipleSelection, 
    hasActiveGroup 
  } = useGroupSelection({ 
    canvas,
    onGroupCreate: () => onGroupCreated?.(),
    onGroupRelease: () => onGroupReleased?.()
  });

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              disabled={!hasMultipleSelection}
              onClick={createGroup}
            >
              <Group className="h-4 w-4" />
              <span className="hidden md:inline">Group</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs">
              <p>Group selected objects</p>
              <p className="text-muted-foreground">Shortcut: Ctrl+G</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              disabled={!hasActiveGroup}
              onClick={ungroup}
            >
              <Ungroup className="h-4 w-4" />
              <span className="hidden md:inline">Ungroup</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs">
              <p>Ungroup selected group</p>
              <p className="text-muted-foreground">Shortcut: Ctrl+Shift+G</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default GroupingControls;
