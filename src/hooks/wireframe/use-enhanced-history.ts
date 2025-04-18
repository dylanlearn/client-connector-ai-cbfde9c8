import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface HistoryState<T> {
  id: string;
  data: T;
  name?: string;
  timestamp: number;
  batchId?: string;
  branchId?: string;
  isCheckpoint?: boolean;
}

export interface HistoryBranch<T> {
  id: string;
  name: string;
  states: HistoryState<T>[];
  parentBranchId?: string;
  parentStateId?: string;
  isActive: boolean;
  createdAt: number;
}

export interface HistoryOptions {
  maxHistoryStates?: number;
  enableCompression?: boolean;
  autoNameStates?: boolean;
  batchTimeThreshold?: number; // ms to wait before creating a new batch
  enableBranching?: boolean;
}

const DEFAULT_OPTIONS: Required<HistoryOptions> = {
  maxHistoryStates: 100,
  enableCompression: true,
  autoNameStates: true,
  batchTimeThreshold: 500,
  enableBranching: true,
};

export function useEnhancedHistory<T>(
  initialData: T,
  options: HistoryOptions = {}
) {
  // Merge with default options
  const mergedOptions: Required<HistoryOptions> = {
    ...DEFAULT_OPTIONS,
    ...options
  };

  const { toast } = useToast();
  
  // State for branches
  const [branches, setBranches] = useState<HistoryBranch<T>[]>([
    {
      id: 'main',
      name: 'Main',
      states: [
        {
          id: '0',
          data: initialData,
          name: 'Initial State',
          timestamp: Date.now(),
          isCheckpoint: true,
        },
      ],
      isActive: true,
      createdAt: Date.now(),
    },
  ]);
  
  // Current active branch
  const [activeBranchId, setActiveBranchId] = useState<string>('main');
  
  // Current state index within the active branch
  const [currentStateIndex, setCurrentStateIndex] = useState<number>(0);
  
  // Batch handling
  const currentBatchId = useRef<string | null>(null);
  const lastActionTimestamp = useRef<number>(Date.now());
  
  // Get active branch and current state
  const getActiveBranch = useCallback(() => {
    return branches.find((branch) => branch.id === activeBranchId) || branches[0];
  }, [branches, activeBranchId]);
  
  const getCurrentState = useCallback(() => {
    const branch = getActiveBranch();
    return branch.states[currentStateIndex];
  }, [getActiveBranch, currentStateIndex]);
  
  // Helper to generate a name for a state based on the changes
  const generateStateName = useCallback((prev: T, current: T): string => {
    // Simplified detection logic - in a real app we'd do deeper analysis
    if (!prev || !current) return "State Update";
    
    // Try to detect the type of change by diffing
    try {
      const prevObj = JSON.stringify(prev);
      const currentObj = JSON.stringify(current);
      
      if (prevObj.length > currentObj.length + 10) {
        return "Removed Elements";
      } else if (currentObj.length > prevObj.length + 10) {
        return "Added Elements";
      } else {
        return "Modified Elements";
      }
    } catch {
      return "State Update";
    }
  }, []);
  
  // Compute diff between two states
  const computeStateDiff = useCallback((prev: T, current: T) => {
    // This is a simplified diff - a real implementation would have a more sophisticated diff algorithm
    try {
      const prevObj = typeof prev === 'object' ? prev : { value: prev };
      const currentObj = typeof current === 'object' ? current : { value: current };
      
      const changes: Record<string, { prev: any; current: any }> = {};
      
      // Find all keys in both objects
      const allKeys = new Set([
        ...Object.keys(prevObj as Record<string, any>),
        ...Object.keys(currentObj as Record<string, any>),
      ]);
      
      allKeys.forEach((key) => {
        const prevVal = (prevObj as Record<string, any>)[key];
        const currentVal = (currentObj as Record<string, any>)[key];
        
        if (JSON.stringify(prevVal) !== JSON.stringify(currentVal)) {
          changes[key] = { prev: prevVal, current: currentVal };
        }
      });
      
      return changes;
    } catch {
      return { full: { prev, current: current } };
    }
  }, []);
  
  // Add a new state to the history
  const pushState = useCallback((newState: T, stateName?: string) => {
    setBranches((prevBranches) => {
      const updatedBranches = [...prevBranches];
      const activeBranchIndex = updatedBranches.findIndex(
        (branch) => branch.id === activeBranchId
      );
      
      if (activeBranchIndex === -1) return prevBranches;
      
      const activeBranch = { ...updatedBranches[activeBranchIndex] };
      const currentState = activeBranch.states[currentStateIndex];
      
      // Check if we need to trim future states (if we're not at the latest state)
      if (currentStateIndex < activeBranch.states.length - 1) {
        activeBranch.states = activeBranch.states.slice(0, currentStateIndex + 1);
      }
      
      // Determine if this should be part of the current batch
      const now = Date.now();
      const shouldStartNewBatch = 
        !currentBatchId.current || 
        (now - lastActionTimestamp.current > mergedOptions.batchTimeThreshold);
      
      const batchId = shouldStartNewBatch ? `batch-${now}` : currentBatchId.current;
      
      // Auto-generate name if not provided
      const name = stateName || (mergedOptions.autoNameStates 
        ? generateStateName(currentState.data, newState)
        : `State ${activeBranch.states.length}`);
      
      // Add the new state
      activeBranch.states.push({
        id: `state-${now}-${Math.floor(Math.random() * 10000)}`,
        data: newState,
        name,
        timestamp: now,
        batchId,
        branchId: activeBranchId,
      });
      
      // Update compression if enabled
      if (mergedOptions.enableCompression && activeBranch.states.length > mergedOptions.maxHistoryStates) {
        // Keep checkpoints and compress batches in between
        const checkpoints = activeBranch.states.filter(state => state.isCheckpoint);
        const firstState = activeBranch.states[0];
        const recentStates = activeBranch.states.slice(-10); // Always keep the 10 most recent states
        
        // If we have checkpoints, use them for compression
        if (checkpoints.length > 0) {
          activeBranch.states = [
            firstState, 
            ...checkpoints.filter(s => s.id !== firstState.id), 
            ...recentStates.filter(s => !checkpoints.some(c => c.id === s.id) && s.id !== firstState.id)
          ];
        } else {
          // If no checkpoints, just trim older states
          activeBranch.states = [firstState, ...recentStates.slice(1)];
        }
      }
      
      // Update the current state index
      const newStateIndex = activeBranch.states.length - 1;
      
      // Update the branch
      updatedBranches[activeBranchIndex] = activeBranch;
      
      // Update refs for batching
      currentBatchId.current = batchId;
      lastActionTimestamp.current = now;
      
      // Update state index
      setCurrentStateIndex(newStateIndex);
      
      return updatedBranches;
    });
  }, [activeBranchId, currentStateIndex, generateStateName, mergedOptions]);
  
  // Create a checkpoint (named state that won't be compressed)
  const createCheckpoint = useCallback((name: string) => {
    setBranches((prevBranches) => {
      const updatedBranches = [...prevBranches];
      const activeBranchIndex = updatedBranches.findIndex(
        (branch) => branch.id === activeBranchId
      );
      
      if (activeBranchIndex === -1) return prevBranches;
      
      const activeBranch = { ...updatedBranches[activeBranchIndex] };
      const currentState = { ...activeBranch.states[currentStateIndex] };
      
      // Mark the current state as a checkpoint
      currentState.isCheckpoint = true;
      currentState.name = name;
      
      activeBranch.states[currentStateIndex] = currentState;
      updatedBranches[activeBranchIndex] = activeBranch;
      
      return updatedBranches;
    });
    
    toast({
      title: "Checkpoint Created",
      description: `Checkpoint "${name}" created successfully`,
    });
  }, [activeBranchId, currentStateIndex, toast]);
  
  // Create a new branch from the current state
  const createBranch = useCallback((branchName: string) => {
    if (!mergedOptions.enableBranching) {
      toast({
        title: "Branching Disabled",
        description: "Branching is disabled in the current configuration.",
        variant: "destructive",
      });
      return;
    }
    
    setBranches((prevBranches) => {
      const currentBranch = prevBranches.find((branch) => branch.id === activeBranchId);
      if (!currentBranch) return prevBranches;
      
      const currentState = currentBranch.states[currentStateIndex];
      
      // Create new branch
      const newBranch: HistoryBranch<T> = {
        id: `branch-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        name: branchName,
        states: [
          {
            id: `state-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            data: currentState.data,
            name: `Branched from ${currentBranch.name}`,
            timestamp: Date.now(),
            branchId: `branch-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            isCheckpoint: true,
          },
        ],
        parentBranchId: currentBranch.id,
        parentStateId: currentState.id,
        isActive: true,
        createdAt: Date.now(),
      };
      
      // Update active status on all branches
      const updatedBranches = prevBranches.map((branch) => ({
        ...branch,
        isActive: false,
      }));
      
      // Activate the new branch
      setActiveBranchId(newBranch.id);
      setCurrentStateIndex(0);
      
      return [...updatedBranches, newBranch];
    });
    
    toast({
      title: "Branch Created",
      description: `New branch "${branchName}" created`,
    });
  }, [activeBranchId, currentStateIndex, mergedOptions.enableBranching, toast]);
  
  // Switch to a different branch
  const switchBranch = useCallback((branchId: string) => {
    const branch = branches.find((b) => b.id === branchId);
    if (!branch) {
      toast({
        title: "Branch Not Found",
        description: "The specified branch could not be found.",
        variant: "destructive",
      });
      return;
    }
    
    setActiveBranchId(branchId);
    setCurrentStateIndex(branch.states.length - 1);
    
    toast({
      title: "Branch Switched",
      description: `Switched to branch "${branch.name}"`,
    });
  }, [branches, toast]);
  
  // Merge a branch into the current branch
  const mergeBranch = useCallback((sourceBranchId: string) => {
    setBranches((prevBranches) => {
      const sourceBranch = prevBranches.find((b) => b.id === sourceBranchId);
      const targetBranch = prevBranches.find((b) => b.id === activeBranchId);
      
      if (!sourceBranch || !targetBranch) return prevBranches;
      
      const latestSourceState = sourceBranch.states[sourceBranch.states.length - 1];
      
      // Add the latest state from the source branch to the target branch
      const updatedTargetBranch = {
        ...targetBranch,
        states: [
          ...targetBranch.states,
          {
            id: `merge-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            data: latestSourceState.data,
            name: `Merged from ${sourceBranch.name}`,
            timestamp: Date.now(),
            branchId: targetBranch.id,
            isCheckpoint: true,
          },
        ],
      };
      
      // Update state index to point to the merged state
      setCurrentStateIndex(updatedTargetBranch.states.length - 1);
      
      // Update the branches array
      return prevBranches.map((branch) =>
        branch.id === targetBranch.id ? updatedTargetBranch : branch
      );
    });
    
    toast({
      title: "Branch Merged",
      description: `Branch merged successfully`,
    });
  }, [activeBranchId, toast]);
  
  // Go to a specific state by ID
  const goToState = useCallback((stateId: string) => {
    setBranches((prevBranches) => {
      const activeBranch = prevBranches.find((branch) => branch.id === activeBranchId);
      if (!activeBranch) return prevBranches;
      
      const stateIndex = activeBranch.states.findIndex((state) => state.id === stateId);
      if (stateIndex === -1) return prevBranches;
      
      setCurrentStateIndex(stateIndex);
      return prevBranches;
    });
  }, [activeBranchId]);
  
  // Undo operation
  const undo = useCallback(() => {
    if (currentStateIndex > 0) {
      setCurrentStateIndex((prev) => prev - 1);
      return true;
    }
    return false;
  }, [currentStateIndex]);
  
  // Redo operation
  const redo = useCallback(() => {
    const activeBranch = getActiveBranch();
    if (currentStateIndex < activeBranch.states.length - 1) {
      setCurrentStateIndex((prev) => prev + 1);
      return true;
    }
    return false;
  }, [currentStateIndex, getActiveBranch]);
  
  // Get current data
  const currentData = getCurrentState()?.data || initialData;
  
  // Can undo/redo
  const canUndo = currentStateIndex > 0;
  const canRedo = currentStateIndex < getActiveBranch().states.length - 1;
  
  return {
    data: currentData,
    undo,
    redo,
    canUndo,
    canRedo,
    pushState,
    createCheckpoint,
    createBranch,
    switchBranch,
    mergeBranch,
    goToState,
    branches,
    activeBranchId,
    currentStateIndex,
    getCurrentState,
    getActiveBranch,
    computeStateDiff,
  };
}
