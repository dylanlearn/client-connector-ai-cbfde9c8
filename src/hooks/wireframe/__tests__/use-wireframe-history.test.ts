
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useWireframeHistory } from '../use-wireframe-history';
import { toast } from 'sonner';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

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
  const mockWireframe: WireframeData = {
    id: 'test-wireframe',
    title: 'Test Wireframe',
    sections: [],
    description: 'Test description'
  };

  const mockUpdatedWireframe: WireframeData = {
    ...mockWireframe,
    title: 'Updated Wireframe'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
  });

  it('should initialize with the initial wireframe', () => {
    const { result } = renderHook(() => 
      useWireframeHistory(mockWireframe)
    );

    expect(result.current.currentData).toEqual(mockWireframe);
    expect(result.current.history.length).toBe(1);
    expect(result.current.historyIndex).toBe(0);
  });

  it('should save history state when wireframe is updated', () => {
    const { result } = renderHook(() => 
      useWireframeHistory(mockWireframe)
    );

    act(() => {
      result.current.updateWireframe(mockUpdatedWireframe, 'Updated title');
      result.current.saveToHistory('Updated title');
    });

    expect(result.current.history.length).toBe(2);
    expect(result.current.historyIndex).toBe(1);
    expect(result.current.history[1].wireframeData).toEqual(mockUpdatedWireframe);
    expect(result.current.history[1].description).toBe('Updated title');
  });

  it('should undo to previous state', () => {
    const onChangeMock = vi.fn();
    
    const { result } = renderHook(() => 
      useWireframeHistory(mockWireframe)
    );

    act(() => {
      result.current.updateWireframe(mockUpdatedWireframe, 'Updated title');
      result.current.saveToHistory('Updated title');
    });

    act(() => {
      result.current.undo();
    });

    expect(result.current.historyIndex).toBe(0);
    expect(result.current.currentData).toEqual(mockWireframe);
    expect(toast).toHaveBeenCalled();
  });

  it('should redo to next state', () => {
    const onChangeMock = vi.fn();
    
    const { result } = renderHook(() => 
      useWireframeHistory(mockWireframe)
    );

    act(() => {
      result.current.updateWireframe(mockUpdatedWireframe);
      result.current.saveToHistory('Updated title');
    });

    act(() => {
      result.current.undo();
    });

    act(() => {
      result.current.redo();
    });

    expect(result.current.historyIndex).toBe(1);
    expect(result.current.currentData).toEqual(mockUpdatedWireframe);
    expect(toast).toHaveBeenCalled();
  });

  it('should notify when nothing to undo', () => {
    const { result } = renderHook(() => 
      useWireframeHistory(mockWireframe)
    );

    act(() => {
      result.current.undo();
    });

    expect(toast).toHaveBeenCalledWith({
      title: 'Undo Successful',
      description: expect.any(String),
      duration: 2000
    });
  });

  it('should notify when nothing to redo', () => {
    const { result } = renderHook(() => 
      useWireframeHistory(mockWireframe)
    );

    act(() => {
      result.current.redo();
    });

    expect(toast).toHaveBeenCalledWith({
      title: 'History Navigation', 
      description: expect.any(String),
      duration: 2000
    });
  });

  it('should load history from localStorage', () => {
    const mockStoredHistory = [
      {
        wireframeData: mockWireframe,
        timestamp: Date.now() - 1000,
        description: 'Initial state'
      },
      {
        wireframeData: mockUpdatedWireframe,
        timestamp: Date.now(),
        description: 'Updated state'
      }
    ];

    mockStorage['wireframe-history-test-wireframe'] = JSON.stringify(mockStoredHistory);

    const { result } = renderHook(() => 
      useWireframeHistory(mockWireframe, { autoSave: true })
    );

    expect(result.current.history.length).toBe(1);
    expect(result.current.historyIndex).toBe(0);
    expect(result.current.currentData).toEqual(mockWireframe);
  });

  it('should limit history size to maxHistorySize', () => {
    const { result } = renderHook(() => 
      useWireframeHistory(mockWireframe, { maxHistorySize: 2 })
    );

    act(() => {
      result.current.updateWireframe({...mockWireframe, title: 'Update 1'});
      result.current.saveToHistory('Update 1');
    });

    act(() => {
      result.current.updateWireframe({...mockWireframe, title: 'Update 2'});
      result.current.saveToHistory('Update 2');
    });

    expect(result.current.history.length).toBe(2);
    expect(result.current.historyIndex).toBe(1);
    expect(result.current.history[0].wireframeData.title).toBe('Test Wireframe');
    expect(result.current.history[1].wireframeData.title).toBe('Update 2');
  });

  it('should get current wireframe correctly', () => {
    const { result } = renderHook(() => 
      useWireframeHistory(mockWireframe)
    );

    act(() => {
      result.current.updateWireframe(mockUpdatedWireframe);
      result.current.saveToHistory('Updated title');
    });

    expect(result.current.currentData).toEqual(mockUpdatedWireframe);

    act(() => {
      result.current.undo();
    });

    expect(result.current.currentData).toEqual(mockWireframe);
  });
});
