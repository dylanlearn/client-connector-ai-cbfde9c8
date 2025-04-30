
import { useEffect, useState } from 'react';

interface CollaborationUser {
  id: string;
  name?: string;
  presence?: {
    cursor?: {
      x: number;
      y: number;
    };
    [key: string]: any;
  };
}

interface RealTimeCollaborationHook {
  users: Record<string, CollaborationUser>;
  activeUsers: string[];
  isConnected: boolean; // Added to fix the error
}

interface Annotation {
  id: string;
  x: number;
  y: number;
  text: string;
  userId: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}

interface RealTimeCollaborationOptions {
  documentId: string;
  userId: string;
  onUserUpdate?: (user: CollaborationUser) => void;
  onAnnotationAdded?: (annotation: Annotation) => void;
}

export function useRealTimeCollaboration({
  documentId,
  userId,
  onUserUpdate,
  onAnnotationAdded
}: RealTimeCollaborationOptions): RealTimeCollaborationHook {
  const [users, setUsers] = useState<Record<string, CollaborationUser>>({});
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(true); // Added to fix the error

  // Setup real-time collaboration hooks
  useEffect(() => {
    if (!documentId || !userId) {
      console.warn('Missing required documentId or userId for real-time collaboration');
      return;
    }

    // In a real production application, this would connect to a real-time service
    // like WebSockets, Supabase Realtime, Firebase, etc.
    console.log(`Setting up real-time collaboration for document ${documentId} and user ${userId}`);

    // Simulate connection status
    setIsConnected(true);

    // Mock data for demo purposes
    const mockUser1: CollaborationUser = {
      id: 'user-123',
      name: 'Alice Smith',
      presence: {
        cursor: { x: 150, y: 120 }
      }
    };

    const mockUser2: CollaborationUser = {
      id: 'user-456',
      name: 'Bob Johnson',
      presence: {
        cursor: { x: 300, y: 220 }
      }
    };

    // Add current user
    const currentUser: CollaborationUser = {
      id: userId,
      name: 'Current User',
      presence: {}
    };

    // Set up mock data
    const mockUsers = {
      [mockUser1.id]: mockUser1,
      [mockUser2.id]: mockUser2,
      [userId]: currentUser
    };

    setUsers(mockUsers);
    setActiveUsers([mockUser1.id, mockUser2.id, userId]);

    // Simulate other users moving
    const movementInterval = setInterval(() => {
      setUsers(prev => {
        // Don't move the current user
        if (!prev['user-123'] || !prev['user-456']) return prev;

        const updated = { ...prev };
        
        // Randomly move user 1 cursor
        if (updated['user-123'].presence?.cursor) {
          updated['user-123'] = {
            ...updated['user-123'],
            presence: {
              ...updated['user-123'].presence,
              cursor: {
                x: Math.max(0, updated['user-123'].presence!.cursor!.x + (Math.random() * 10 - 5)),
                y: Math.max(0, updated['user-123'].presence!.cursor!.y + (Math.random() * 10 - 5))
              }
            }
          };
        }
        
        // Randomly move user 2 cursor
        if (updated['user-456'].presence?.cursor) {
          updated['user-456'] = {
            ...updated['user-456'],
            presence: {
              ...updated['user-456'].presence,
              cursor: {
                x: Math.max(0, updated['user-456'].presence!.cursor!.x + (Math.random() * 10 - 5)),
                y: Math.max(0, updated['user-456'].presence!.cursor!.y + (Math.random() * 10 - 5))
              }
            }
          };
        }
        
        return updated;
      });
    }, 2000);

    // Cleanup
    return () => {
      clearInterval(movementInterval);
      setIsConnected(false);
    };
  }, [documentId, userId, onUserUpdate]);

  return {
    users,
    activeUsers,
    isConnected
  };
}
