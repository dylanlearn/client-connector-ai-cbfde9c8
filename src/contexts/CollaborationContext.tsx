
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { 
  CollaborationState, 
  CollaborationAction, 
  User, 
  DocumentChange, 
  UserPresence 
} from '@/types/collaboration';
import { DocumentService } from '@/services/collaboration/documentService';
import { PresenceService } from '@/services/collaboration/presenceService';
import { useUser } from '@/hooks/useUser';

// Initial state for collaboration
const initialState: CollaborationState = {
  users: {},
  activeUsers: [],
  documentId: null,
  changes: [],
  pendingChanges: [],
  isConnected: false,
  error: null,
  lastSyncedVersion: 0
};

// Reducer function to handle state updates
function collaborationReducer(state: CollaborationState, action: CollaborationAction): CollaborationState {
  switch (action.type) {
    case 'SET_DOCUMENT_ID':
      return {
        ...state,
        documentId: action.payload,
        changes: [],
        pendingChanges: []
      };
    case 'USER_JOINED':
      return {
        ...state,
        users: {
          ...state.users,
          [action.payload.id]: action.payload
        },
        activeUsers: [...state.activeUsers, action.payload.id]
      };
    case 'USER_LEFT':
      return {
        ...state,
        activeUsers: state.activeUsers.filter((id) => id !== action.payload),
      };
    case 'UPDATE_USER_PRESENCE':
      // Get the current user data or create a new user object if it doesn't exist
      const currentUser = state.users[action.payload.userId] || {
        id: action.payload.userId,
        name: `User ${action.payload.userId.substring(0, 4)}`,
        color: `hsl(${Math.random() * 360}, 80%, 60%)`,
        avatar: null,
        presence: {
          status: 'active',
          focusElement: null,
          cursorPosition: null,
          lastActive: new Date().toISOString(),
        }
      };
      
      // Update the user with the new presence data, merging it with existing data
      return {
        ...state,
        users: {
          ...state.users,
          [action.payload.userId]: {
            ...currentUser,
            presence: {
              ...currentUser.presence,
              ...action.payload.presence,
            },
          },
        },
        // If not already in active users list, add them
        activeUsers: state.activeUsers.includes(action.payload.userId) 
          ? state.activeUsers 
          : [...state.activeUsers, action.payload.userId]
      };
    case 'ADD_CHANGE':
      return {
        ...state,
        pendingChanges: [...state.pendingChanges, action.payload],
      };
    case 'CHANGES_APPLIED':
      // Remove the applied changes from pendingChanges
      return {
        ...state,
        pendingChanges: state.pendingChanges.filter(
          (change) => !action.payload.includes(change.id)
        ),
      };
    case 'MERGE_REMOTE_CHANGES':
      return {
        ...state,
        changes: [...state.changes, ...action.payload],
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
    default:
      return state;
  }
}

// Create the context
const CollaborationContext = createContext<{
  state: CollaborationState;
  setDocumentId: (id: string | null) => void;
  addChange: (change: Omit<DocumentChange, 'id' | 'timestamp'>) => void;
  applyChanges: (changeIds: string[]) => void;
  updateUserPresence: (presence: Partial<UserPresence>) => void;
} | null>(null);

// Provider component
export const CollaborationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(collaborationReducer, initialState);
  const userId = useUser();

  // Set the document ID
  const setDocumentId = useCallback((id: string | null) => {
    dispatch({ type: 'SET_DOCUMENT_ID', payload: id });
  }, []);

  // Add a change to the pending changes
  const addChange = useCallback((change: Omit<DocumentChange, 'id' | 'timestamp'>) => {
    const completeChange: DocumentChange = {
      ...change,
      id: nanoid(),
      timestamp: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_CHANGE', payload: completeChange });
  }, []);

  // Mark changes as applied
  const applyChanges = useCallback((changeIds: string[]) => {
    dispatch({ type: 'CHANGES_APPLIED', payload: changeIds });
  }, []);

  // Update user presence
  const updateUserPresence = useCallback((presence: Partial<UserPresence>) => {
    dispatch({
      type: 'UPDATE_USER_PRESENCE',
      payload: { 
        userId, 
        presence 
      },
    });
  }, [userId]);

  // Set up document subscriptions when documentId changes
  useEffect(() => {
    if (!state.documentId) return;

    // Set connection status
    dispatch({ type: 'SET_CONNECTION_STATUS', payload: true });
    
    // Subscribe to document changes
    const unsubscribeChanges = DocumentService.subscribeToChanges(
      state.documentId,
      (changes) => {
        dispatch({ type: 'MERGE_REMOTE_CHANGES', payload: changes });
      }
    );
    
    // Subscribe to user presence
    const unsubscribePresence = PresenceService.subscribeToPresence(
      state.documentId,
      (users) => {
        // Update our local state with the latest user presence data
        Object.values(users).forEach(user => {
          dispatch({ type: 'USER_JOINED', payload: user });
        });
      }
    );
    
    // Initial fetch of active users
    PresenceService.getActiveUsers(state.documentId)
      .then(users => {
        Object.values(users).forEach(user => {
          dispatch({ type: 'USER_JOINED', payload: user });
        });
      })
      .catch(error => {
        console.error('Error fetching active users:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch active users' });
      });

    // Clean up subscriptions
    return () => {
      unsubscribeChanges();
      unsubscribePresence();
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: false });
    };
  }, [state.documentId]);

  // Sync pending changes with the server
  useEffect(() => {
    if (!state.documentId || state.pendingChanges.length === 0) return;
    
    const changeIdsToApply = state.pendingChanges.map(change => change.id);
    
    // Save changes to the server
    DocumentService.saveChanges(state.documentId, state.pendingChanges)
      .then(() => {
        // Mark changes as applied
        applyChanges(changeIdsToApply);
      })
      .catch(error => {
        console.error('Error saving changes:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to save changes' });
      });
  }, [state.documentId, state.pendingChanges, applyChanges]);

  // Update presence to the server when it changes locally
  useEffect(() => {
    const currentUser = state.users[userId];
    if (!state.documentId || !currentUser) return;

    // Update presence on the server
    PresenceService.updatePresence(
      state.documentId,
      userId,
      currentUser.presence
    ).catch(error => {
      console.error('Error updating presence:', error);
    });
  }, [state.documentId, state.users, userId]);

  return (
    <CollaborationContext.Provider
      value={{
        state,
        setDocumentId,
        addChange,
        applyChanges,
        updateUserPresence,
      }}
    >
      {children}
    </CollaborationContext.Provider>
  );
};

// Custom hook for using the collaboration context
export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
};
