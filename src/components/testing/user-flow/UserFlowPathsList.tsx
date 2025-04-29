
import React from 'react';
import { UserFlowPath } from '@/services/testing/UserFlowTestingService';
import { Route } from 'lucide-react';

interface UserFlowPathsListProps {
  paths: UserFlowPath[];
  selectedPath: UserFlowPath | null;
  onSelectPath: (path: UserFlowPath) => void;
}

const UserFlowPathsList: React.FC<UserFlowPathsListProps> = ({
  paths,
  selectedPath,
  onSelectPath,
}) => {
  return (
    <div className="divide-y">
      {paths.map((path) => (
        <div
          key={path.id}
          className={`p-4 hover:bg-muted cursor-pointer ${
            selectedPath?.id === path.id ? 'bg-muted' : ''
          }`}
          onClick={() => onSelectPath(path)}
        >
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Route className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="font-medium">{path.name}</div>
              <div className="text-sm text-muted-foreground truncate">
                {path.description || 'No description'}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserFlowPathsList;
