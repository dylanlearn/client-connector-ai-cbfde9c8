
import React, { createContext, useContext, useReducer, useEffect, useState, useMemo } from 'react';
import { nanoid } from 'nanoid';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { 
  CollaborationState, 
  CollaborationAction, 
  User, 
  DocumentChange,
  UserPresence
} from '@/types/collaboration';

interface CollaborationContextType {
  state: CollaborationState;
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  setDocumentId: (documentId: string | null) => void;
  addChange: (change: Omit<DocumentChange, 'id' | 'timestamp'>) => void;
  applyChanges: (changeIds: string[]) => void;
  updateUserPresence: (presence: Partial<UserPresence>) => void;
}

const defaultPresence: UserPresence = {
  status: 'offline',
  focusElement: null,
  cursorPosition: null,
  lastActive: new Date().toISOString()
};

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
      const { [action.payload]: removedUser, ...remainingUsers } = state.users;
      return {
        ...state,
        users: remainingUsers,
        activeUsers: state.activeUsers.filter(id => id !== action.payload)
      };
    
    case 'UPDATE_USER_PRESENCE':
      const { userId, presence } = action.payload;
      const user = state.users[userId];
      
      if (!user) {
        return state;
      }
      
      return {
        ...state,
        users: {
          ...state.users,
          [userId]: {
            ...user,
            presence: {
              ...user.presence,
              ...presence
            }
          }
        }
      };
    
    case 'ADD_CHANGE':
      return {
        ...state,
        changes: [...state.changes, action.payload],
        pendingChanges: [...state.pendingChanges, action.payload.id]
      };
    
    case 'CHANGES_APPLIED':
      return {
        ...state,
        pendingChanges: state.pendingChanges.filter(id => !action.payload.includes(id))
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
      return {
        ...state,
        changes: [
          ...state.changes,
          ...action.payload.filter(change => 
            !state.changes.some(existing => existing.id === change.id)
          )
        ]
      };
    
    default:
      return state;
  }
};

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

export function CollaborationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(collaborationReducer, initialState);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  
  // Generate a user ID and create simulated user data for this client
  const userId = useMemo(() => {
    const storedUserId = localStorage.getItem('collaborative_user_id');
    if (storedUserId) return storedUserId;
    
    const newUserId = nanoid();
    localStorage.setItem('collaborative_user_id', newUserId);
    return newUserId;
  }, []);
  
  const userName = useMemo(() => {
    const names = [
      'Alex', 'Blake', 'Casey', 'Dana', 'Ellis',
      'Francis', 'Glenn', 'Harper', 'Indigo', 'Jamie',
      'Kai', 'Leslie', 'Morgan', 'Noel', 'Parker'
    ];
    
    // Pseudo-random but consistent name for this user ID
    const nameIndex = Array.from(userId).reduce((acc, char) => 
      acc + char.charCodeAt(0), 0) % names.length;
    
    return names[nameIndex];
  }, [userId]);
  
  const userColor = useMemo(() => {
    const colors = [
      '#FF5733', '#33FF57', '#3357FF', '#F033FF', '#FF33F0',
      '#33FFF0', '#F0FF33', '#FF8C33', '#8C33FF', '#33FFCC'
    ];
    
    // Pseudo-random but consistent color for this user ID
    const colorIndex = Array.from(userId).reduce((acc, char) => 
      acc + char.charCodeAt(0), 0) % colors.length;
    
    return colors[colorIndex];
  }, [userId]);
  
  // Effect to set up real-time collaboration when documentId changes
  useEffect(() => {
    if (!state.documentId) return;
    
    // Clean up any existing channel
    if (channel) {
      channel.unsubscribe();
    }
    
    // Create a new channel for the document
    const docChannel = supabase.channel(`document:${state.documentId}`);
    
    // Add local user to the document when joining
    const localUser: User = {
      id: userId,
      name: userName,
      color: userColor,
      avatar: null,
      presence: {
        status: 'active',
        focusElement: null,
        cursorPosition: null,
        lastActive: new Date().toISOString()
      }
    };
    
    // Join the document and broadcast presence
    docChannel
      .on('presence', { event: 'sync' }, () => {
        const presences = docChannel.presenceState();
        console.log('Presence sync', presences);
        
        // Process joined users
        Object.keys(presences).forEach(key => {
          const presence = presences[key][0];
          if (presence && presence.user && presence.user.id !== userId) {
            dispatch({
              type: 'USER_JOINED',
              payload: presence.user as User
            });
          }
        });
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        newPresences.forEach(presence => {
          if (presence && presence.user && presence.user.id !== userId) {
            dispatch({
              type: 'USER_JOINED',
              payload: presence.user as User
            });
          }
        });
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        leftPresences.forEach(presence => {
          if (presence && presence.user && presence.user.id !== userId) {
            dispatch({
              type: 'USER_LEFT',
              payload: presence.user.id
            });
            
            // Update user status to idle after leaving
            dispatch({
              type: 'UPDATE_USER_PRESENCE',
              payload: {
                userId: presence.user.id,
                presence: {
                  status: 'idle',
                  focusElement: null,
                  cursorPosition: null,
                  lastActive: new Date().toISOString()
                }
              }
            });
          }
        });
      })
      .on('broadcast', { event: 'user_activity' }, payload => {
        if (payload.payload.userId !== userId) {
          dispatch({
            type: 'UPDATE_USER_PRESENCE',
            payload: {
              userId: payload.payload.userId,
              presence: {
                status: 'active',
                focusElement: payload.payload.presence.focusElement || null,
                cursorPosition: payload.payload.presence.cursorPosition || null,
                lastActive: new Date().toISOString()
              }
            }
          });
        }
      })
      .on('broadcast', { event: 'cursor_move' }, payload => {
        if (payload.payload.userId !== userId) {
          dispatch({
            type: 'UPDATE_USER_PRESENCE',
            payload: {
              userId: payload.payload.userId,
              presence: {
                status: payload.payload.presence.status || 'active',
                focusElement: payload.payload.presence.focusElement || null,
                cursorPosition: payload.payload.presence.cursorPosition || null,
                lastActive: new Date().toISOString()
              }
            }
          });
        }
      })
      .on('broadcast', { event: 'document_change' }, payload => {
        if (payload.payload.userId !== userId) {
          dispatch({
            type: 'MERGE_REMOTE_CHANGES',
            payload: [payload.payload.change]
          });
        }
      })
      .subscribe(status => {
        console.log('Channel status', status);
        
        if (status === 'SUBSCRIBED') {
          dispatch({
            type: 'SET_CONNECTION_STATUS',
            payload: true
          });
          
          // Track local user presence
          docChannel.track({
            user: localUser
          });
          
          // Add local user to the state
          dispatch({
            type: 'USER_JOINED',
            payload: localUser
          });
          
          // Set up idle detection
          let idleTimeout: number | undefined;
          const resetIdleTimer = () => {
            window.clearTimeout(idleTimeout);
            
            // If currently idle, set back to active
            if (state.users[userId]?.presence.status === 'idle') {
              const updatedPresence: UserPresence = {
                status: 'active',
                focusElement: state.users[userId]?.presence.focusElement || null,
                cursorPosition: state.users[userId]?.presence.cursorPosition || null,
                lastActive: new Date().toISOString()
              };
              
              docChannel.send({
                type: 'broadcast',
                event: 'user_activity',
                payload: {
                  userId,
                  presence: updatedPresence
                }
              });
              
              dispatch({
                type: 'UPDATE_USER_PRESENCE',
                payload: {
                  userId,
                  presence: updatedPresence
                }
              });
            }
            
            // Set idle after 2 minutes of inactivity
            idleTimeout = window.setTimeout(() => {
              const updatedPresence: UserPresence = {
                status: 'idle',
                focusElement: state.users[userId]?.presence.focusElement || null,
                cursorPosition: state.users[userId]?.presence.cursorPosition || null,
                lastActive: new Date().toISOString()
              };
              
              docChannel.send({
                type: 'broadcast',
                event: 'user_activity',
                payload: {
                  userId,
                  presence: updatedPresence
                }
              });
              
              dispatch({
                type: 'UPDATE_USER_PRESENCE',
                payload: {
                  userId,
                  presence: updatedPresence
                }
              });
            }, 2 * 60 * 1000);
          };
          
          // Set up activity detection
          window.addEventListener('mousemove', resetIdleTimer);
          window.addEventListener('keydown', resetIdleTimer);
          resetIdleTimer();
          
          return () => {
            window.removeEventListener('mousemove', resetIdleTimer);
            window.removeEventListener('keydown', resetIdleTimer);
            window.clearTimeout(idleTimeout);
          };
        } else {
          dispatch({
            type: 'SET_CONNECTION_STATUS',
            payload: false
          });
        }
      });
    
    setChannel(docChannel);
    
    // Clean up when unmounting or when documentId changes
    return () => {
      docChannel.unsubscribe();
      setChannel(null);
    };
  }, [state.documentId, userId, userName, userColor]);
  
  const addUser = (user: User) => {
    dispatch({
      type: 'USER_JOINED',
      payload: user
    });
  };
  
  const removeUser = (userId: string) => {
    dispatch({
      type: 'USER_LEFT',
      payload: userId
    });
  };
  
  const setDocumentId = (documentId: string | null) => {
    dispatch({
      type: 'SET_DOCUMENT_ID',
      payload: documentId
    });
  };
  
  const addChange = (change: Omit<DocumentChange, 'id' | 'timestamp'>) => {
    const fullChange: DocumentChange = {
      ...change,
      id: nanoid(),
      timestamp: new Date().toISOString()
    };
    
    dispatch({
      type: 'ADD_CHANGE',
      payload: fullChange
    });
    
    if (channel) {
      channel.send({
        type: 'broadcast',
        event: 'document_change',
        payload: {
          userId,
          change: fullChange
        }
      });
    }
  };
  
  const applyChanges = (changeIds: string[]) => {
    dispatch({
      type: 'CHANGES_APPLIED',
      payload: changeIds
    });
  };
  
  const updateUserPresence = (presence: Partial<UserPresence>) => {
    // Create a complete presence object by merging with current user presence or defaults
    const currentUserPresence = state.users[userId]?.presence || defaultPresence;
    const completePresence: UserPresence = {
      ...currentUserPresence,
      ...presence,
      // Ensure lastActive is always updated
      lastActive: new Date().toISOString()
    };
    
    if (channel) {
      channel.send({
        type: 'broadcast',
        event: 'cursor_move',
        payload: {
          userId,
          presence: completePresence
        }
      });
    }
    
    dispatch({
      type: 'UPDATE_USER_PRESENCE',
      payload: {
        userId,
        presence: completePresence
      }
    });
  };
  
  const contextValue = {
    state,
    addUser,
    removeUser,
    setDocumentId,
    addChange,
    applyChanges,
    updateUserPresence
  };
  
  return (
    <CollaborationContext.Provider value={contextValue}>
      {children}
    </CollaborationContext.Provider>
  );
}

export function useCollaboration() {
  const context = useContext(CollaborationContext);
  
  if (!context) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  
  return context;
}
