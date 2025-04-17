
import { useState, useCallback, useEffect } from 'react';
import { fabric } from 'fabric';

interface HistoryState {
  json: string;
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

interface UseCanvasHistoryOptions {
  canvas: fabric.Canvas | null;
  maxHistorySteps?: number;
  saveInitialState?: boolean;
  enableBranching?: boolean;
}

export default function useCanvasHistory({
  canvas,
  maxHistorySteps = 50,
  saveInitialState = false,
  enableBranching = false
}: UseCanvasHistoryOptions) {
  const [branches, setBranches] = useState<Record<string, HistoryBranch>>({
    main: { name: 'main', states: [], currentIndex: -1 }
  });
  const [currentBranch, setCurrentBranch] = useState<string>('main');
  const [isHistoryAction, setIsHistoryAction] = useState<boolean>(false);
  const [batchOperationId, setBatchOperationId] = useState<string | null>(null);
  
  // Get current branch data
  const activeBranch = branches[currentBranch];
  const history = activeBranch?.states || [];
  const currentIndex = activeBranch?.currentIndex || -1;

  // Save the current state to history
  const saveHistoryState = useCallback((name: string = 'Canvas state') => {
    if (!canvas) return;
    
    const canvasJSON = JSON.stringify(canvas.toJSON(['id', 'name', 'data']));
    
    setBranches(prevBranches => {
      const branch = prevBranches[currentBranch];
      
      // Get the current history up to currentIndex
      const newStates = branch.states.slice(0, branch.currentIndex + 1);
      
      // Add new state
      newStates.push({
        json: canvasJSON,
        name,
        timestamp: Date.now(),
        batchId: batchOperationId || undefined,
        branchName: currentBranch
      });
      
      // Limit history size
      const limitedStates = newStates.length > maxHistorySteps 
        ? newStates.slice(newStates.length - maxHistorySteps) 
        : newStates;
      
      const newIndex = Math.min(limitedStates.length - 1, maxHistorySteps - 1);
      
      // Update branches
      return {
        ...prevBranches,
        [currentBranch]: {
          ...branch,
          states: limitedStates,
          currentIndex: newIndex
        }
      };
    });
  }, [canvas, currentBranch, batchOperationId, maxHistorySteps]);
  
  // Start a batch operation
  const startBatchOperation = useCallback(() => {
    const newBatchId = `batch-${Date.now()}`;
    setBatchOperationId(newBatchId);
    return newBatchId;
  }, []);
  
  // End a batch operation
  const endBatchOperation = useCallback(() => {
    setBatchOperationId(null);
  }, []);
  
  // Create a named history state
  const createNamedState = useCallback((name: string) => {
    saveHistoryState(name);
  }, [saveHistoryState]);
  
  // Undo the last action
  const undo = useCallback(() => {
    if (!canvas || currentIndex <= 0) return;
    
    setIsHistoryAction(true);
    
    const branch = branches[currentBranch];
    const newIndex = currentIndex - 1;
    const stateToRestore = branch.states[newIndex];
    
    if (stateToRestore) {
      canvas.loadFromJSON(JSON.parse(stateToRestore.json), () => {
        canvas.renderAll();
        
        setBranches(prevBranches => ({
          ...prevBranches,
          [currentBranch]: {
            ...branch,
            currentIndex: newIndex
          }
        }));
        
        setIsHistoryAction(false);
      });
    } else {
      setIsHistoryAction(false);
    }
  }, [canvas, currentIndex, branches, currentBranch]);
  
  // Redo the last undone action
  const redo = useCallback(() => {
    if (!canvas) return;
    
    const branch = branches[currentBranch];
    if (branch.currentIndex >= branch.states.length - 1) return;
    
    setIsHistoryAction(true);
    
    const newIndex = branch.currentIndex + 1;
    const stateToRestore = branch.states[newIndex];
    
    if (stateToRestore) {
      canvas.loadFromJSON(JSON.parse(stateToRestore.json), () => {
        canvas.renderAll();
        
        setBranches(prevBranches => ({
          ...prevBranches,
          [currentBranch]: {
            ...branch,
            currentIndex: newIndex
          }
        }));
        
        setIsHistoryAction(false);
      });
    } else {
      setIsHistoryAction(false);
    }
  }, [canvas, branches, currentBranch]);
  
  // Jump to a specific history state
  const jumpToState = useCallback((stateIndex: number) => {
    if (!canvas) return;
    if (stateIndex < 0 || stateIndex >= history.length) return;
    
    setIsHistoryAction(true);
    
    const stateToRestore = history[stateIndex];
    
    canvas.loadFromJSON(JSON.parse(stateToRestore.json), () => {
      canvas.renderAll();
      
      setBranches(prevBranches => ({
        ...prevBranches,
        [currentBranch]: {
          ...prevBranches[currentBranch],
          currentIndex: stateIndex
        }
      }));
      
      setIsHistoryAction(false);
    });
  }, [canvas, history, currentBranch]);
  
  // Create a new branch from the current state
  const createBranch = useCallback((branchName: string) => {
    if (!enableBranching || !canvas) return false;
    
    // Check if branch name already exists
    if (branches[branchName]) return false;
    
    const currentState = history[currentIndex];
    if (!currentState) return false;
    
    const newBranch: HistoryBranch = {
      name: branchName,
      states: [{ ...currentState, branchName }],
      currentIndex: 0
    };
    
    setBranches(prev => ({
      ...prev,
      [branchName]: newBranch
    }));
    
    setCurrentBranch(branchName);
    return true;
  }, [branches, canvas, currentIndex, enableBranching, history]);
  
  // Switch to a different branch
  const switchBranch = useCallback((branchName: string) => {
    if (!enableBranching || !canvas) return false;
    
    const branch = branches[branchName];
    if (!branch) return false;
    
    setIsHistoryAction(true);
    
    const stateToRestore = branch.states[branch.currentIndex];
    
    canvas.loadFromJSON(JSON.parse(stateToRestore.json), () => {
      canvas.renderAll();
      setCurrentBranch(branchName);
      setIsHistoryAction(false);
    });
    
    return true;
  }, [branches, canvas, enableBranching]);
  
  // Merge a branch into another
  const mergeBranch = useCallback((sourceBranchName: string, targetBranchName: string = 'main') => {
    if (!enableBranching) return false;
    
    const sourceBranch = branches[sourceBranchName];
    const targetBranch = branches[targetBranchName];
    
    if (!sourceBranch || !targetBranch) return false;
    
    // Get the latest state from the source branch
    const latestState = sourceBranch.states[sourceBranch.currentIndex];
    if (!latestState) return false;
    
    // Add the state to the target branch with a merge note
    setBranches(prev => {
      const updatedTargetStates = [
        ...prev[targetBranchName].states.slice(0, prev[targetBranchName].currentIndex + 1),
        { 
          ...latestState, 
          name: `Merge from ${sourceBranchName}: ${latestState.name}`,
          branchName: targetBranchName
        }
      ];
      
      return {
        ...prev,
        [targetBranchName]: {
          ...prev[targetBranchName],
          states: updatedTargetStates,
          currentIndex: updatedTargetStates.length - 1
        }
      };
    });
    
    return true;
  }, [branches, enableBranching]);
  
  // Delete a branch
  const deleteBranch = useCallback((branchName: string) => {
    if (!enableBranching || branchName === 'main') return false;
    
    if (currentBranch === branchName) {
      switchBranch('main');
    }
    
    setBranches(prev => {
      const { [branchName]: _, ...remainingBranches } = prev;
      return remainingBranches;
    });
    
    return true;
  }, [currentBranch, enableBranching, switchBranch]);
  
  // Initialize with canvas
  useEffect(() => {
    if (canvas && saveInitialState && history.length === 0) {
      saveHistoryState('Initial state');
    }
    
    // Setup canvas event listeners for auto-save
    if (canvas) {
      const handleObjectModified = () => {
        if (!isHistoryAction) {
          saveHistoryState('Object modified');
        }
      };
      
      const handleObjectAdded = (e: any) => {
        // Don't save history for temporary objects
        if (e.target && !e.target.temporary && !isHistoryAction) {
          saveHistoryState('Object added');
        }
      };
      
      const handleObjectRemoved = () => {
        if (!isHistoryAction) {
          saveHistoryState('Object removed');
        }
      };
      
      canvas.on('object:modified', handleObjectModified);
      canvas.on('object:added', handleObjectAdded);
      canvas.on('object:removed', handleObjectRemoved);
      
      return () => {
        canvas.off('object:modified', handleObjectModified);
        canvas.off('object:added', handleObjectAdded);
        canvas.off('object:removed', handleObjectRemoved);
      };
    }
  }, [canvas, saveInitialState, history.length, saveHistoryState, isHistoryAction]);
  
  // Track whether undo/redo are available
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;
  
  return {
    history,
    branches,
    currentIndex,
    currentBranch,
    saveHistoryState,
    createNamedState,
    undo,
    redo,
    jumpToState,
    startBatchOperation,
    endBatchOperation,
    canUndo,
    canRedo,
    isHistoryAction,
    // Branching operations
    createBranch,
    switchBranch,
    mergeBranch,
    deleteBranch,
    enableBranching
  };
}
