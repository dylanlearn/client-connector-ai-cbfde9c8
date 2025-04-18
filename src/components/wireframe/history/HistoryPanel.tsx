
import React from 'react';
import { 
  History, 
  RotateCcw, 
  RotateCw, 
  Braces, // Changed from Branches to Braces
  Tag,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEnhancedHistory } from '@/hooks/wireframe/use-enhanced-history';
import { HistoryItemsList } from './HistoryItemsList';
import { HistoryBranchesList } from './HistoryBranchesList';
import { NamedStatesDisplay } from './NamedStatesDisplay';

interface HistoryPanelProps {
  projectId?: string;
  onSave?: () => void;
  className?: string;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  projectId,
  onSave,
  className
}) => {
  const { 
    data,
    branches,
    currentBranch,
    checkpoints,
    canUndo,
    canRedo,
    undo,
    redo,
    createCheckpoint,
    createBranch,
    switchBranch,
    jumpToCheckpoint,
    computeStateDiff
  } = useEnhancedHistory(projectId);

  // Map history API to component props
  const historyItems = data ? JSON.parse(data).history || [] : [];
  const currentPosition = data ? JSON.parse(data).currentPosition || 0 : 0;
  const mappedBranches = branches.map(branch => ({
    id: branch.id,
    name: branch.name,
    createdAt: branch.createdAt,
    historyCount: branch.historyCount
  }));
  
  const handleCreateNamedState = () => {
    const name = prompt('Enter a name for this state:');
    if (name) {
      createCheckpoint(name);
    }
  };

  const handleCreateBranch = () => {
    const name = prompt('Enter a name for the new branch:');
    if (name) {
      createBranch(name);
    }
  };

  return (
    <div className={`history-panel ${className || ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <History className="mr-2 h-5 w-5" />
          <h3 className="text-lg font-medium">History</h3>
        </div>
        <div className="flex gap-1">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={undo}
            disabled={!canUndo}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Undo
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={redo}
            disabled={!canRedo}
          >
            <RotateCw className="h-4 w-4 mr-1" />
            Redo
          </Button>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="history">
          <AccordionTrigger>History Timeline</AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-[200px]">
              <HistoryItemsList 
                history={historyItems} 
                currentPosition={currentPosition} 
                onJumpTo={jumpToCheckpoint}
              />
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="branches">
          <AccordionTrigger className="flex items-center">
            <div className="flex items-center">
              <Braces className="h-4 w-4 mr-2" />
              Branches
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="mb-2 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCreateBranch}
              >
                New Branch
              </Button>
            </div>
            <HistoryBranchesList 
              branches={mappedBranches}
              activeBranch={currentBranch}
              onSwitchBranch={switchBranch}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="named-states">
          <AccordionTrigger className="flex items-center">
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-2" />
              Named States
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="mb-2 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCreateNamedState}
              >
                Save Current State
              </Button>
            </div>
            <NamedStatesDisplay 
              namedStates={checkpoints}
              onJumpTo={jumpToCheckpoint}
              onCompare={computeStateDiff}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {onSave && (
        <div className="mt-4">
          <Button 
            className="w-full" 
            onClick={onSave}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Project
          </Button>
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
