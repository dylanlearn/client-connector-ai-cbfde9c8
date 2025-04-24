
import React, { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import { CollaborationAction, CollaborationState, DocumentChange, User, UserPresence } from '@/types/collaboration';
import { nanoid } from 'nanoid';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

// Initial state for the collaboration context
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

// Reducer to handle collaboration state changes
const collaborationReducer = (state: CollaborationState, action: CollaborationAction): CollaborationState => {
  switch (action.type) {
    case 'SET_DOCUMENT_ID':
      return {
        ...state,
        documentId: action.payload
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
        pendingChanges: state.pendingChanges.filter(change => !action.payload.includes(change.id))
      };
    
    case 'SET_CONNECTION_STATUS':
      return {
        ...state,
        isConnected: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    
    case 'MERGE_REMOTE_CHANGES':
      // Here we would implement operational transforms to resolve conflicts
      // For now, we'll just append the changes
      return {
        ...state,
        changes: [...state.changes, ...action.payload]
      };
    
    default:
      return state;
  }
};

// Create the collaboration context
interface CollaborationContextType {
  state: CollaborationState;
  setDocumentId: (documentId: string | null) => void;
  addChange: (change: Omit<DocumentChange, 'id' | 'timestamp'>) => void;
  applyChanges: (changes: DocumentChange[]) => void;
  updateUserPresence: (presence: Partial<UserPresence>) => void;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

// Provider component
interface CollaborationProviderProps {
  children: React.ReactNode;
}

export const CollaborationProvider: React.FC<CollaborationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(collaborationReducer, initialState);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [currentUser, setCurrentUser] = useState<User>({
    id: nanoid(),
    name: `User_${Math.floor(Math.random() * 1000)}`,
    color: getRandomColor(),
    avatar: null,
    presence: {
      status: 'active',
      focusElement: null,
      cursorPosition: null,
      lastActive: new Date().toISOString()
    }
  });
  
  // Set up user and document
  useEffect(() => {
    // Add current user to the list of users
    dispatch({
      type: 'USER_JOINED',
      payload: currentUser
    });
    
    return () => {
      // Clean up user when component unmounts
      dispatch({
        type: 'USER_LEFT',
        payload: currentUser.id
      });
    };
  }, [currentUser]);
  
  // Handler for setting the current document ID
  const setDocumentId = useCallback((documentId: string | null) => {
    dispatch({ type: 'SET_DOCUMENT_ID', payload: documentId });
    
    if (documentId) {
      // When document ID changes, set up real-time connection
      setupRealtimeConnection(documentId);
    } else {
      // Clean up connection if document ID is null
      if (channel) {
        supabase.removeChannel(channel);
        setChannel(null);
      }
    }
  }, [channel]);
  
  // Set up real-time connection using Supabase
  const setupRealtimeConnection = useCallback((documentId: string) => {
    if (channel) {
      supabase.removeChannel(channel);
    }
    
    // Create a new channel
    const roomName = `document-${documentId}`;
    const newChannel = supabase.channel(roomName);
    
    // Set up presence tracking and subscribe to the channel
    newChannel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = newChannel.presenceState();
        console.log('Presence state updated:', presenceState);
        
        // Process presence state update
        Object.keys(presenceState).forEach(userId => {
          const userPresence = presenceState[userId][0];
          if (userPresence && userPresence.user) {
            const user = userPresence.user;
            if (userId !== currentUser.id) {
              dispatch({
                type: 'USER_JOINED',
                payload: {
                  id: userId,
                  name: user.name,
                  color: user.color,
                  avatar: user.avatar,
                  presence: user.presence
                }
              });
            }
          }
        });
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
        if (newPresences && newPresences[0]?.user && key !== currentUser.id) {
          const user = newPresences[0].user;
          dispatch({
            type: 'USER_JOINED',
            payload: {
              id: key,
              name: user.name,
              color: user.color,
              avatar: user.avatar,
              presence: user.presence
            }
          });
        }
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        console.log('User left:', key);
        if (key !== currentUser.id) {
          dispatch({
            type: 'USER_LEFT',
            payload: key
          });
        }
      })
      .on('broadcast', { event: 'document-change' }, payload => {
        console.log('Received document change:', payload);
        if (payload.payload && payload.sender !== currentUser.id) {
          // Process incoming document changes
          dispatch({
            type: 'MERGE_REMOTE_CHANGES',
            payload: [payload.payload]
          });
        }
      });
    
    // Track current user presence
    newChannel.track({
      user: currentUser
    });
    
    // Subscribe to the channel
    newChannel.subscribe((status) => {
      console.log('Subscription status:', status);
      dispatch({ 
        type: 'SET_CONNECTION_STATUS', 
        payload: status === 'SUBSCRIBED' 
      });
    });
    
    setChannel(newChannel);
    
  }, [currentUser]);
  
  // Handler for adding a document change
  const addChange = useCallback((changeData: Omit<DocumentChange, 'id' | 'timestamp'>) => {
    const change: DocumentChange = {
      ...changeData,
      id: nanoid(),
      timestamp: new Date().toISOString()
    };
    
    dispatch({ type: 'ADD_CHANGE', payload: change });
    
    // Broadcast the change to other users
    if (channel && state.isConnected) {
      channel.send({
        type: 'broadcast',
        event: 'document-change',
        payload: change,
        sender: currentUser.id
      });
    }
  }, [channel, state.isConnected, currentUser.id]);
  
  // Handler for applying changes
  const applyChanges = useCallback((changes: DocumentChange[]) => {
    // In a real implementation, we would apply the changes to the document
    // and resolve conflicts using operational transforms
    
    // For now, just mark the changes as applied
    if (changes.length > 0) {
      dispatch({
        type: 'CHANGES_APPLIED',
        payload: changes.map(change => change.id)
      });
    }
  }, []);
  
  // Handler for updating user presence
  const updateUserPresence = useCallback((presence: Partial<UserPresence>) => {
    const updatedPresence = {
      ...currentUser.presence,
      ...presence
    };
    
    // Update local state
    setCurrentUser(prev => ({
      ...prev,
      presence: updatedPresence
    }));
    
    dispatch({
      type: 'UPDATE_USER_PRESENCE',
      payload: { userId: currentUser.id, presence: updatedPresence }
    });
    
    // Update presence on the channel
    if (channel) {
      channel.track({
        user: {
          ...currentUser,
          presence: updatedPresence
        }
      });
    }
  }, [channel, currentUser]);
  
  return (
    <CollaborationContext.Provider
      value={{
        state,
        setDocumentId,
        addChange,
        applyChanges,
        updateUserPresence
      }}
    >
      {children}
    </CollaborationContext.Provider>
  );
};

// Helper function to generate random colors
function getRandomColor(): string {
  const colors = [
    '#FF5733', // Red
    '#33FF57', // Green
    '#3357FF', // Blue
    '#FF33A8', // Pink
    '#33A8FF', // Light Blue
    '#A833FF', // Purple
    '#FFD433', // Yellow
    '#33FFD4', // Cyan
    '#FF8C33', // Orange
    '#8CFF33'  // Lime
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Custom hook for accessing the collaboration context
export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
};

// Helper hook for handling collaborative state
export const useUser = () => {
  return nanoid(); // In a real app, this would be authenticated user ID
};
