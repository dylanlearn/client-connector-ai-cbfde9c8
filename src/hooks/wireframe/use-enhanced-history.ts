import { useState, useCallback, useEffect } from 'react';

export interface HistoryItem {
  id: string;
  timestamp: number;
  description: string;
}

export interface Branch {
  id: string;
  name: string;
  createdAt: number;
  historyCount: number;
}

export interface NamedState {
  id: string;
  name: string;
  timestamp: number;
  stateId: string;
}

export interface EnhancedHistoryState {
  data: any; // The actual state data (serialized)
  history: HistoryItem[];
  currentPosition: number;
  branches: Branch[];
  currentBranch: string;
  checkpoints: NamedState[];
}

export function useEnhancedHistory(projectId?: string) {
  const [state, setState] = useState<EnhancedHistoryState>({
    data: JSON.stringify({
      history: [],
      currentPosition: 0,
      branches: [],
      currentBranch: 'main',
      checkpoints: []
    }),
    history: [],
    currentPosition: 0, 
    branches: [{ id: 'main', name: 'Main', createdAt: Date.now(), historyCount: 0 }],
    currentBranch: 'main',
    checkpoints: []
  });

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Parse data from JSON string
  const parsedData = JSON.parse(state.data);

  // Keep local state in sync with parsed data
  useEffect(() => {
    setState(prev => ({
      ...prev,
      history: parsedData.history || [],
      currentPosition: parsedData.currentPosition || 0,
      branches: parsedData.branches || [{ id: 'main', name: 'Main', createdAt: Date.now(), historyCount: 0 }],
      currentBranch: parsedData.currentBranch || 'main',
      checkpoints: parsedData.checkpoints || []
    }));

    setCanUndo(parsedData.currentPosition > 0);
    setCanRedo(parsedData.history && parsedData.currentPosition < parsedData.history.length - 1);
  }, [state.data]);

  // Push a new state
  const pushState = useCallback((newState: any, description?: string) => {
    const newHistory = [...parsedData.history.slice(0, parsedData.currentPosition + 1), {
      id: Date.now().toString(),
      timestamp: Date.now(),
      description: description || 'State change',
      state: JSON.stringify(newState)
    }];

    const newData = {
      ...parsedData,
      history: newHistory,
      currentPosition: newHistory.length - 1
    };

    setState(prev => ({
      ...prev,
      data: JSON.stringify(newData)
    }));
  }, [parsedData]);

  // Undo
  const undo = useCallback(() => {
    if (parsedData.currentPosition <= 0) return false;

    const newPosition = parsedData.currentPosition - 1;
    const newData = {
      ...parsedData,
      currentPosition: newPosition
    };

    setState(prev => ({
      ...prev,
      data: JSON.stringify(newData)
    }));
    return true;
  }, [parsedData]);

  // Redo
  const redo = useCallback(() => {
    if (parsedData.currentPosition >= parsedData.history.length - 1) return false;

    const newPosition = parsedData.currentPosition + 1;
    const newData = {
      ...parsedData,
      currentPosition: newPosition
    };

    setState(prev => ({
      ...prev,
      data: JSON.stringify(newData)
    }));
    return true;
  }, [parsedData]);

  // Create a checkpoint (named state)
  const createCheckpoint = useCallback((name: string) => {
    const newCheckpoint = {
      id: Date.now().toString(),
      name,
      timestamp: Date.now(),
      stateId: parsedData.history[parsedData.currentPosition]?.id || 'initial'
    };

    const newCheckpoints = [...(parsedData.checkpoints || []), newCheckpoint];
    const newData = {
      ...parsedData,
      checkpoints: newCheckpoints
    };

    setState(prev => ({
      ...prev,
      data: JSON.stringify(newData)
    }));
  }, [parsedData]);

  // Create a branch
  const createBranch = useCallback((branchName: string) => {
    const branchId = Date.now().toString();
    const newBranch = {
      id: branchId,
      name: branchName,
      createdAt: Date.now(),
      historyCount: 0
    };

    const newBranches = [...(parsedData.branches || []), newBranch];
    const newData = {
      ...parsedData,
      branches: newBranches,
      currentBranch: branchId,
      // Copy current history to new branch
      [branchId]: {
        history: parsedData.history,
        currentPosition: parsedData.currentPosition
      }
    };

    setState(prev => ({
      ...prev,
      data: JSON.stringify(newData)
    }));
  }, [parsedData]);

  // Switch branch
  const switchBranch = useCallback((branchId: string) => {
    if (!parsedData.branches.some((b: Branch) => b.id === branchId)) return;

    const branchData = parsedData[branchId] || {
      history: [],
      currentPosition: 0
    };

    const newData = {
      ...parsedData,
      currentBranch: branchId,
      history: branchData.history,
      currentPosition: branchData.currentPosition
    };

    setState(prev => ({
      ...prev,
      data: JSON.stringify(newData)
    }));
  }, [parsedData]);

  // Jump to checkpoint
  const jumpToCheckpoint = useCallback((checkpointId: string) => {
    const checkpoint = parsedData.checkpoints.find((c: NamedState) => c.id === checkpointId || c.stateId === checkpointId);
    if (!checkpoint) return;

    const statePosition = parsedData.history.findIndex((item: HistoryItem) => item.id === checkpoint.stateId);
    if (statePosition === -1) return;

    const newData = {
      ...parsedData,
      currentPosition: statePosition
    };

    setState(prev => ({
      ...prev,
      data: JSON.stringify(newData)
    }));
  }, [parsedData]);

  // Compare states
  const computeStateDiff = useCallback((stateId1: string, stateId2: string) => {
    const state1 = parsedData.history.find((item: HistoryItem) => item.id === stateId1);
    const state2 = parsedData.history.find((item: HistoryItem) => item.id === stateId2);
    
    if (!state1 || !state2) return { changes: [], summary: 'Unable to compare states' };

    try {
      const data1 = JSON.parse(state1.state);
      const data2 = JSON.parse(state2.state);

      // Simple diff implementation
      const changes: Array<{
        type: 'added' | 'removed' | 'modified';
        path: string;
        values: [any, any];
      }> = [];

      // Compare properties
      Object.keys(data1).forEach(key => {
        if (!data2.hasOwnProperty(key)) {
          changes.push({
            type: 'removed',
            path: key,
            values: [data1[key], undefined]
          });
        } else if (JSON.stringify(data1[key]) !== JSON.stringify(data2[key])) {
          changes.push({
            type: 'modified',
            path: key,
            values: [data1[key], data2[key]]
          });
        }
      });

      Object.keys(data2).forEach(key => {
        if (!data1.hasOwnProperty(key)) {
          changes.push({
            type: 'added',
            path: key,
            values: [undefined, data2[key]]
          });
        }
      });

      return {
        changes,
        summary: `${changes.length} differences found between states`
      };
    } catch (error) {
      return {
        changes: [],
        summary: `Error comparing states: ${(error as Error).message}`
      };
    }
  }, [parsedData]);

  return {
    data: state.data,
    branches: state.branches,
    currentBranch: state.currentBranch,
    checkpoints: state.checkpoints,
    canUndo,
    canRedo,
    undo,
    redo,
    pushState,
    createCheckpoint,
    createBranch,
    switchBranch,
    jumpToCheckpoint,
    computeStateDiff
  };
}
