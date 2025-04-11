import { renderHook, act } from '@testing-library/react-hooks';
import { useWireframeHistory } from '../use-wireframe-history';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

// Mock localStorage for testing purposes
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = String(value);
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Replace any wireframe object creation with the proper structure
const testWireframe = {
  id: "test-id",
  title: "Test Wireframe",
  description: "Test Description",
  sections: [],
  colorScheme: {
    primary: "#3b82f6",
    secondary: "#10b981",
    accent: "#f59e0b",
    background: "#ffffff",
    text: "#000000"
  },
  typography: {
    headings: "Inter",
    body: "Inter"
  }
};

describe('useWireframeHistory', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with an empty history if no history exists in localStorage', () => {
    const { result } = renderHook(() => useWireframeHistory('test-project'));
    expect(result.current.history).toEqual([]);
    expect(result.current.currentIndex).toBe(-1);
  });

  it('should initialize with history from localStorage if it exists', () => {
    const initialHistory = [testWireframe];
    localStorage.setItem('wireframe-history-test-project', JSON.stringify(initialHistory));
    localStorage.setItem('wireframe-history-index-test-project', '0');

    const { result } = renderHook(() => useWireframeHistory('test-project'));
    expect(result.current.history).toEqual(initialHistory);
    expect(result.current.currentIndex).toBe(0);
  });

  it('should add a wireframe to history', () => {
    const { result } = renderHook(() => useWireframeHistory('test-project'));

    act(() => {
      result.current.addToHistory(testWireframe);
    });

    expect(result.current.history).toEqual([testWireframe]);
    expect(result.current.currentIndex).toBe(0);
    expect(localStorage.getItem('wireframe-history-test-project')).toBe(JSON.stringify([testWireframe]));
    expect(localStorage.getItem('wireframe-history-index-test-project')).toBe('0');
  });

  it('should go back in history', () => {
    const initialHistory = [testWireframe, { ...testWireframe, title: 'Updated Wireframe' }];
    localStorage.setItem('wireframe-history-test-project', JSON.stringify(initialHistory));
    localStorage.setItem('wireframe-history-index-test-project', '1');

    const { result } = renderHook(() => useWireframeHistory('test-project'));

    act(() => {
      result.current.goBack();
    });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.current).toEqual(initialHistory[0]);
    expect(localStorage.getItem('wireframe-history-index-test-project')).toBe('0');
  });

  it('should go forward in history', () => {
    const initialHistory = [testWireframe, { ...testWireframe, title: 'Updated Wireframe' }];
    localStorage.setItem('wireframe-history-test-project', JSON.stringify(initialHistory));
    localStorage.setItem('wireframe-history-index-test-project', '0');

    const { result } = renderHook(() => useWireframeHistory('test-project'));

    act(() => {
      result.current.goForward();
    });

    expect(result.current.currentIndex).toBe(1);
    expect(result.current.current).toEqual(initialHistory[1]);
    expect(localStorage.getItem('wireframe-history-index-test-project')).toBe('1');
  });

  it('should not go back beyond the start of history', () => {
    localStorage.setItem('wireframe-history-test-project', JSON.stringify([testWireframe]));
    localStorage.setItem('wireframe-history-index-test-project', '0');

    const { result } = renderHook(() => useWireframeHistory('test-project'));

    act(() => {
      result.current.goBack();
    });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.current).toEqual(testWireframe);
    expect(localStorage.getItem('wireframe-history-index-test-project')).toBe('0');
  });

  it('should not go forward beyond the end of history', () => {
    const initialHistory = [testWireframe, { ...testWireframe, title: 'Updated Wireframe' }];
    localStorage.setItem('wireframe-history-test-project', JSON.stringify(initialHistory));
    localStorage.setItem('wireframe-history-index-test-project', '1');

    const { result } = renderHook(() => useWireframeHistory('test-project'));

    act(() => {
      result.current.goForward();
    });

    expect(result.current.currentIndex).toBe(1);
    expect(result.current.current).toEqual(initialHistory[1]);
    expect(localStorage.getItem('wireframe-history-index-test-project')).toBe('1');
  });

  it('should update history when adding a new wireframe after going back', () => {
    const initialHistory = [testWireframe, { ...testWireframe, title: 'Updated Wireframe' }];
    localStorage.setItem('wireframe-history-test-project', JSON.stringify(initialHistory));
    localStorage.setItem('wireframe-history-index-test-project', '1');

    const { result } = renderHook(() => useWireframeHistory('test-project'));

    act(() => {
      result.current.goBack();
      result.current.addToHistory({ ...testWireframe, title: 'New Wireframe' });
    });

    expect(result.current.history).toEqual([testWireframe, { ...testWireframe, title: 'New Wireframe' }]);
    expect(result.current.currentIndex).toBe(1);
    expect(localStorage.getItem('wireframe-history-test-project')).toBe(JSON.stringify([testWireframe, { ...testWireframe, title: 'New Wireframe' }]));
    expect(localStorage.getItem('wireframe-history-index-test-project')).toBe('1');
  });

  it('should clear history', () => {
    const initialHistory = [testWireframe, { ...testWireframe, title: 'Updated Wireframe' }];
    localStorage.setItem('wireframe-history-test-project', JSON.stringify(initialHistory));
    localStorage.setItem('wireframe-history-index-test-project', '1');

    const { result } = renderHook(() => useWireframeHistory('test-project'));

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.history).toEqual([]);
    expect(result.current.currentIndex).toBe(-1);
    expect(localStorage.getItem('wireframe-history-test-project')).toBe(null);
    expect(localStorage.getItem('wireframe-history-index-test-project')).toBe(null);
  });
});
