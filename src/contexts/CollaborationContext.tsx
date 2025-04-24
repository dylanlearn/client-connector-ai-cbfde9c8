
import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { User, UserPresence, DocumentChange, CollaborationState, CollaborationAction } from '@/types/collaboration';
import { nanoid } from 'nanoid';

// Mock data for demonstration purposes
const mockUsers: Record<string, User> = {
  'user-1': {
    id: 'user-1',
    name: 'Alex Johnson',
    color: '#4C6EF5',
    avatar: null,
    presence: {
      status: 'active',
      focusElement: 'editor',
      cursorPosition: { x: 150, y: 80 },
      lastActive: new Date().toISOString(),
    },
  },
  'user-2': {
    id: 'user-2',
    name: 'Taylor Smith',
    color: '#FA5252',
    avatar: null,
    presence: {
      status: 'idle',
      focusElement: 'comments',
      cursorPosition: { x: 250, y: 120 },
      lastActive: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    },
  },
};

// Initial state
const initialState: CollaborationState = {
  users: mockUsers,
  activeUsers: Object.keys(mockUsers),
  documentId: null,
  changes: [],
  pendingChanges: [],
  isConnected: true,
  error: null,
  lastSyncedVersion: 0,
};

// Reducer for state management
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
      return {
        ...state,
        activeUsers: state.activeUsers.filter(id => id !== action.payload),
        users: {
          ...state.users,
          [action.payload]: {
            ...state.users[action.payload],
            presence: {
              ...state.users[action.payload].presence,
              status: 'offline',
            },
          },
        },
      };
      
    case 'UPDATE_USER_PRESENCE':
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
        pendingChanges: [...state.pendingChanges, action.payload],
      };
      
    case 'CHANGES_APPLIED':
      return {
        ...state,
        pendingChanges: state.pendingChanges.filter(
          change => !action.payload.includes(change.id)
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
  setDocumentId: (id: string | null) => void;
  userJoined: (user: User) => void;
  userLeft: (userId: string) => void;
  updateUserPresence: (presence: Partial<UserPresence>) => void;
  addChange: (change: Omit<DocumentChange, 'id' | 'timestamp'>) => void;
  applyChanges: (changes: DocumentChange[]) => void;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

// Provider component
interface CollaborationProviderProps {
  children: ReactNode;
}

export const CollaborationProvider: React.FC<CollaborationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(collaborationReducer, initialState);
  
  // Generate a unique ID for the current user
  const currentUserId = useCallback(() => {
    const storedId = localStorage.getItem('collaboration_user_id');
    if (storedId) return storedId;
    
    const newId = nanoid();
    localStorage.setItem('collaboration_user_id', newId);
    return newId;
  }, []);
  
  // Set up the current user when the provider mounts
  useEffect(() => {
    const userId = currentUserId();
    
    // Create a user if they don't exist yet
    if (!state.users[userId]) {
      const randomColors = [
        '#4C6EF5', '#FA5252', '#40C057', '#FD7E14', '#7950F2',
        '#12B886', '#228BE6', '#F783AC', '#82C91E', '#E64980',
      ];
      
      const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
      const randomNames = [
        'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey',
        'Riley', 'Jamie', 'Avery', 'Quinn', 'Blake',
      ];
      const randomName = `${randomNames[Math.floor(Math.random() * randomNames.length)]}`;
      
      dispatch({
        type: 'USER_JOINED',
        payload: {
          id: userId,
          name: randomName,
          color: randomColor,
          avatar: null,
          presence: {
            status: 'active',
            focusElement: null,
            cursorPosition: null,
            lastActive: new Date().toISOString(),
          },
        },
      });
    }
    
    // Set up idle detection
    let idleTimer: NodeJS.Timeout | null = null;
    
    const resetIdleTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
      
      // Set to idle after 2 minutes of inactivity
      idleTimer = setTimeout(() => {
        dispatch({
          type: 'UPDATE_USER_PRESENCE',
          payload: {
            userId,
            presence: {
              status: 'idle',
              lastActive: new Date().toISOString(),
            },
          },
        });
      }, 2 * 60 * 1000);
      
      // If currently idle, set back to active
      if (state.users[userId]?.presence.status === 'idle') {
        dispatch({
          type: 'UPDATE_USER_PRESENCE',
          payload: {
            userId,
            presence: {
              status: 'active',
              lastActive: new Date().toISOString(),
            },
          },
        });
      }
    };
    
    // Set up presence handlers
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    
    // In a real app, we would use a WebSocket to sync presence
    // For demo purposes, simulate remote presence updates
    const presenceInterval = setInterval(() => {
      // Simulate other users moving their cursors
      Object.keys(state.users).forEach(id => {
        if (id !== userId && Math.random() > 0.7) {
          const randomX = Math.floor(Math.random() * 500);
          const randomY = Math.floor(Math.random() * 300);
          
          dispatch({
            type: 'UPDATE_USER_PRESENCE',
            payload: {
              userId: id,
              presence: {
                cursorPosition: {
                  x: randomX,
                  y: randomY,
                  elementId: 'collaborative-editor',
                },
                lastActive: new Date().toISOString(),
              },
            },
          });
        }
      });
    }, 5000);
    
    // Handle browser tab visibility for presence
    const handleVisibilityChange = () => {
      if (document.hidden) {
        dispatch({
          type: 'UPDATE_USER_PRESENCE',
          payload: {
            userId,
            presence: {
              status: 'idle',
              lastActive: new Date().toISOString(),
            },
          },
        });
      } else {
        dispatch({
          type: 'UPDATE_USER_PRESENCE',
          payload: {
            userId,
            presence: {
              status: 'active',
              lastActive: new Date().toISOString(),
            },
          },
        });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Simulate other users joining and leaving
    const joinLeaveInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        // Simulate a new user joining
        const simulatedUserId = `sim-user-${nanoid(8)}`;
        const randomColors = ['#4C6EF5', '#FA5252', '#40C057', '#FD7E14'];
        const randomNames = ['Robin', 'Sam', 'Ash', 'Drew', 'Cameron'];
        
        dispatch({
          type: 'USER_JOINED',
          payload: {
            id: simulatedUserId,
            name: `${randomNames[Math.floor(Math.random() * randomNames.length)]}`,
            color: randomColors[Math.floor(Math.random() * randomColors.length)],
            avatar: null,
            presence: {
              status: 'active',
              focusElement: null,
              cursorPosition: {
                x: Math.floor(Math.random() * 500),
                y: Math.floor(Math.random() * 300),
                elementId: 'collaborative-editor',
              },
              lastActive: new Date().toISOString(),
            },
          },
        });
        
        // And possibly leave after a while
        setTimeout(() => {
          if (Math.random() > 0.5) {
            dispatch({ type: 'USER_LEFT', payload: simulatedUserId });
          }
        }, Math.random() * 60000 + 5000);
      }
    }, 10000);
    
    // Clean up handlers and timers when unmounting
    return () => {
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (idleTimer) clearTimeout(idleTimer);
      clearInterval(presenceInterval);
      clearInterval(joinLeaveInterval);
    };
  }, [currentUserId]);
  
  // Actions
  const setDocumentId = useCallback((id: string | null) => {
    dispatch({ type: 'SET_DOCUMENT_ID', payload: id });
  }, []);
  
  const userJoined = useCallback((user: User) => {
    dispatch({ type: 'USER_JOINED', payload: user });
  }, []);
  
  const userLeft = useCallback((userId: string) => {
    dispatch({ type: 'USER_LEFT', payload: userId });
  }, []);
  
  const updateUserPresence = useCallback((presence: Partial<UserPresence>) => {
    const userId = currentUserId();
    dispatch({
      type: 'UPDATE_USER_PRESENCE',
      payload: { userId, presence },
    });
  }, [currentUserId]);
  
  const addChange = useCallback((change: Omit<DocumentChange, 'id' | 'timestamp'>) => {
    const completeChange: DocumentChange = {
      ...change,
      id: nanoid(),
      timestamp: new Date().toISOString(),
    };
    
    dispatch({ type: 'ADD_CHANGE', payload: completeChange });
    
    // In a real app, we would send this change to a server
    // For this demo, we'll simulate successful application after a delay
    setTimeout(() => {
      dispatch({ type: 'CHANGES_APPLIED', payload: [completeChange.id] });
    }, 500);
  }, []);
  
  const applyChanges = useCallback((changes: DocumentChange[]) => {
    // In a real app, this would use operational transforms to merge changes
    // For this demo, we'll just simulate the application
    console.log('Applying changes:', changes);
    
    // Mark these changes as applied
    setTimeout(() => {
      dispatch({
        type: 'CHANGES_APPLIED',
        payload: changes.map(change => change.id),
      });
    }, 200);
  }, []);
  
  // Context value
  const value = {
    state,
    setDocumentId,
    userJoined,
    userLeft,
    updateUserPresence,
    addChange,
    applyChanges,
  };
  
  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
};

// Custom hook for using the context
export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  
  if (!context) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  
  return context;
};
