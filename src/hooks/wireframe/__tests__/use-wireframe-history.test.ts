
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useWireframeHistory } from '../use-wireframe-history';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: vi.fn()
}));

vi.mock('uuid', () => ({
  v4: () => 'mock-uuid'
}));

// Mock localStorage
const mockStorage: Record<string, string> = {};
const mockLocalStorage = {
  getItem: vi.fn((key: string) => mockStorage[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    mockStorage[key] = value;
  })
};

vi.mock('@/hooks/use-local-storage', () => ({
  useLocalStorage: () => ({
    getItem: mockLocalStorage.getItem,
    setItem: mockLocalStorage.setItem
  })
}));

describe('useWireframeHistory', () => {
  const mockWireframe = {
    id: 'test-wireframe',
    title: 'Test Wireframe',
    sections: [],
    description: 'Test description'
  };

  const mockUpdatedWireframe = {
    ...mockWireframe,
    title: 'Updated Wireframe'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
  });

  it('should initialize with the initial wireframe', () => {
    const { result } = renderHook(() => 
      useWireframeHistory({
        wireframeId: 'test-wireframe',
        initialWireframe: mockWireframe
      })
    );

    expect(result.current.history.length).toBe(1);
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.history[0].wireframe).toEqual(mockWireframe);
  });

  it('should save history state when wireframe is updated', () => {
    const { result } = renderHook(() => 
      useWireframeHistory({
        wireframeId: 'test-wireframe',
        initialWireframe: mockWireframe
      })
    );

    act(() => {
      result.current.saveHistoryState(mockUpdatedWireframe, 'Updated title');
    });

    expect(result.current.history.length).toBe(2);
    expect(result.current.currentIndex).toBe(1);
    expect(result.current.history[1].wireframe).toEqual(mockUpdatedWireframe);
    expect(result.current.history[1].description).toBe('Updated title');
  });

  it('should undo to previous state', () => {
    const onChangeMock = vi.fn();
    
    const { result } = renderHook(() => 
      useWireframeHistory({
        wireframeId: 'test-wireframe',
        initialWireframe: mockWireframe,
        onChange: onChangeMock
      })
    );

    act(() => {
      result.current.saveHistoryState(mockUpdatedWireframe, 'Updated title');
    });

    act(() => {
      result.current.undo();
    });

    expect(result.current.currentIndex).toBe(0);
    expect(onChangeMock).toHaveBeenCalledWith(mockWireframe);
    expect(toast).toHaveBeenCalled();
  });

  it('should redo to next state', () => {
    const onChangeMock = vi.fn();
    
    const { result } = renderHook(() => 
      useWireframeHistory({
        wireframeId: 'test-wireframe',
        initialWireframe: mockWireframe,
        onChange: onChangeMock
      })
    );

    act(() => {
      result.current.saveHistoryState(mockUpdatedWireframe, 'Updated title');
    });

    act(() => {
      result.current.undo();
    });

    act(() => {
      result.current.redo();
    });

    expect(result.current.currentIndex).toBe(1);
    expect(onChangeMock).toHaveBeenCalledWith(mockUpdatedWireframe);
    expect(toast).toHaveBeenCalled();
  });

  it('should notify when nothing to undo', () => {
    const { result } = renderHook(() => 
      useWireframeHistory({
        wireframeId: 'test-wireframe',
        initialWireframe: mockWireframe
      })
    );

    act(() => {
      result.current.undo();
    });

    expect(toast).toHaveBeenCalledWith('Nothing to undo');
  });

  it('should notify when nothing to redo', () => {
    const { result } = renderHook(() => 
      useWireframeHistory({
        wireframeId: 'test-wireframe',
        initialWireframe: mockWireframe
      })
    );

    act(() => {
      result.current.redo();
    });

    expect(toast).toHaveBeenCalledWith('Nothing to redo');
  });

  it('should load history from localStorage', () => {
    const mockStoredHistory = [
      {
        wireframe: mockWireframe,
        timestamp: Date.now() - 1000,
        id: 'history-1',
        description: 'Initial state'
      },
      {
        wireframe: mockUpdatedWireframe,
        timestamp: Date.now(),
        id: 'history-2',
        description: 'Updated state'
      }
    ];

    mockStorage['wireframe-history-test-wireframe'] = JSON.stringify(mockStoredHistory);

    const { result } = renderHook(() => 
      useWireframeHistory({
        wireframeId: 'test-wireframe',
        saveToStorage: true
      })
    );

    expect(result.current.history.length).toBe(2);
    expect(result.current.currentIndex).toBe(1);
    expect(result.current.history[1].wireframe).toEqual(mockUpdatedWireframe);
  });

  it('should limit history size to maxHistoryStates', () => {
    const { result } = renderHook(() => 
      useWireframeHistory({
        wireframeId: 'test-wireframe',
        initialWireframe: mockWireframe,
        maxHistoryStates: 2
      })
    );

    act(() => {
      result.current.saveHistoryState({...mockWireframe, title: 'Update 1'}, 'Update 1');
    });

    act(() => {
      result.current.saveHistoryState({...mockWireframe, title: 'Update 2'}, 'Update 2');
    });

    expect(result.current.history.length).toBe(2);
    expect(result.current.currentIndex).toBe(1);
    expect(result.current.history[0].wireframe.title).toBe('Update 1');
    expect(result.current.history[1].wireframe.title).toBe('Update 2');
  });

  it('should get current wireframe correctly', () => {
    const { result } = renderHook(() => 
      useWireframeHistory({
        wireframeId: 'test-wireframe',
        initialWireframe: mockWireframe
      })
    );

    act(() => {
      result.current.saveHistoryState(mockUpdatedWireframe, 'Updated title');
    });

    expect(result.current.getCurrentWireframe()).toEqual(mockUpdatedWireframe);

    act(() => {
      result.current.undo();
    });

    expect(result.current.getCurrentWireframe()).toEqual(mockWireframe);
  });
});
