
import React, { createContext, useContext, useReducer, useCallback, ReactNode, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { User, DocumentChange, CollaborationState, CollaborationAction, UserPresence, CursorPosition } from '@/types/collaboration';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';

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

const getRandomColor = () => {
  const colors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', 
    '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', 
    '#009688', '#4caf50', '#8bc34a', '#cddc39',
    '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};

// Mock names for demonstration
const getRandomName = () => {
  const names = [
    'Alex', 'Blake', 'Casey', 'Dana', 'Ellis',
    'Finley', 'Gray', 'Harper', 'Indigo', 'Jordan',
    'Kennedy', 'Logan', 'Morgan', 'Noel', 'Parker',
    'Quinn', 'Riley', 'Sawyer', 'Taylor', 'Vaughn'
  ];
  
  const adjectives = [
    'Quick', 'Smart', 'Clever', 'Bright', 'Swift',
    'Eager', 'Happy', 'Calm', 'Bold', 'Brave'
  ];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const name = names[Math.floor(Math.random() * names.length)];
  
  return `${adjective} ${name}`;
};

// Generate default user presence state
const getDefaultPresence = (): UserPresence => ({
  status: 'active',
  focusElement: null,
  cursorPosition: null,
  lastActive: new Date().toISOString()
});

// Collaboration reducer function
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
      const updatedUsers = { ...state.users };
      if (updatedUsers[action.payload]) {
        updatedUsers[action.payload] = {
          ...updatedUsers[action.payload],
          presence: {
            ...updatedUsers[action.payload].presence,
            status: 'offline'
          }
        };
      }
      
      return {
        ...state,
        users: updatedUsers,
        activeUsers: state.activeUsers.filter(id => id !== action.payload)
      };
      
    case 'UPDATE_USER_PRESENCE':
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
      
    case 'ADD_CHANGE':
      return {
        ...state,
        pendingChanges: [...state.pendingChanges, action.payload]
      };
      
    case 'CHANGES_APPLIED':
      const changeIds = action.payload;
      return {
        ...state,
        pendingChanges: state.pendingChanges.filter(change => !changeIds.includes(change.id)),
        lastSyncedVersion: state.lastSyncedVersion + 1
      };
      
    case 'MERGE_REMOTE_CHANGES':
      return {
        ...state,
        changes: [...state.changes, ...action.payload]
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
      
    default:
      return state;
  }
};

// Create the collaboration context
type CollaborationContextType = {
  state: CollaborationState;
  setDocumentId: (id: string | null) => void;
  addChange: (change: Omit<DocumentChange, 'id' | 'timestamp'>) => void;
  applyChanges: (changes: DocumentChange[]) => void;
  updateUserPresence: (presence: Partial<UserPresence>) => void;
};

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

// Provider component
interface CollaborationProviderProps {
  children: ReactNode;
}

const CollaborationProvider = ({ children }: CollaborationProviderProps) => {
  const [state, dispatch] = useReducer(collaborationReducer, initialState);
  const userId = useUser();
  
  // Initialize current user when component mounts
  useEffect(() => {
    if (!userId) return;
    
    // Create user object for the current user
    const user: User = {
      id: userId,
      name: getRandomName(),
      color: getRandomColor(),
      avatar: null,
      presence: getDefaultPresence()
    };
    
    // Add current user to the users list
    dispatch({ type: 'USER_JOINED', payload: user });
    
    // Simulate some other users joining for demonstration
    const demoUsersCount = Math.floor(Math.random() * 3) + 1; // 1-3 additional users
    
    for (let i = 0; i < demoUsersCount; i++) {
      const demoUser: User = {
        id: nanoid(),
        name: getRandomName(),
        color: getRandomColor(),
        avatar: null,
        presence: getDefaultPresence()
      };
      
      setTimeout(() => {
        dispatch({ type: 'USER_JOINED', payload: demoUser });
        
        // Simulate user activity
        simulateUserActivity(demoUser.id);
      }, i * 2000); // Stagger user joins
    }
    
    return () => {
      // Clean up any subscriptions or timers
    };
  }, [userId]);
  
  // Set up real-time communication with Supabase (simulated for this demo)
  useEffect(() => {
    if (!state.documentId || !userId) return;
    
    // Simulate connection to real-time service
    dispatch({ type: 'SET_CONNECTION_STATUS', payload: true });
    console.log(`Connected to document: ${state.documentId}`);
    
    // Create a Supabase channel for real-time collaboration
    const channel = supabase.channel(`document:${state.documentId}`, {
      config: {
        presence: {
          key: userId,
        },
      },
    });
    
    // Set up presence listeners
    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        console.log('Presence state synchronized:', presenceState);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
        // In a real app, we would extract user details from newPresences
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
        dispatch({ type: 'USER_LEFT', payload: key });
      });
    
    // Set up broadcast listeners for document changes
    channel
      .on('broadcast', { event: 'document_change' }, (payload) => {
        console.log('Received document change:', payload);
        // In a real app, we would process incoming document changes
        // and apply operational transforms if needed
      });
    
    // Subscribe to the channel
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        // Track user's presence with the complete UserPresence object
        const currentPresence = {
          status: 'active',
          focusElement: null, 
          cursorPosition: null,
          lastActive: new Date().toISOString()
        };
        
        await channel.track({
          user: userId,
          presence: currentPresence,
        });
        
        console.log('Subscribed to real-time channel and tracking presence');
      }
    });
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [state.documentId, userId]);
  
  // Simulate user activity for demo purposes
  const simulateUserActivity = useCallback((userId: string) => {
    const activities = [
      // Simulate user going idle
      () => {
        dispatch({
          type: 'UPDATE_USER_PRESENCE',
          payload: {
            userId,
            presence: {
              status: 'idle',
              focusElement: null,
              cursorPosition: null,
              lastActive: new Date().toISOString()
            }
          }
        });
      },
      // Simulate user becoming active again
      () => {
        dispatch({
          type: 'UPDATE_USER_PRESENCE',
          payload: {
            userId,
            presence: {
              status: 'active',
              focusElement: null,
              cursorPosition: null,
              lastActive: new Date().toISOString()
            }
          }
        });
      },
      // Simulate cursor movement
      () => {
        const randomX = Math.floor(Math.random() * 800);
        const randomY = Math.floor(Math.random() * 400);
        
        dispatch({
          type: 'UPDATE_USER_PRESENCE',
          payload: {
            userId,
            presence: {
              status: 'active',
              focusElement: 'editor',
              cursorPosition: {
                x: randomX,
                y: randomY,
                elementId: 'collaborative-editor'
              },
              lastActive: new Date().toISOString()
            }
          }
        });
      }
    ];
    
    // Randomly select an activity and schedule it
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    const delay = Math.random() * 5000 + 2000; // 2-7 seconds
    
    setTimeout(() => {
      randomActivity();
      // Schedule another random activity
      simulateUserActivity(userId);
    }, delay);
  }, []);
  
  // Generate a unique ID for each change
  const addChange = useCallback((change: Omit<DocumentChange, 'id' | 'timestamp'>) => {
    const completeChange: DocumentChange = {
      ...change,
      id: nanoid(),
      timestamp: new Date().toISOString(),
    };
    
    dispatch({ type: 'ADD_CHANGE', payload: completeChange });
    
    // In a real app, we'd also broadcast this change to other users
    // For demo purposes, we'll just apply it locally after a delay
    setTimeout(() => {
      dispatch({ type: 'CHANGES_APPLIED', payload: [completeChange.id] });
    }, 300);
  }, []);
  
  // Apply changes received from remote users
  const applyChanges = useCallback((changes: DocumentChange[]) => {
    dispatch({ type: 'MERGE_REMOTE_CHANGES', payload: changes });
  }, []);
  
  // Set the document ID for collaboration
  const setDocumentId = useCallback((id: string | null) => {
    dispatch({ type: 'SET_DOCUMENT_ID', payload: id });
  }, []);
  
  // Update user presence
  const updateUserPresence = useCallback((presenceUpdate: Partial<UserPresence>) => {
    if (!userId) return;
    
    // Ensure we maintain the required UserPresence structure with defaults for missing fields
    dispatch({
      type: 'UPDATE_USER_PRESENCE',
      payload: {
        userId,
        presence: presenceUpdate
      }
    });
    
    // In a real application, we would broadcast this presence update to other users
    // via the Supabase real-time channel
  }, [userId]);
  
  const value = {
    state,
    setDocumentId,
    addChange,
    applyChanges,
    updateUserPresence
  };
  
  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
};

// Hook to use the collaboration context
const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  
  if (context === undefined) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  
  return context;
};

export { CollaborationProvider, useCollaboration };
