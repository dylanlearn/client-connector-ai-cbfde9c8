
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Annotation, AnnotationStatus, AnnotationType } from '@/types/annotations';
import { useUser } from '@/hooks/useUser';

// Define the state and actions
interface AnnotationState {
  annotations: Record<string, Annotation>;
  filteredType: AnnotationType | 'all';
  filteredStatus: AnnotationStatus | 'all';
  isCreating: boolean;
  activeAnnotationId: string | null;
  error: string | null;
}

type AnnotationAction =
  | { type: 'ADD_ANNOTATION'; payload: Annotation }
  | { type: 'UPDATE_ANNOTATION'; payload: Partial<Annotation> & { id: string } }
  | { type: 'DELETE_ANNOTATION'; payload: string }
  | { type: 'SET_FILTERED_TYPE'; payload: AnnotationType | 'all' }
  | { type: 'SET_FILTERED_STATUS'; payload: AnnotationStatus | 'all' }
  | { type: 'SET_CREATING'; payload: boolean }
  | { type: 'SET_ACTIVE_ANNOTATION'; payload: string | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_ANNOTATIONS'; payload: Annotation[] };

// Initial state
const initialState: AnnotationState = {
  annotations: {},
  filteredType: 'all',
  filteredStatus: 'all',
  isCreating: false,
  activeAnnotationId: null,
  error: null,
};

// Create context
interface AnnotationContextType {
  state: AnnotationState;
  addAnnotation: (annotationData: Omit<Annotation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  deleteAnnotation: (id: string) => void;
  setFilteredType: (type: AnnotationType | 'all') => void;
  setFilteredStatus: (status: AnnotationStatus | 'all') => void;
  setCreatingAnnotation: (creating: boolean) => void;
  setActiveAnnotation: (id: string | null) => void;
  getAnnotationsForElement: (elementId: string) => Annotation[];
  getThreadedAnnotations: (parentId?: string) => Annotation[];
}

const AnnotationContext = createContext<AnnotationContextType | undefined>(undefined);

// Reducer function
function annotationReducer(state: AnnotationState, action: AnnotationAction): AnnotationState {
  switch (action.type) {
    case 'ADD_ANNOTATION':
      return {
        ...state,
        annotations: {
          ...state.annotations,
          [action.payload.id]: action.payload,
        },
      };
    case 'UPDATE_ANNOTATION': {
      const { id, ...updates } = action.payload;
      const annotation = state.annotations[id];
      if (!annotation) return state;
      
      return {
        ...state,
        annotations: {
          ...state.annotations,
          [id]: {
            ...annotation,
            ...updates,
            updatedAt: new Date().toISOString(),
          },
        },
      };
    }
    case 'DELETE_ANNOTATION': {
      const { [action.payload]: _, ...remaining } = state.annotations;
      return {
        ...state,
        annotations: remaining,
      };
    }
    case 'SET_FILTERED_TYPE':
      return {
        ...state,
        filteredType: action.payload,
      };
    case 'SET_FILTERED_STATUS':
      return {
        ...state,
        filteredStatus: action.payload,
      };
    case 'SET_CREATING':
      return {
        ...state,
        isCreating: action.payload,
      };
    case 'SET_ACTIVE_ANNOTATION':
      return {
        ...state,
        activeAnnotationId: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'LOAD_ANNOTATIONS': {
      const annotationsMap = action.payload.reduce((acc, annotation) => {
        acc[annotation.id] = annotation;
        return acc;
      }, {} as Record<string, Annotation>);
      
      return {
        ...state,
        annotations: annotationsMap,
      };
    }
    default:
      return state;
  }
}

// Provider component
interface AnnotationProviderProps {
  children: ReactNode;
  documentId: string;
}

export const AnnotationProvider: React.FC<AnnotationProviderProps> = ({ children, documentId }) => {
  const [state, dispatch] = useReducer(annotationReducer, initialState);
  const userId = useUser();
  
  // Load annotations from localStorage for demo or API in real implementation
  useEffect(() => {
    const loadAnnotations = () => {
      try {
        const savedAnnotations = localStorage.getItem(`annotations_${documentId}`);
        if (savedAnnotations) {
          const parsed = JSON.parse(savedAnnotations) as Annotation[];
          dispatch({ type: 'LOAD_ANNOTATIONS', payload: parsed });
        }
      } catch (error) {
        console.error('Failed to load annotations:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load annotations' });
      }
    };
    
    loadAnnotations();
  }, [documentId]);
  
  // Save annotations to localStorage when they change
  useEffect(() => {
    const saveAnnotations = () => {
      try {
        const annotationsList = Object.values(state.annotations);
        localStorage.setItem(`annotations_${documentId}`, JSON.stringify(annotationsList));
      } catch (error) {
        console.error('Failed to save annotations:', error);
      }
    };
    
    saveAnnotations();
  }, [state.annotations, documentId]);
  
  // Functions for managing annotations
  const addAnnotation = (annotationData: Omit<Annotation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newAnnotation: Annotation = {
      ...annotationData,
      id: nanoid(),
      createdAt: now,
      updatedAt: now,
    };
    
    dispatch({ type: 'ADD_ANNOTATION', payload: newAnnotation });
  };
  
  const updateAnnotation = (id: string, updates: Partial<Annotation>) => {
    dispatch({ type: 'UPDATE_ANNOTATION', payload: { id, ...updates } });
  };
  
  const deleteAnnotation = (id: string) => {
    dispatch({ type: 'DELETE_ANNOTATION', payload: id });
  };
  
  const setFilteredType = (type: AnnotationType | 'all') => {
    dispatch({ type: 'SET_FILTERED_TYPE', payload: type });
  };
  
  const setFilteredStatus = (status: AnnotationStatus | 'all') => {
    dispatch({ type: 'SET_FILTERED_STATUS', payload: status });
  };
  
  const setCreatingAnnotation = (creating: boolean) => {
    dispatch({ type: 'SET_CREATING', payload: creating });
  };
  
  const setActiveAnnotation = (id: string | null) => {
    dispatch({ type: 'SET_ACTIVE_ANNOTATION', payload: id });
  };
  
  const getAnnotationsForElement = (elementId: string) => {
    return Object.values(state.annotations).filter(
      annotation => annotation.position.elementId === elementId
    );
  };
  
  const getThreadedAnnotations = (parentId?: string) => {
    return Object.values(state.annotations).filter(
      annotation => annotation.parentId === parentId
    );
  };
  
  const value = {
    state,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    setFilteredType,
    setFilteredStatus,
    setCreatingAnnotation,
    setActiveAnnotation,
    getAnnotationsForElement,
    getThreadedAnnotations,
  };
  
  return (
    <AnnotationContext.Provider value={value}>
      {children}
    </AnnotationContext.Provider>
  );
};

// Hook for using the annotation context
export const useAnnotations = () => {
  const context = useContext(AnnotationContext);
  if (context === undefined) {
    throw new Error('useAnnotations must be used within an AnnotationProvider');
  }
  return context;
};
