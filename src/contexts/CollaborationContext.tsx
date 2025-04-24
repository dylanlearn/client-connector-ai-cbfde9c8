
import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { nanoid } from 'nanoid';
import { CollaborationState, CollaborationAction, User, DocumentChange, UserPresence } from '@/types/collaboration';

// Initial state
const initialState: CollaborationState = {
  users: {},
  activeUsers: [],
  documentId: null,
  changes: [],
  pendingChanges: [],
  isConnected: false,
  error: null,
  lastSyncedVersion: 0,
};

// Reducer function
const collaborationReducer = (state: CollaborationState, action: CollaborationAction): CollaborationState => {
  switch (action.type) {
    case 'SET_DOCUMENT_ID':
      return {
        ...state,
        documentId: action.payload,
      };
    case 'USER_JOINED':
      return {
        ...state,
        users: {
          ...state.users,
          [action.payload.id]: action.payload,
        },
        activeUsers: [...state.activeUsers, action.payload.id],
      };
    case 'USER_LEFT':
      const { [action.payload]: removedUser, ...remainingUsers } = state.users;
      return {
        ...state,
        users: remainingUsers,
        activeUsers: state.activeUsers.filter((id) => id !== action.payload),
      };
    case 'UPDATE_USER_PRESENCE':
      return {
        ...state,
        users: {
          ...state.users,
          [action.payload.userId]: {
            ...state.users[action.payload.userId],
            presence: {
              ...state.users[action.payload.userId]?.presence,
              ...action.payload.presence,
            },
          },
        },
      };
    case 'ADD_CHANGE':
      return {
        ...state,
        pendingChanges: [...state.pendingChanges, action.payload],
      };
    case 'CHANGES_APPLIED':
      return {
        ...state,
        pendingChanges: state.pendingChanges.filter(
          (change) => !action.payload.includes(change.id)
        ),
      };
    case 'SET_CONNECTION_STATUS':
      return {
        ...state,
        isConnected: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'MERGE_REMOTE_CHANGES':
      return {
        ...state,
        changes: [...state.changes, ...action.payload],
      };
    default:
      return state;
  }
};

// Create context
interface CollaborationContextType {
  state: CollaborationState;
  setDocumentId: (documentId: string | null) => void;
  userJoined: (user: User) => void;
  userLeft: (userId: string) => void;
  updateUserPresence: (presence: Partial<UserPresence>) => void;
  addChange: (change: Omit<DocumentChange, 'id' | 'timestamp'>) => string;
  applyChanges: (changeIds: string[]) => void;
  setConnectionStatus: (isConnected: boolean) => void;
  setError: (error: string | null) => void;
  mergeRemoteChanges: (changes: DocumentChange[]) => void;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

// Provider component
export const CollaborationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(collaborationReducer, initialState);

  const setDocumentId = useCallback((documentId: string | null) => {
    dispatch({ type: 'SET_DOCUMENT_ID', payload: documentId });
  }, []);

  const userJoined = useCallback((user: User) => {
    dispatch({ type: 'USER_JOINED', payload: user });
  }, []);

  const userLeft = useCallback((userId: string) => {
    dispatch({ type: 'USER_LEFT', payload: userId });
  }, []);

  const updateUserPresence = useCallback((presence: Partial<UserPresence>) => {
    // Fix the payload structure to match what the reducer expects
    dispatch({
      type: 'UPDATE_USER_PRESENCE',
      payload: { 
        userId: 'current-user', 
        presence: presence 
      },
    });
  }, []);

  const addChange = useCallback((change: Omit<DocumentChange, 'id' | 'timestamp'>): string => {
    const id = nanoid();
    const fullChange: DocumentChange = {
      ...change,
      id,
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_CHANGE', payload: fullChange });
    return id;
  }, []);

  const applyChanges = useCallback((changes: string[]) => {
    dispatch({ type: 'CHANGES_APPLIED', payload: changes });
  }, []);

  const setConnectionStatus = useCallback((isConnected: boolean) => {
    dispatch({ type: 'SET_CONNECTION_STATUS', payload: isConnected });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const mergeRemoteChanges = useCallback((changes: DocumentChange[]) => {
    dispatch({ type: 'MERGE_REMOTE_CHANGES', payload: changes });
  }, []);

  const value = {
    state,
    setDocumentId,
    userJoined,
    userLeft,
    updateUserPresence,
    addChange,
    applyChanges,
    setConnectionStatus,
    setError,
    mergeRemoteChanges,
  };

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
};

// Hook for using the context
export const useCollaboration = (): CollaborationContextType => {
  const context = useContext(CollaborationContext);
  if (context === undefined) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
};
