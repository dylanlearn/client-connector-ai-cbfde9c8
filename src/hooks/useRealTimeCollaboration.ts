
import { useEffect } from 'react';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { PresenceService } from '@/services/collaboration/presenceService';
import { DocumentService } from '@/services/collaboration/documentService';
import { useUser } from '@/hooks/useUser';

/**
 * Hook to set up real-time collaboration on a document
 */
export function useRealTimeCollaboration(documentId: string) {
  const { state, setDocumentId, updateUserPresence } = useCollaboration();
  const userId = useUser();

  // Set up collaboration when component mounts
  useEffect(() => {
    if (!documentId) return;
    
    // Set the document ID in the collaboration context
    setDocumentId(documentId);
    
    // Register this user as active
    updateUserPresence({
      status: 'active',
      lastActive: new Date().toISOString(),
    });

    // Set up an interval to update presence status periodically
    const presenceInterval = setInterval(() => {
      updateUserPresence({
        lastActive: new Date().toISOString(),
      });
    }, 30000); // Update every 30 seconds
    
    // Set up a check for idle status
    const idleCheck = () => {
      const lastActive = state.users[userId]?.presence.lastActive;
      if (lastActive) {
        const lastActiveTime = new Date(lastActive).getTime();
        const idleThreshold = 2 * 60 * 1000; // 2 minutes
        
        if (Date.now() - lastActiveTime > idleThreshold) {
          updateUserPresence({
            status: 'idle',
          });
        }
      }
    };
    
    const idleInterval = setInterval(idleCheck, 60000); // Check for idle every minute
    
    return () => {
      clearInterval(presenceInterval);
      clearInterval(idleInterval);
      
      // Mark user as offline when leaving
      updateUserPresence({
        status: 'offline',
      });
      
      // Clear document ID from context
      setDocumentId(null);
    };
  }, [documentId, setDocumentId, updateUserPresence, userId, state.users]);

  return {
    isConnected: state.isConnected,
    activeUsers: state.activeUsers.map(id => state.users[id]).filter(Boolean),
    error: state.error,
  };
}
