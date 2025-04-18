
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Branches, Undo2, Redo2, Save, GitMerge } from 'lucide-react';
import { HistoryState, HistoryBranch } from '@/hooks/wireframe/use-enhanced-history';

interface HistoryPanelProps<T> {
  branches: HistoryBranch<T>[];
  activeBranchId: string;
  currentStateIndex: number;
  onGoToState: (stateId: string) => void;
  onSwitchBranch: (branchId: string) => void;
  onMergeBranch: (branchId: string) => void;
  onCreateBranch: (name: string) => void;
  onCreateCheckpoint: (name: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  className?: string;
}

function HistoryPanel<T>({
  branches,
  activeBranchId,
  currentStateIndex,
  onGoToState,
  onSwitchBranch,
  onMergeBranch,
  onCreateBranch,
  onCreateCheckpoint,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  className,
}: HistoryPanelProps<T>) {
  const [newBranchName, setNewBranchName] = useState('');
  const [newCheckpointName, setNewCheckpointName] = useState('');
  const [expandedBranches, setExpandedBranches] = useState<Record<string, boolean>>({
    [activeBranchId]: true,
  });

  const toggleBranchExpand = (branchId: string) => {
    setExpandedBranches(prev => ({
      ...prev,
      [branchId]: !prev[branchId],
    }));
  };

  const handleCreateBranch = () => {
    if (newBranchName.trim() !== '') {
      onCreateBranch(newBranchName);
      setNewBranchName('');
    }
  };

  const handleCreateCheckpoint = () => {
    if (newCheckpointName.trim() !== '') {
      onCreateCheckpoint(newCheckpointName);
      setNewCheckpointName('');
    }
  };

  return (
    <div className={cn("history-panel border rounded-md p-2", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">History</h3>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="New branch name..."
            value={newBranchName}
            onChange={(e) => setNewBranchName(e.target.value)}
            className="text-sm h-8"
          />
          <Button variant="outline" size="sm" onClick={handleCreateBranch}>
            <Branches className="h-4 w-4 mr-1" />
            Branch
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Checkpoint name..."
            value={newCheckpointName}
            onChange={(e) => setNewCheckpointName(e.target.value)}
            className="text-sm h-8"
          />
          <Button variant="outline" size="sm" onClick={handleCreateCheckpoint}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[350px]">
        <div className="space-y-2">
          {branches.map((branch) => (
            <Collapsible
              key={branch.id}
              open={expandedBranches[branch.id]}
              onOpenChange={() => toggleBranchExpand(branch.id)}
            >
              <div
                className={cn(
                  "flex items-center justify-between p-2 rounded cursor-pointer",
                  branch.id === activeBranchId
                    ? "bg-primary/10 font-medium"
                    : "hover:bg-muted"
                )}
              >
                <CollapsibleTrigger asChild>
                  <div className="flex items-center flex-1">
                    <Branches className="h-4 w-4 mr-2" />
                    <span>{branch.name}</span>
                  </div>
                </CollapsibleTrigger>
                <div className="flex items-center gap-1">
                  {branch.id !== activeBranchId && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onSwitchBranch(branch.id)}
                        title="Switch to this branch"
                      >
                        <Branches className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onMergeBranch(branch.id)}
                        title="Merge this branch"
                      >
                        <GitMerge className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              <CollapsibleContent>
                <div className="ml-4 mt-1 border-l pl-4 space-y-1">
                  {branch.states.map((state, stateIndex) => {
                    const isActive = 
                      branch.id === activeBranchId && 
                      stateIndex === currentStateIndex;
                    
                    return (
                      <div
                        key={state.id}
                        className={cn(
                          "flex items-center py-1 px-2 text-sm rounded",
                          isActive 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-muted cursor-pointer"
                        )}
                        onClick={() => {
                          if (!isActive) {
                            if (branch.id !== activeBranchId) {
                              onSwitchBranch(branch.id);
                            }
                            onGoToState(state.id);
                          }
                        }}
                      >
                        <div className="flex-1">
                          <div className="font-medium">
                            {state.name || `State ${stateIndex + 1}`}
                          </div>
                          <div className="text-xs opacity-70">
                            {new Date(state.timestamp).toLocaleString()}
                            {state.isCheckpoint && (
                              <span className="ml-2 bg-secondary/30 text-secondary-foreground px-1 rounded-sm text-xs">
                                Checkpoint
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export default HistoryPanel;
