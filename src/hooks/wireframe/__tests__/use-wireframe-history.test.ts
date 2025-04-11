import { renderHook, act } from '@testing-library/react-hooks';
import { describe, it, expect, beforeEach } from 'vitest';
import useWireframeHistory from '../use-wireframe-history';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

describe('useWireframeHistory hook', () => {
  const createMockWireframe = (id: string): WireframeData => ({
    id,
    title: `Wireframe ${id}`,
    description: `Description for wireframe ${id}`,
    sections: [],
    colorScheme: {
      primary: '#3182CE',
      secondary: '#805AD5',
      accent: '#ED8936',
      background: '#FFFFFF',
      text: '#1A202C'
    },
    typography: {
      headings: 'Inter',
      body: 'Inter'
    }
  });

  // Use the mock wireframe data instead of a string
  const initialWireframe = createMockWireframe('initial');
  
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

    // Use a proper wireframe update object instead of a string
    const update = { title: 'Updated Title' };
    
    act(() => {
      result.current.updateWireframe(update, 'update title');
    });
    
    expect(result.current.history.length).toBe(2);
    expect(result.current.historyIndex).toBe(1);
  });

  it('should undo to previous state', () => {
    const { result } = renderHook(() => useWireframeHistory(initialWireframe));
    
    const update = { title: 'Updated Title' };
    
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
    
    const update = { title: 'Updated Title' };
    
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
    
    const update = { title: 'Updated Title' };
    
    act(() => {
      result.current.updateWireframe(update, 'update title');
      result.current.clearHistory();
    });
    
    expect(result.current.history.length).toBe(1);
    expect(result.current.historyIndex).toBe(0);
  });

  it('should not go back beyond the initial state', () => {
    const { result } = renderHook(() => useWireframeHistory(initialWireframe));
    
    const update = { title: 'Updated Title' };
    
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
    
    const update = { title: 'Updated Title' };
    
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
    
    const update1 = { title: 'Updated Title 1' };
    const update2 = { title: 'Updated Title 2' };
    
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
    
    const update = { title: 'Updated Title' };
    
    act(() => {
      result.current.updateWireframe(update, 'update title');
      result.current.clearHistory();
    });
    
    expect(result.current.history.length).toBe(1);
    expect(result.current.historyIndex).toBe(0);
  });
});
