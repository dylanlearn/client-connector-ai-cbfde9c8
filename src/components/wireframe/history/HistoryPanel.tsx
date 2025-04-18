
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
    history, 
    currentPosition,
    branches,
    activeBranch,
    namedStates,
    canUndo,
    canRedo,
    undo,
    redo,
    saveNamedState,
    switchBranch,
    createBranch,
    jumpToState,
    diffStates
  } = useEnhancedHistory(projectId);

  const handleCreateNamedState = () => {
    const name = prompt('Enter a name for this state:');
    if (name) {
      saveNamedState(name);
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
                history={history} 
                currentPosition={currentPosition} 
                onJumpTo={jumpToState}
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
              branches={branches}
              activeBranch={activeBranch}
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
              namedStates={namedStates}
              onJumpTo={jumpToState}
              onCompare={diffStates}
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
