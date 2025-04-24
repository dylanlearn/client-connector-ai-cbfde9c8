
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { 
  CollaborationState, 
  User, 
  DocumentChange, 
  UserPresence,
  CollaborationAction 
} from '@/types/collaboration';
import { nanoid } from 'nanoid';
import { supabase } from "@/integrations/supabase/client";

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

// Reducer to handle collaboration actions
const collaborationReducer = (state: CollaborationState, action: CollaborationAction): CollaborationState => {
  switch (action.type) {
    case 'SET_DOCUMENT_ID':
      return { ...state, documentId: action.payload };
    
    case 'USER_JOINED': {
      const newUser = action.payload;
      return {
        ...state,
        users: { ...state.users, [newUser.id]: newUser },
        activeUsers: [...state.activeUsers, newUser.id]
      };
    }
    
    case 'USER_LEFT': {
      const userId = action.payload;
      const usersCopy = { ...state.users };
      if (usersCopy[userId]) {
        usersCopy[userId] = { ...usersCopy[userId], presence: { ...usersCopy[userId].presence, status: 'offline' } };
      }
      
      return {
        ...state,
        users: usersCopy,
        activeUsers: state.activeUsers.filter(id => id !== userId)
      };
    }
    
    case 'UPDATE_USER_PRESENCE': {
      const { userId, presence } = action.payload;
      if (!state.users[userId]) {
        return state;
      }
      
      return {
        ...state,
        users: {
          ...state.users,
          [userId]: {
            ...state.users[userId],
            presence: {
              ...state.users[userId].presence,
              ...presence
            }
          }
        }
      };
    }
    
    case 'ADD_CHANGE': {
      const change = action.payload;
      
      // In a real app, we would validate and potentially transform the change
      return {
        ...state,
        // Fixed: ensure we only add DocumentChange objects, not strings
        changes: [...state.changes, change as DocumentChange],
        pendingChanges: [...state.pendingChanges, change as DocumentChange]
      };
    }
    
    case 'CHANGES_APPLIED': {
      // Fixed: handle array of DocumentChange IDs properly
      const appliedChangeIds = action.payload;
      return {
        ...state,
        pendingChanges: state.pendingChanges.filter(change => !appliedChangeIds.includes(change.id))
      };
    }
    
    case 'SET_CONNECTION_STATUS':
      return { ...state, isConnected: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'MERGE_REMOTE_CHANGES':
      return { ...state, changes: [...state.changes, ...action.payload] };
    
    default:
      return state;
  }
};

// Create the context
const CollaborationContext = createContext<{
  state: CollaborationState;
  setDocumentId: (documentId: string | null) => void;
  addChange: (change: Omit<DocumentChange, 'id' | 'timestamp'>) => void;
  applyChanges: (changes: DocumentChange[]) => void;
  updateUserPresence: (presence: Partial<UserPresence>) => void;
} | undefined>(undefined);

// Collaboration provider component
export const CollaborationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(collaborationReducer, initialState);
  
  // Set up Supabase realtime channel for the collaborative document
  useEffect(() => {
    if (!state.documentId) return;
    
    // Create a random username for this demo
    const demoUser: User = {
      id: nanoid(),
      name: `User_${Math.floor(Math.random() * 1000)}`,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      avatar: null,
      presence: {
        status: 'active',
        focusElement: null,
        cursorPosition: null,
        lastActive: new Date().toISOString()
      }
    };
    
    // Save user to local state
    dispatch({ type: 'USER_JOINED', payload: demoUser });
    
    // Set up a channel for this document
    const channelName = `document:${state.documentId}`;
    
    // Create and subscribe to the channel
    const channel = supabase.channel(channelName, {
      config: {
        presence: {
          key: demoUser.id,
        },
      },
    });
    
    // Set up presence handlers
    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        
        // Process current users from presence state
        Object.entries(presenceState).forEach(([userId, presenceArr]) => {
          // Fixed: Don't try to access 'user' property that doesn't exist
          // Instead, use the userId directly
          if (userId !== demoUser.id) {
            dispatch({ 
              type: 'USER_JOINED', 
              payload: {
                id: userId,
                name: `User_${userId.substring(0, 4)}`,
                color: `hsl(${parseInt(userId.substring(0, 4), 16) % 360}, 70%, 60%)`,
                avatar: null,
                presence: {
                  status: 'active',
                  focusElement: null,
                  cursorPosition: null,
                  lastActive: new Date().toISOString()
                }
              } 
            });
          }
        });
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        // Fixed: Don't try to access 'user' property that doesn't exist
        if (key !== demoUser.id) {
          console.log('User joined:', key);
          // Handle new user joined event
          // In a real app, we would get user info from a database
          // For this demo, we'll create a random user
          
          dispatch({ 
            type: 'USER_JOINED', 
            payload: {
              id: key,
              name: `User_${key.substring(0, 4)}`,
              color: `hsl(${parseInt(key.substring(0, 4), 16) % 360}, 70%, 60%)`,
              avatar: null,
              presence: {
                status: 'active',
                focusElement: null,
                cursorPosition: null,
                lastActive: new Date().toISOString()
              }
            } 
          });
        }
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        if (key !== demoUser.id) {
          console.log('User left:', key);
          dispatch({ type: 'USER_LEFT', payload: key });
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Broadcast presence when successfully connected
          await channel.track({
            user_id: demoUser.id,
            presence: {
              status: 'active',
              focusElement: null,
              cursorPosition: null,
              lastActive: new Date().toISOString()
            }
          });
          
          dispatch({ type: 'SET_CONNECTION_STATUS', payload: true });
          
          // Simulate some users already in the document
          simulateUsers(dispatch);
        }
      });
    
    // Clean up the channel on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [state.documentId]);
  
  // Set document ID
  const setDocumentId = useCallback((documentId: string | null) => {
    dispatch({ type: 'SET_DOCUMENT_ID', payload: documentId });
  }, []);
  
  // Add a change to the document
  const addChange = useCallback((change: Omit<DocumentChange, 'id' | 'timestamp'>) => {
    const completeChange: DocumentChange = {
      ...change,
      id: nanoid(),
      timestamp: new Date().toISOString(),
      version: state.lastSyncedVersion + 1
    };
    
    dispatch({ type: 'ADD_CHANGE', payload: completeChange });
    
    // In a real app, we would send the change to the server here
    // For this demo, we'll simulate it locally
  }, [state.lastSyncedVersion]);
  
  // Apply changes to the document
  const applyChanges = useCallback((changes: DocumentChange[]) => {
    // In a real app, we would apply operational transforms here
    // For now, we'll just mark them as applied
    if (changes.length > 0) {
      const changeIds = changes.map(change => change.id);
      dispatch({ type: 'CHANGES_APPLIED', payload: changeIds });
    }
  }, []);
  
  // Update user presence
  const updateUserPresence = useCallback((partialPresence: Partial<UserPresence>) => {
    const userId = Object.keys(state.users).find(
      key => state.users[key].id === state.users[state.activeUsers[0]]?.id
    );
    
    if (!userId || !state.users[userId]) return;
    
    // Get the current presence and merge with the partial update
    const currentPresence = state.users[userId].presence;
    const updatedPresence: UserPresence = {
      ...currentPresence,
      ...partialPresence,
    };
    
    // Make sure all required fields are present
    if (!updatedPresence.status) updatedPresence.status = currentPresence.status;
    if (!updatedPresence.focusElement) updatedPresence.focusElement = currentPresence.focusElement;
    if (!updatedPresence.cursorPosition) updatedPresence.cursorPosition = currentPresence.cursorPosition;
    if (!updatedPresence.lastActive) updatedPresence.lastActive = new Date().toISOString();
    
    dispatch({
      type: 'UPDATE_USER_PRESENCE',
      payload: {
        userId,
        presence: updatedPresence
      }
    });
    
    // In a real app, we would broadcast presence to other users
    // For this demo, we'll just update local state
  }, [state.users, state.activeUsers]);
  
  // Provide the context
  return (
    <CollaborationContext.Provider value={{ 
      state, 
      setDocumentId, 
      addChange, 
      applyChanges, 
      updateUserPresence 
    }}>
      {children}
    </CollaborationContext.Provider>
  );
};

// Hook for using the collaboration context
export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (context === undefined) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
};

// Helper function to simulate other users (for demo purposes)
const simulateUsers = (dispatch: React.Dispatch<CollaborationAction>) => {
  // Create some simulated users
  const simulatedUsers = [
    {
      id: 'sim-user-1',
      name: 'Alice',
      color: 'hsl(200, 70%, 60%)',
      avatar: null,
      presence: {
        status: 'active' as const,
        focusElement: 'editor' as string | null,
        cursorPosition: { x: 150, y: 30, elementId: 'collaborative-editor' },
        lastActive: new Date().toISOString()
      }
    },
    {
      id: 'sim-user-2',
      name: 'Bob',
      color: 'hsl(140, 70%, 60%)',
      avatar: null,
      presence: {
        status: 'active' as const,
        focusElement: 'editor' as string | null,
        cursorPosition: { x: 300, y: 120, elementId: 'collaborative-editor' },
        lastActive: new Date().toISOString()
      }
    }
  ];
  
  // Add the simulated users
  simulatedUsers.forEach(user => {
    dispatch({ type: 'USER_JOINED', payload: user });
  });
  
  // Simulate user presence changes
  setInterval(() => {
    const randomUser = simulatedUsers[Math.floor(Math.random() * simulatedUsers.length)];
    const newX = 50 + Math.floor(Math.random() * 400);
    const newY = 20 + Math.floor(Math.random() * 200);
    
    dispatch({
      type: 'UPDATE_USER_PRESENCE',
      payload: {
        userId: randomUser.id,
        presence: {
          status: 'active',
          focusElement: 'editor',
          cursorPosition: { 
            x: newX, 
            y: newY, 
            elementId: 'collaborative-editor' 
          },
          lastActive: new Date().toISOString()
        }
      }
    });
  }, 3000);
  
  // Simulate user idle after a while
  setTimeout(() => {
    dispatch({
      type: 'UPDATE_USER_PRESENCE',
      payload: {
        userId: 'sim-user-2',
        presence: {
          status: 'idle',
          focusElement: 'editor',
          cursorPosition: { x: 300, y: 120, elementId: 'collaborative-editor' },
          lastActive: new Date().toISOString()
        }
      }
    });
  }, 10000);
};
