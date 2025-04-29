
import React from 'react';
import { User } from '@/types/collaboration';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UserAvatarStackProps {
  users: User[];
  maxVisible?: number;
}

const UserAvatarStack: React.FC<UserAvatarStackProps> = ({
  users,
  maxVisible = 5
}) => {
  const visibleUsers = users.slice(0, maxVisible);
  const extraUsers = users.length > maxVisible ? users.length - maxVisible : 0;
  
  return (
    <div className="flex items-center">
      <div className="flex -space-x-3">
        {visibleUsers.map((user) => (
          <TooltipProvider key={user.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-background text-xs font-medium uppercase text-white" 
                  style={{ backgroundColor: user.color }}
                >
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    user.name.charAt(0)
                  )}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white"></span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {user.presence.status === 'active' ? 'Online' : user.presence.status}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
        
        {extraUsers > 0 && (
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border-2 border-background text-xs font-medium">
            +{extraUsers}
          </div>
        )}
      </div>
      
      <div className="ml-4 text-sm text-muted-foreground">
        {users.length} {users.length === 1 ? 'user' : 'users'} online
      </div>
    </div>
  );
};

export default UserAvatarStack;
