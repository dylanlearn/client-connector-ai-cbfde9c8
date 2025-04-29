
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  CollaborationState,
  CollaborationAction,
  User,
  DocumentChange
} from '@/types/collaboration';

// Initial state for collaboration context
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

// Reducer for handling collaboration state changes
function collaborationReducer(state: CollaborationState, action: CollaborationAction): CollaborationState {
  switch (action.type) {
    case 'SET_DOCUMENT_ID':
      return { ...state, documentId: action.payload };
    
    case 'USER_JOINED':
      return {
        ...state,
        users: { ...state.users, [action.payload.id]: action.payload },
        activeUsers: [...state.activeUsers, action.payload.id]
      };
    
    case 'USER_LEFT':
      return {
        ...state,
        activeUsers: state.activeUsers.filter(id => id !== action.payload)
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
              ...action.payload.presence
            }
          }
        }
      };
    
    case 'ADD_CHANGE':
      return {
        ...state,
        pendingChanges: [...state.pendingChanges, action.payload]
      };
    
    case 'CHANGES_APPLIED':
      return {
        ...state,
        pendingChanges: state.pendingChanges.filter(
          change => !action.payload.includes(change.id)
        )
      };
    
    case 'SET_CONNECTION_STATUS':
      return { ...state, isConnected: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'MERGE_REMOTE_CHANGES':
      return {
        ...state,
        changes: [...state.changes, ...action.payload],
        lastSyncedVersion: action.payload.length
          ? Math.max(...action.payload.map(c => c.version || 0), state.lastSyncedVersion)
          : state.lastSyncedVersion
      };
    
    default:
      return state;
  }
}

// Create the collaboration context
const CollaborationContext = createContext<{
  state: CollaborationState;
  dispatch: React.Dispatch<CollaborationAction>;
  addChange: (change: Omit<DocumentChange, 'id' | 'timestamp'>) => void;
  updatePresence: (presence: Partial<User['presence']>) => void;
}>({
  state: initialState,
  dispatch: () => {},
  addChange: () => {},
  updatePresence: () => {}
});

// Provider component
export const CollaborationProvider: React.FC<{
  children: React.ReactNode;
  documentId?: string;
  userId?: string;
}> = ({ children, documentId, userId }) => {
  const [state, dispatch] = useReducer(collaborationReducer, initialState);

  // Initialize document and set up subscriptions
  useEffect(() => {
    if (!documentId) return;
    
    dispatch({ type: 'SET_DOCUMENT_ID', payload: documentId });
    
    // Initial fetch of active users
    const fetchActiveUsers = async () => {
      try {
        const { data: presenceData } = await supabase
          .from('user_presence')
          .select('*')
          .eq('document_id', documentId);
        
        if (presenceData) {
          // Convert to our user format and dispatch user joined events
          presenceData.forEach(item => {
            const user: User = {
              id: item.user_id,
              name: `User ${item.user_id.substring(0, 4)}`,
              color: `hsl(${Math.random() * 360}, 80%, 60%)`,
              avatar: null,
              presence: {
                status: item.status as any,
                focusElement: item.focus_element,
                cursorPosition: item.cursor_position as any,
                lastActive: item.last_active
              }
            };
            
            dispatch({ type: 'USER_JOINED', payload: user });
          });
        }
        
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: true });
      } catch (error) {
        console.error("Error fetching active users:", error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch active users' });
      }
    };
    
    // Fetch document changes
    const fetchChanges = async () => {
      try {
        const { data: changesData } = await supabase
          .from('document_changes')
          .select('*')
          .eq('document_id', documentId)
          .gt('version', state.lastSyncedVersion)
          .order('timestamp', { ascending: true });
        
        if (changesData && changesData.length > 0) {
          const formattedChanges: DocumentChange[] = changesData.map(change => ({
            id: change.id,
            documentId: change.document_id,
            userId: change.user_id,
            operation: change.operation as any,
            path: change.path,
            value: change.value,
            timestamp: change.timestamp,
            version: change.version
          }));
          
          dispatch({ type: 'MERGE_REMOTE_CHANGES', payload: formattedChanges });
        }
      } catch (error) {
        console.error("Error fetching document changes:", error);
      }
    };
    
    // Set up realtime subscriptions
    const presenceChannel = supabase
      .channel(`presence-${documentId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_presence',
        filter: `document_id=eq.${documentId}`
      }, payload => {
        // Handle presence changes
        fetchActiveUsers();
      })
      .subscribe();
    
    const changesChannel = supabase
      .channel(`changes-${documentId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'document_changes',
        filter: `document_id=eq.${documentId}`
      }, payload => {
        // Handle new document changes
        fetchChanges();
      })
      .subscribe();
    
    // Register current user presence
    const registerPresence = async () => {
      if (!userId) return;
      
      try {
        await supabase
          .from('user_presence')
          .upsert({
            user_id: userId,
            document_id: documentId,
            status: 'active',
            last_active: new Date().toISOString()
          });
      } catch (error) {
        console.error("Error registering user presence:", error);
      }
    };
    
    fetchActiveUsers();
    fetchChanges();
    registerPresence();
    
    // Set up periodic presence updates
    const presenceInterval = setInterval(registerPresence, 30000);
    
    // Cleanup
    return () => {
      clearInterval(presenceInterval);
      supabase.removeChannel(presenceChannel);
      supabase.removeChannel(changesChannel);
    };
  }, [documentId, userId, state.lastSyncedVersion]);
  
  // Add a document change
  const addChange = async (change: Omit<DocumentChange, 'id' | 'timestamp'>) => {
    if (!state.documentId) return;
    
    try {
      // Generate a temporary ID for optimistic updates
      const tempId = Date.now().toString();
      const fullChange: DocumentChange = {
        ...change,
        id: tempId,
        timestamp: new Date().toISOString()
      };
      
      // Add to pending changes for optimistic UI updates
      dispatch({ type: 'ADD_CHANGE', payload: fullChange });
      
      // Save to database
      const { data, error } = await supabase
        .from('document_changes')
        .insert({
          document_id: change.documentId,
          user_id: change.userId,
          operation: change.operation,
          path: change.path,
          value: change.value,
          version: state.lastSyncedVersion + 1
        });
      
      if (error) throw error;
      
      // Mark change as applied
      dispatch({ type: 'CHANGES_APPLIED', payload: [tempId] });
    } catch (error) {
      console.error("Error adding document change:", error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save document change' });
    }
  };
  
  // Update user presence
  const updatePresence = async (presence: Partial<User['presence']>) => {
    if (!state.documentId || !userId) return;
    
    try {
      await supabase
        .from('user_presence')
        .upsert({
          user_id: userId,
          document_id: state.documentId,
          status: presence.status || 'active',
          focus_element: presence.focusElement,
          cursor_position: presence.cursorPosition,
          last_active: new Date().toISOString()
        });
      
      // Update local state
      dispatch({
        type: 'UPDATE_USER_PRESENCE',
        payload: { userId, presence }
      });
    } catch (error) {
      console.error("Error updating presence:", error);
    }
  };
  
  const contextValue = {
    state,
    dispatch,
    addChange,
    updatePresence
  };
  
  return (
    <CollaborationContext.Provider value={contextValue}>
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
