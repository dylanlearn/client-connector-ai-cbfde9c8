
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Undo2, 
  Redo2, 
  Save, 
  GitBranch, 
  GitMerge, 
  Clock, 
  Trash2
} from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HistoryState {
  name: string;
  timestamp: number;
  batchId?: string;
  branchName?: string;
}

interface HistoryBranch {
  name: string;
  states: HistoryState[];
  currentIndex: number;
}

interface AdvancedHistoryControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onJumpToState?: (index: number) => void;
  onCreateNamedState?: (name: string) => void;
  history?: HistoryState[];
  className?: string;
  // Branching related props
  enableBranching?: boolean;
  branches?: Record<string, HistoryBranch>;
  currentBranch?: string;
  onCreateBranch?: (name: string) => boolean;
  onSwitchBranch?: (name: string) => boolean;
  onMergeBranch?: (source: string, target: string) => boolean;
  onDeleteBranch?: (name: string) => boolean;
}

const AdvancedHistoryControls: React.FC<AdvancedHistoryControlsProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onJumpToState,
  onCreateNamedState,
  history = [],
  className,
  // Branching props
  enableBranching = false,
  branches = {},
  currentBranch = 'main',
  onCreateBranch,
  onSwitchBranch,
  onMergeBranch,
  onDeleteBranch
}) => {
  const [newStateName, setNewStateName] = useState("");
  const [newBranchName, setNewBranchName] = useState("");
  const [mergeSource, setMergeSource] = useState("");
  const [mergeTarget, setMergeTarget] = useState("main");
  
  // Format timestamp for display
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };
  
  // Create a named history state
  const handleCreateNamedState = () => {
    if (onCreateNamedState && newStateName.trim()) {
      onCreateNamedState(newStateName.trim());
      setNewStateName("");
    }
  };
  
  // Create a new branch
  const handleCreateBranch = () => {
    if (onCreateBranch && newBranchName.trim()) {
      onCreateBranch(newBranchName.trim());
      setNewBranchName("");
    }
  };
  
  // Handle branch merge
  const handleMergeBranch = () => {
    if (onMergeBranch && mergeSource && mergeTarget) {
      onMergeBranch(mergeSource, mergeTarget);
      setMergeSource("");
      setMergeTarget("main");
    }
  };
  
  // Get branch names as array
  const branchNames = Object.keys(branches);
  
  return (
    <div className={cn("flex gap-2 items-center", className)}>
      <TooltipProvider>
        {/* Basic Undo/Redo Controls */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={onUndo}
              disabled={!canUndo}
              className="h-8 w-8"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Undo (Ctrl+Z)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={onRedo}
              disabled={!canRedo}
              className="h-8 w-8"
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Redo (Ctrl+Y)</p>
          </TooltipContent>
        </Tooltip>
        
        {/* History Timeline Dropdown */}
        {history.length > 0 && onJumpToState && (
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Clock className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>History Timeline</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>History States</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {history.map((state, index) => (
                <DropdownMenuItem 
                  key={index} 
                  onClick={() => onJumpToState(index)}
                  className={cn(
                    "flex justify-between",
                    index === branches[currentBranch]?.currentIndex && "font-bold bg-accent"
                  )}
                >
                  <span className="truncate mr-2">{state.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(state.timestamp)}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        {/* Create Named State Dialog */}
        {onCreateNamedState && (
          <Dialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Save className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create Named State</p>
              </TooltipContent>
            </Tooltip>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Named History State</DialogTitle>
                <DialogDescription>
                  Give this canvas state a meaningful name to easily identify it later.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stateName" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="stateName"
                    value={newStateName}
                    onChange={(e) => setNewStateName(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g. Added Header Section"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  onClick={handleCreateNamedState}
                  disabled={!newStateName.trim()}
                >
                  Save State
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Branching Controls - Only show if enabled */}
        {enableBranching && (
          <>
            {/* Current Branch Indicator and Switcher */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-8 text-xs">
                      <GitBranch className="h-4 w-4 mr-1" />
                      {currentBranch}
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Current Branch: {currentBranch}</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent>
                <DropdownMenuLabel>Switch Branch</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {branchNames.map((branch) => (
                  <DropdownMenuItem 
                    key={branch} 
                    onClick={() => onSwitchBranch?.(branch)}
                    className={branch === currentBranch ? 'font-bold bg-accent' : ''}
                  >
                    {branch}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Create Branch Dialog */}
            <Dialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <GitBranch className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create Branch</p>
                </TooltipContent>
              </Tooltip>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Branch</DialogTitle>
                  <DialogDescription>
                    Create a new branch from the current state to explore alternative designs.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="branchName" className="text-right">
                      Branch Name
                    </Label>
                    <Input
                      id="branchName"
                      value={newBranchName}
                      onChange={(e) => setNewBranchName(e.target.value)}
                      className="col-span-3"
                      placeholder="e.g. alternative-layout"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleCreateBranch}
                    disabled={!newBranchName.trim() || branchNames.includes(newBranchName.trim())}
                  >
                    Create Branch
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Merge Branch Dialog */}
            <Dialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <GitMerge className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Merge Branches</p>
                </TooltipContent>
              </Tooltip>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Merge Branches</DialogTitle>
                  <DialogDescription>
                    Merge changes from one branch into another.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="sourceBranch" className="text-right">
                      Source Branch
                    </Label>
                    <select
                      id="sourceBranch"
                      value={mergeSource}
                      onChange={(e) => setMergeSource(e.target.value)}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="" disabled>
                        Select source branch
                      </option>
                      {branchNames.map((branch) => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="targetBranch" className="text-right">
                      Target Branch
                    </Label>
                    <select
                      id="targetBranch"
                      value={mergeTarget}
                      onChange={(e) => setMergeTarget(e.target.value)}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="" disabled>
                        Select target branch
                      </option>
                      {branchNames.map((branch) => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleMergeBranch}
                    disabled={
                      !mergeSource || 
                      !mergeTarget || 
                      mergeSource === mergeTarget
                    }
                  >
                    Merge Branches
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Delete Branch Button */}
            {currentBranch !== 'main' && onDeleteBranch && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDeleteBranch(currentBranch)}
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Current Branch</p>
                </TooltipContent>
              </Tooltip>
            )}
          </>
        )}
      </TooltipProvider>
    </div>
  );
};

export default AdvancedHistoryControls;
