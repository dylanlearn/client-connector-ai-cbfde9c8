
import React from 'react';
import { User, CursorPosition } from '@/types/collaboration';

interface UserCursorProps {
  user: User;
  containerRect: DOMRect;
}

const UserCursor: React.FC<UserCursorProps> = ({ user, containerRect }) => {
  if (!user.presence.cursorPosition) return null;
  
  const cursorPosition = user.presence.cursorPosition;
  
  // Check if we have absolute position (x, y) or selection-based position
  if (cursorPosition.x !== undefined && cursorPosition.y !== undefined) {
    return (
      <div 
        className="absolute pointer-events-none z-50"
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div 
          className="w-4 h-4 rounded-full border border-white shadow-sm flex items-center justify-center text-xs text-white"
          style={{ 
            backgroundColor: user.color,
            transform: 'scale(0.8)'
          }}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div 
          className="absolute top-5 left-0 px-2 py-1 text-xs rounded whitespace-nowrap"
          style={{ backgroundColor: user.color, color: 'white' }}
        >
          {user.name}
        </div>
      </div>
    );
  } 
  // Handle text selection cursors
  else if (cursorPosition.selection) {
    return (
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute w-0.5 h-5 -ml-px animate-pulse" 
          style={{ 
            backgroundColor: user.color,
            // This is a simplified positioning that would need to be replaced
            // with more accurate position calculation in a real text editor
            left: `${(cursorPosition.selection.start / 100) * containerRect.width}px`,
            top: `${Math.random() * 100}px` // Placeholder for demo
          }}
        >
          <div 
            className="absolute top-6 left-0 px-2 py-1 text-xs rounded whitespace-nowrap"
            style={{ backgroundColor: user.color, color: 'white' }}
          >
            {user.name}
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default UserCursor;
