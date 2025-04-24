
import React, { useEffect, useState } from 'react';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { User, CursorPosition } from '@/types/collaboration';
import UserCursor from './UserCursor';
import UserAvatarStack from './UserAvatarStack';

interface UserPresenceOverlayProps {
  containerId: string;
  showPresenceList?: boolean;
}

const UserPresenceOverlay: React.FC<UserPresenceOverlayProps> = ({ 
  containerId,
  showPresenceList = true
}) => {
  const { state } = useCollaboration();
  const { users, activeUsers } = state;
  
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);
  
  // Update container boundaries when container or active users change
  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const updateRect = () => {
      const rect = container.getBoundingClientRect();
      setContainerRect(rect);
    };
    
    updateRect();
    
    // Observe for container size changes
    const resizeObserver = new ResizeObserver(updateRect);
    resizeObserver.observe(container);
    
    // Update on window resize too
    window.addEventListener('resize', updateRect);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateRect);
    };
  }, [containerId, activeUsers.length]);
  
  // Get active users who have cursor positions
  const activeUsersWithCursors = activeUsers
    .map(id => users[id])
    .filter(user => 
      user && 
      user.presence.cursorPosition && 
      user.presence.status !== 'offline'
    );
  
  if (!containerRect) return null;
  
  return (
    <>
      {/* Cursors overlay */}
      <div 
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-50"
        style={{ 
          position: 'absolute',
          top: containerRect.top,
          left: containerRect.left,
          width: containerRect.width,
          height: containerRect.height
        }}
      >
        {activeUsersWithCursors.map(user => (
          <UserCursor 
            key={user.id}
            user={user}
            containerRect={containerRect}
          />
        ))}
      </div>
      
      {/* User presence list */}
      {showPresenceList && activeUsers.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <UserAvatarStack users={activeUsers.map(id => users[id]).filter(Boolean)} />
        </div>
      )}
    </>
  );
};

export default UserPresenceOverlay;
