
import React from 'react';
import { User } from '@/types/collaboration';
import { cn } from '@/lib/utils';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface UserPresenceIndicatorProps {
  user: User;
}

const UserPresenceIndicator: React.FC<UserPresenceIndicatorProps> = ({ user }) => {
  const statusColors = {
    active: 'bg-green-500',
    idle: 'bg-yellow-500',
    offline: 'bg-gray-500'
  };

  const avatarLetter = user.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            <div 
              className="flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-medium"
              style={{ backgroundColor: user.color || '#666' }}
            >
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span>{avatarLetter}</span>
              )}
            </div>
            <span 
              className={cn(
                "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white",
                statusColors[user.presence.status as keyof typeof statusColors] || statusColors.offline
              )}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {user.presence.status}
              {user.presence.lastActive && 
                ` - Last active: ${new Date(user.presence.lastActive).toLocaleTimeString()}`
              }
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UserPresenceIndicator;
