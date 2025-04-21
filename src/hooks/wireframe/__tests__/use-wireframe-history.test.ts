import { renderHook, act } from '@testing-library/react-hooks';
import { vi } from 'vitest';
import { useWireframeHistory } from "../use-wireframe-history";
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

// Helper function to create a complete mock WireframeData
const createMockWireframe = (overrides: Partial<WireframeData> = {}): WireframeData => ({
  id: overrides.id || 'test-id',
  title: overrides.title || 'Test Wireframe',
  description: overrides.description || 'Test description',
  sections: overrides.sections || [],
  colorScheme: overrides.colorScheme || {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f59e0b',
    background: '#ffffff',
    text: '#000000'
  },
  typography: overrides.typography || {
    headings: 'sans-serif',
    body: 'sans-serif'
  }
});

describe('useWireframeHistory hook', () => {
  // Use the createMockWireframe function in all test cases
  const initialWireframe = createMockWireframe();
  
  beforeEach(() => {
    // Reset any global state or mocks
  });

  it('should initialize with initial wireframe', () => {
    const { result } = renderHook(() => useWireframeHistory(initialWireframe));
    expect(result.current.history.length).toBe(1);
    expect(result.current.historyIndex).toBe(0);
  });

  it('should update wireframe data', () => {
    const { result } = renderHook(() => useWireframeHistory(initialWireframe));

    // Use createMockWireframe to create a valid update
    const update = createMockWireframe({ title: 'Updated Title' });
    
    act(() => {
      result.current.updateWireframe(update, 'update title');
    });
    
    expect(result.current.history.length).toBe(2);
    expect(result.current.historyIndex).toBe(1);
  });

  it('should undo to previous state', () => {
    const { result } = renderHook(() => useWireframeHistory(initialWireframe));
    
    const update = createMockWireframe({ title: 'Updated Title' });
    
    act(() => {
      result.current.updateWireframe(update, 'update title');
      result.current.goBack();
    });
    
    expect(result.current.history.length).toBe(2);
    expect(result.current.historyIndex).toBe(0);
    expect(result.current.currentData.title).toBe(initialWireframe.title);
  });

  it('should redo to next state', () => {
    const { result } = renderHook(() => useWireframeHistory(initialWireframe));
    
    const update = createMockWireframe({ title: 'Updated Title' });
    
    act(() => {
      result.current.updateWireframe(update, 'update title');
      result.current.goBack();
      result.current.goForward();
    });
    
    expect(result.current.history.length).toBe(2);
    expect(result.current.historyIndex).toBe(1);
    expect(result.current.currentData.title).toBe(update.title);
  });

  it('should clear history', () => {
    const { result } = renderHook(() => useWireframeHistory(initialWireframe));
    
    const update = createMockWireframe({ title: 'Updated Title' });
    
    act(() => {
      result.current.updateWireframe(update, 'update title');
      result.current.clearHistory();
    });
    
    expect(result.current.history.length).toBe(1);
    expect(result.current.historyIndex).toBe(0);
  });

  it('should not go back beyond the initial state', () => {
    const { result } = renderHook(() => useWireframeHistory(initialWireframe));
    
    const update = createMockWireframe({ title: 'Updated Title' });
    
    act(() => {
      result.current.updateWireframe(update, 'update title');
      result.current.goBack();
      result.current.goBack();
    });
    
    expect(result.current.history.length).toBe(2);
    expect(result.current.historyIndex).toBe(0);
    expect(result.current.currentData.title).toBe(initialWireframe.title);
  });

  it('should not go forward beyond the latest state', () => {
    const { result } = renderHook(() => useWireframeHistory(initialWireframe));
    
    const update = createMockWireframe({ title: 'Updated Title' });
    
    act(() => {
      result.current.updateWireframe(update, 'update title');
      result.current.goForward();
    });
    
    expect(result.current.history.length).toBe(2);
    expect(result.current.historyIndex).toBe(1);
    expect(result.current.currentData.title).toBe(update.title);
  });

  it('should add to history when going back and updating', () => {
    const { result } = renderHook(() => useWireframeHistory(initialWireframe));
    
    const update1 = createMockWireframe({ title: 'Updated Title 1' });
    const update2 = createMockWireframe({ title: 'Updated Title 2' });
    
    act(() => {
      result.current.updateWireframe(update1, 'update title 1');
      result.current.goBack();
      result.current.updateWireframe(update2, 'update title 2');
    });
    
    expect(result.current.history.length).toBe(2);
    expect(result.current.historyIndex).toBe(1);
    expect(result.current.currentData.title).toBe(update2.title);
  });

  it('should clear history', () => {
    const { result } = renderHook(() => useWireframeHistory(initialWireframe));
    
    const update = createMockWireframe({ title: 'Updated Title' });
    
    act(() => {
      result.current.updateWireframe(update, 'update title');
      result.current.clearHistory();
    });
    
    expect(result.current.history.length).toBe(1);
    expect(result.current.historyIndex).toBe(0);
  });
});
