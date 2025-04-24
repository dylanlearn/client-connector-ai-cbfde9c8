
import React, { memo, useEffect, useState } from 'react';
import { User, CursorPosition } from '@/types/collaboration';

interface UserCursorProps {
  user: User;
  containerRect: DOMRect;
}

const UserCursor: React.FC<UserCursorProps> = ({ user, containerRect }) => {
  const { color, name } = user;
  const cursorPosition = user.presence.cursorPosition;
  const [isVisible, setIsVisible] = useState(true);
  
  // If no cursor position, don't render
  if (!cursorPosition) return null;
  
  // Position relative to the container
  const cursorStyle = {
    position: 'absolute',
    left: `${cursorPosition.x}px`,
    top: `${cursorPosition.y}px`,
    zIndex: 9999,
    pointerEvents: 'none',
    transition: 'transform 0.1s ease-out, opacity 0.3s ease'
  } as React.CSSProperties;
  
  // Handle text selection if present
  const renderSelection = () => {
    if (!cursorPosition.selection || !cursorPosition.elementId) {
      return null;
    }
    
    // Find the element
    const element = document.getElementById(cursorPosition.elementId);
    if (!element) return null;
    
    // For text elements, show selection highlight
    // This is a simplified implementation - production would be more robust
    const { start, end } = cursorPosition.selection;
    
    return (
      <div
        style={{
          position: 'absolute',
          backgroundColor: `${color}33`, // Add transparency
          height: '1.2em',
          left: 0,
          top: 0,
          pointerEvents: 'none'
        }}
      />
    );
  };
  
  // Pulse animation for idle users
  useEffect(() => {
    if (user.presence.status === 'idle') {
      const interval = setInterval(() => {
        setIsVisible(prev => !prev);
      }, 1000);
      
      return () => clearInterval(interval);
    } else {
      setIsVisible(true);
    }
  }, [user.presence.status]);
  
  return (
    <div 
      className="user-cursor" 
      style={{ 
        ...cursorStyle,
        opacity: isVisible ? 1 : 0.3
      }}
    >
      {/* Custom cursor shape */}
      <svg 
        width="24" 
        height="36" 
        viewBox="0 0 24 36" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M2.20001 2.20001L12 34L15.5 19.5L21.8 15.5L2.20001 2.20001Z" 
          fill="white" 
          stroke={color} 
          strokeWidth="2.5"
        />
      </svg>
      
      {/* User label */}
      <div 
        className="user-label px-2 py-1 rounded-md text-xs text-white whitespace-nowrap"
        style={{ 
          backgroundColor: color, 
          transform: 'translate(8px, -4px)'
        }}
      >
        {name}
      </div>
      
      {/* Selection highlight if applicable */}
      {renderSelection()}
    </div>
  );
};

export default memo(UserCursor);
