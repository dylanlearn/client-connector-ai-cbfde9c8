
import React, { createContext, useContext, useReducer } from 'react';
import { CollaborationAction, CollaborationState, DocumentChange } from '@/types/collaboration';

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

function collaborationReducer(state: CollaborationState, action: CollaborationAction): CollaborationState {
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
      return {
        ...state,
        activeUsers: state.activeUsers.filter(id => id !== action.payload),
      };
    case 'UPDATE_USER_PRESENCE':
      if (!state.users[action.payload.userId]) return state;
      return {
        ...state,
        users: {
          ...state.users,
          [action.payload.userId]: {
            ...state.users[action.payload.userId],
            presence: {
              ...state.users[action.payload.userId].presence,
              ...action.payload.presence,
            },
          },
        },
      };
    case 'ADD_CHANGE':
      return {
        ...state,
        changes: [...state.changes, action.payload],
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
        lastSyncedVersion: action.payload.length > 0
          ? Math.max(...action.payload.map(c => c.version || 0))
          : state.lastSyncedVersion,
      };
    default:
      return state;
  }
}

type CollaborationContextType = {
  state: CollaborationState;
  dispatch: React.Dispatch<CollaborationAction>;
  addChange: (change: Omit<DocumentChange, 'id' | 'timestamp'>) => void;
  updatePresence: (presence: Partial<any>) => void;
  setDocumentId: (documentId: string | null) => void;
  updateUserPresence: (presence: Partial<any>) => void;
  applyChanges: (changes: DocumentChange[]) => void;
};

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

export const CollaborationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(collaborationReducer, initialState);

  const setDocumentId = (documentId: string | null) => {
    dispatch({ type: 'SET_DOCUMENT_ID', payload: documentId });
  };

  const addChange = (change: Omit<DocumentChange, 'id' | 'timestamp'>) => {
    const fullChange = {
      ...change,
      id: `local-${Date.now()}`,
      timestamp: new Date().toISOString(),
    } as DocumentChange;
    dispatch({ type: 'ADD_CHANGE', payload: fullChange });
  };

  const updatePresence = (presence: Partial<any>) => {
    // This is a placeholder that would be implemented for user-specific presence
  };

  const updateUserPresence = (presence: Partial<any>) => {
    if (!state.documentId) return;
    // This would update the user's presence in the document
    // Implementation would depend on the specific needs
  };

  const applyChanges = (changes: DocumentChange[]) => {
    dispatch({ type: 'MERGE_REMOTE_CHANGES', payload: changes });
  };

  return (
    <CollaborationContext.Provider value={{ 
      state, 
      dispatch, 
      addChange, 
      updatePresence, 
      setDocumentId, 
      updateUserPresence,
      applyChanges
    }}>
      {children}
    </CollaborationContext.Provider>
  );
};

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
};
