
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, GitBranch, ArrowRight } from 'lucide-react';

export interface Branch {
  id: string;
  name: string;
  createdAt: number;
  historyCount: number;
}

interface HistoryBranchesListProps {
  branches: Branch[];
  activeBranch: string;
  onSwitchBranch: (branchId: string) => void;
}

export const HistoryBranchesList: React.FC<HistoryBranchesListProps> = ({
  branches,
  activeBranch,
  onSwitchBranch
}) => {
  if (!branches || branches.length === 0) {
    return <p className="text-sm text-muted-foreground">No branches available.</p>;
  }

  return (
    <div className="space-y-2">
      {branches.map(branch => (
        <div 
          key={branch.id}
          className={`flex items-center justify-between p-2 rounded-md ${
            branch.id === activeBranch ? 'bg-primary/10 border border-primary/20' : 'hover:bg-accent/50'
          }`}
        >
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{branch.name}</p>
              <p className="text-xs text-muted-foreground">
                {branch.historyCount} changes • Created {new Date(branch.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          {branch.id === activeBranch ? (
            <Button variant="ghost" size="sm" disabled>
              <Check className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onSwitchBranch(branch.id)}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
