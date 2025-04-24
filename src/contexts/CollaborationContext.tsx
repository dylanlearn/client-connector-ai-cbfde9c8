import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { nanoid } from 'nanoid';
import { 
  CollaborationAction, 
  CollaborationState, 
  DocumentChange, 
  User, 
  CursorPosition,
  UserPresence
} from '@/types/collaboration';

// Initial state for the collaboration context
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

// Actions for the collaboration reducer
const collaborationReducer = (state: CollaborationState, action: CollaborationAction): CollaborationState => {
  switch (action.type) {
    case 'SET_DOCUMENT_ID':
      return { ...state, documentId: action.payload };
    
    case 'USER_JOINED':
      return { 
        ...state, 
        users: { 
          ...state.users, 
          [action.payload.id]: action.payload 
        },
        activeUsers: [...state.activeUsers, action.payload.id].filter((id, index, array) => 
          array.indexOf(id) === index
        )
      };
    
    case 'USER_LEFT':
      const updatedUsers = { ...state.users };
      delete updatedUsers[action.payload];
      return { 
        ...state, 
        users: updatedUsers,
        activeUsers: state.activeUsers.filter(id => id !== action.payload)
      };
    
    case 'UPDATE_USER_PRESENCE':
      return { 
        ...state, 
        users: { 
          ...state.users, 
          [action.payload.userId]: { 
            ...state.users[action.payload.userId],
            presence: action.payload.presence
          } 
        }
      };
    
    case 'ADD_CHANGE':
      return { 
        ...state, 
        changes: [...state.changes, action.payload],
        pendingChanges: [...state.pendingChanges, action.payload]
      };
    
    case 'CHANGES_APPLIED':
      return { 
        ...state, 
        pendingChanges: state.pendingChanges.filter(
          change => !action.payload.includes(change.id)
        ),
        lastSyncedVersion: state.lastSyncedVersion + action.payload.length
      };
    
    case 'SET_CONNECTION_STATUS':
      return { ...state, isConnected: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
      
    case 'MERGE_REMOTE_CHANGES':
      // Apply operational transform to merge remote changes
      const mergedChanges = [...state.changes];
      action.payload.forEach(remoteChange => {
        // Check if we already have this change
        if (!mergedChanges.find(c => c.id === remoteChange.id)) {
          mergedChanges.push(remoteChange);
        }
      });
      
      return {
        ...state,
        changes: mergedChanges,
        lastSyncedVersion: Math.max(
          state.lastSyncedVersion, 
          action.payload.reduce((max, change) => 
            Math.max(max, change.version || 0), 
            state.lastSyncedVersion
          )
        )
      };
      
    default:
      return state;
  }
};

// Create the context
export const CollaborationContext = createContext<{
  state: CollaborationState;
  dispatch: React.Dispatch<CollaborationAction>;
  initDocument: (documentId: string) => void;
  addChange: (change: Omit<DocumentChange, 'id' | 'timestamp'>) => void;
  updateCursorPosition: (position: CursorPosition) => void;
  updateUserPresence: (presence: Partial<UserPresence>) => void;
  leaveDocument: () => void;
}>({
  state: initialState,
  dispatch: () => null,
  initDocument: () => null,
  addChange: () => null,
  updateCursorPosition: () => null,
  updateUserPresence: () => null,
  leaveDocument: () => null,
});

export const CollaborationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(collaborationReducer, initialState);
  const { user } = useAuth();

  // Initialize document collaboration
  const initDocument = async (documentId: string) => {
    if (!user) return;
    
    dispatch({ type: 'SET_DOCUMENT_ID', payload: documentId });
    
    try {
      // Subscribe to the document channel
      const channel = supabase.channel(`document:${documentId}`)
        
        // Handle presence updates
        .on('presence', { event: 'sync' }, () => {
          const presenceState = channel.presenceState();
          console.log('Presence sync:', presenceState);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('User joined:', key, newPresences);
          newPresences.forEach((presence: any) => {
            if (presence.user.id !== user.id) {
              dispatch({ 
                type: 'USER_JOINED', 
                payload: presence.user 
              });
            }
          });
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('User left:', key, leftPresences);
          leftPresences.forEach((presence: any) => {
            dispatch({ 
              type: 'USER_LEFT', 
              payload: presence.user.id 
            });
          });
        })
        
        // Handle document changes
        .on('broadcast', { event: 'document_change' }, (payload) => {
          console.log('Document change received:', payload);
          
          const changes: DocumentChange[] = payload.payload.changes;
          dispatch({ 
            type: 'MERGE_REMOTE_CHANGES', 
            payload: changes 
          });
        })
        
        // Handle sync confirmation
        .on('broadcast', { event: 'sync_confirm' }, (payload) => {
          console.log('Sync confirmed:', payload);
          
          const confirmedChangeIds: string[] = payload.payload.changeIds;
          dispatch({ 
            type: 'CHANGES_APPLIED', 
            payload: confirmedChangeIds 
          });
        })
        
        .subscribe(status => {
          if (status === 'SUBSCRIBED') {
            // Add self to presence
            const userData: User = {
              id: user.id,
              name: user.email?.split('@')[0] || 'Anonymous',
              color: getRandomColor(),
              avatar: user.avatar_url || null,
              presence: {
                status: 'active',
                focusElement: null,
                cursorPosition: null,
                lastActive: new Date().toISOString()
              }
            };
            
            channel.track({
              user: userData,
              online_at: new Date().toISOString()
            });
            
            dispatch({ type: 'USER_JOINED', payload: userData });
            dispatch({ type: 'SET_CONNECTION_STATUS', payload: true });
          } else {
            dispatch({ type: 'SET_CONNECTION_STATUS', payload: false });
          }
        });
        
      // Fetch current document data
      const { data: documentData, error: docError } = await supabase
        .from('collaboration_documents')
        .select('*')
        .eq('id', documentId)
        .single();
        
      if (docError) {
        throw new Error(docError.message);
      }
      
      // Fetch existing changes
      const { data: changesData, error: changesError } = await supabase
        .from('collaboration_changes')
        .select('*')
        .eq('document_id', documentId)
        .order('version', { ascending: true });
        
      if (changesError) {
        throw new Error(changesError.message);
      }
      
      if (changesData) {
        dispatch({ 
          type: 'MERGE_REMOTE_CHANGES', 
          payload: changesData.map(c => ({
            id: c.id,
            userId: c.user_id,
            documentId: c.document_id,
            operation: c.operation,
            path: c.path,
            value: c.value,
            timestamp: c.created_at,
            version: c.version
          })) 
        });
      }
      
      return () => {
        channel.unsubscribe();
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: false });
      };
    } catch (error: any) {
      console.error('Error initializing document:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  // Leave document collaboration
  const leaveDocument = async () => {
    if (!state.documentId) return;
    
    // Cleanup and unsubscribe
    supabase.removeChannel(`document:${state.documentId}`);
    dispatch({ type: 'SET_DOCUMENT_ID', payload: null });
    dispatch({ type: 'SET_CONNECTION_STATUS', payload: false });
  };

  // Add a change to the document
  const addChange = async (change: Omit<DocumentChange, 'id' | 'timestamp'>) => {
    if (!user || !state.documentId || !state.isConnected) return;
    
    const timestamp = new Date().toISOString();
    const id = nanoid();
    const version = state.lastSyncedVersion + 1;
    
    const fullChange: DocumentChange = {
      ...change,
      id,
      timestamp,
      version,
      userId: user.id,
      documentId: state.documentId
    };
    
    dispatch({ type: 'ADD_CHANGE', payload: fullChange });
    
    // Send change to server
    const { error } = await supabase
      .from('collaboration_changes')
      .insert({
        id,
        user_id: user.id,
        document_id: state.documentId,
        operation: change.operation,
        path: change.path,
        value: change.value,
        version,
        created_at: timestamp
      });
      
    if (error) {
      console.error('Error sending change:', error);
      return;
    }
    
    // Broadcast to other users
    const channel = supabase.channel(`document:${state.documentId}`);
    channel.send({
      type: 'broadcast',
      event: 'document_change',
      payload: { changes: [fullChange] }
    });
  };

  // Update cursor position
  const updateCursorPosition = async (position: CursorPosition) => {
    if (!user || !state.documentId || !state.isConnected) return;
    
    const presence: Partial<UserPresence> = {
      cursorPosition: position,
      lastActive: new Date().toISOString()
    };
    
    updateUserPresence(presence);
  };

  // Update user presence
  const updateUserPresence = async (presence: Partial<UserPresence>) => {
    if (!user || !state.documentId || !state.isConnected) return;
    
    const channel = supabase.channel(`document:${state.documentId}`);
    const currentUser = state.users[user.id];
    
    if (!currentUser) return;
    
    const updatedPresence: UserPresence = {
      ...currentUser.presence,
      ...presence,
      lastActive: new Date().toISOString()
    };
    
    dispatch({
      type: 'UPDATE_USER_PRESENCE',
      payload: {
        userId: user.id,
        presence: updatedPresence
      }
    });
    
    // Update presence in channel
    channel.track({
      user: {
        ...currentUser,
        presence: updatedPresence
      },
      online_at: new Date().toISOString()
    });
  };

  // Keep presence alive with heartbeat
  useEffect(() => {
    if (!state.isConnected || !state.documentId) return;
    
    const heartbeatInterval = setInterval(() => {
      updateUserPresence({
        lastActive: new Date().toISOString()
      });
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(heartbeatInterval);
  }, [state.isConnected, state.documentId]);

  return (
    <CollaborationContext.Provider
      value={{
        state,
        dispatch,
        initDocument,
        addChange,
        updateCursorPosition,
        updateUserPresence,
        leaveDocument
      }}
    >
      {children}
    </CollaborationContext.Provider>
  );
};

// Helper to generate a random color for users
function getRandomColor(): string {
  const colors = [
    '#FF5733', '#33FF57', '#3357FF', '#F033FF', '#FF33A8',
    '#33FFF6', '#FFD133', '#9E33FF', '#FF3352', '#33FFAC'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Hook for using the collaboration context
export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
};
