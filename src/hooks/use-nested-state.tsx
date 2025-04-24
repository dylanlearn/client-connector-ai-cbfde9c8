
import { useState, useEffect, useContext, createContext } from 'react';

interface NestedStateContextValue<T> {
  state: T;
  setState: (value: T | ((prev: T) => T)) => void;
  overrideState: (path: string, value: any) => void;
  inheritState: (path: string) => any;
  resetState: (path?: string) => void;
  isOverridden: (path: string) => boolean;
}

const createNestedStateContext = <T extends Record<string, any>>(defaultState: T) => {
  return createContext<NestedStateContextValue<T> | null>(null);
};

/**
 * Creates a nested state provider that allows child components to inherit and override state
 */
export function createNestedStateProvider<T extends Record<string, any>>(
  defaultState: T,
  ContextObj: React.Context<NestedStateContextValue<T> | null>
) {
  return ({ children, initialState }: { children: React.ReactNode; initialState?: Partial<T> }) => {
    const parent = useContext(ContextObj);
    const [state, setLocalState] = useState<T>({ ...defaultState, ...initialState });
    const [overrides, setOverrides] = useState<Record<string, boolean>>({});

    // Inherit parent state on mount
    useEffect(() => {
      if (parent) {
        const inheritedState = { ...state };
        Object.keys(state).forEach(key => {
          if (!overrides[key]) {
            const typedKey = key as keyof T;
            inheritedState[typedKey] = parent.state[typedKey] !== undefined 
              ? parent.state[typedKey] 
              : state[typedKey];
          }
        });
        setLocalState(inheritedState);
      }
    // We only want this to run when parent state changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parent?.state]);

    const setState = (value: T | ((prev: T) => T)) => {
      if (typeof value === 'function') {
        setLocalState(prev => {
          const newState = (value as Function)(prev);
          return newState;
        });
      } else {
        setLocalState(value);
      }
    };

    const overrideState = (path: string, value: any) => {
      const pathParts = path.split('.');
      const key = pathParts[0];
      
      setLocalState(prev => {
        const newState = { ...prev } as Record<string, any>;
        let current = newState;
        
        // Navigate to the nested property
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          if (!current[part] || typeof current[part] !== 'object') {
            current[part] = {};
          }
          current = current[part];
        }
        
        // Set the value
        current[pathParts[pathParts.length - 1]] = value;
        return newState as T;
      });
      
      setOverrides(prev => ({
        ...prev,
        [key]: true
      }));
    };

    const inheritState = (path: string) => {
      if (!parent) return undefined;
      
      const pathParts = path.split('.');
      let value = parent.state as Record<string, any>;
      
      // Navigate to the nested property in parent state
      for (const part of pathParts) {
        if (value && typeof value === 'object' && part in value) {
          value = value[part];
        } else {
          return undefined;
        }
      }
      
      // Update local state with the inherited value
      overrideState(path, value);
      
      return value;
    };

    const resetState = (path?: string) => {
      if (path) {
        const pathParts = path.split('.');
        const key = pathParts[0];
        
        setLocalState(prev => {
          const newState = { ...prev } as Record<string, any>;
          let current = newState;
          
          // Navigate to the nested property
          for (let i = 0; i < pathParts.length - 1; i++) {
            if (!current[pathParts[i]]) return prev;
            current = current[pathParts[i]];
          }
          
          // Reset to default
          const defaultValue = pathParts.reduce((obj: any, part) => {
            return obj && typeof obj === 'object' && part in obj ? obj[part] : undefined;
          }, defaultState as any);
          
          current[pathParts[pathParts.length - 1]] = defaultValue;
          return newState as T;
        });
        
        setOverrides(prev => {
          const newOverrides = { ...prev };
          delete newOverrides[key];
          return newOverrides;
        });
      } else {
        // Reset entire state
        setLocalState({ ...defaultState });
        setOverrides({});
      }
    };

    const isOverridden = (path: string): boolean => {
      const key = path.split('.')[0];
      return !!overrides[key];
    };

    const value = {
      state,
      setState,
      overrideState,
      inheritState,
      resetState,
      isOverridden
    };

    return (
      <ContextObj.Provider value={value}>
        {children}
      </ContextObj.Provider>
    );
  };
}

/**
 * Custom hook to create and use nested state
 */
export function useNestedState<T extends Record<string, any>>(defaultState: T) {
  const NestedContext = createNestedStateContext<T>(defaultState);
  const NestedProvider = createNestedStateProvider<T>(defaultState, NestedContext);
  
  const useNestedStateContext = () => {
    const context = useContext(NestedContext);
    if (!context) {
      throw new Error('useNestedStateContext must be used within a NestedProvider');
    }
    return context;
  };
  
  return { NestedProvider, useNestedStateContext };
}

export default useNestedState;
