
import React from 'react';
import { User } from '@/types/collaboration';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UserAvatarStackProps {
  users: User[];
  maxVisibleAvatars?: number;
}

const UserAvatarStack: React.FC<UserAvatarStackProps> = ({ 
  users,
  maxVisibleAvatars = 5
}) => {
  if (!users.length) return null;
  
  // Sort users by status (active first, then idle, then offline)
  const sortedUsers = [...users].sort((a, b) => {
    const statusPriority = { active: 0, idle: 1, offline: 2 };
    return statusPriority[a.presence.status] - statusPriority[b.presence.status];
  });
  
  const visibleUsers = sortedUsers.slice(0, maxVisibleAvatars);
  const extraUsersCount = sortedUsers.length - maxVisibleAvatars;
  
  return (
    <div className="flex flex-row-reverse">
      {/* Additional users count indicator */}
      {extraUsersCount > 0 && (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 border-2 border-white text-xs font-medium -ml-2 z-10">
          +{extraUsersCount}
        </div>
      )}
      
      {/* User avatars */}
      {visibleUsers.map((user, index) => (
        <TooltipProvider key={user.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className="relative -ml-2 first:ml-0" 
                style={{ zIndex: visibleUsers.length - index }}
              >
                <Avatar className="w-8 h-8 border-2 border-white">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : (
                    <AvatarFallback 
                      style={{ backgroundColor: user.color }}
                      className="text-white"
                    >
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                {/* Status indicator */}
                <span 
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white ${
                    user.presence.status === 'active' ? 'bg-green-500' :
                    user.presence.status === 'idle' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.presence.status}</p>
                {user.presence.focusElement && (
                  <p className="text-xs">Viewing: {user.presence.focusElement}</p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default UserAvatarStack;
