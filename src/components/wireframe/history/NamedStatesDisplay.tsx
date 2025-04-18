
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Tag, ArrowRight } from 'lucide-react';
import { DiffIcon } from './lucide-imports';
import { formatDistanceToNow } from 'date-fns';

export interface NamedState {
  id: string;
  name: string;
  timestamp: number;
  stateId: string;
}

interface NamedStatesDisplayProps {
  namedStates: NamedState[];
  onJumpTo: (stateId: string) => void;
  onCompare: (stateId1: string, stateId2: string) => void;
}

export const NamedStatesDisplay: React.FC<NamedStatesDisplayProps> = ({
  namedStates,
  onJumpTo,
  onCompare
}) => {
  const [selectedForComparison, setSelectedForComparison] = React.useState<string | null>(null);

  if (!namedStates || namedStates.length === 0) {
    return <p className="text-sm text-muted-foreground">No named states saved yet.</p>;
  }

  const handleCompareClick = (stateId: string) => {
    if (selectedForComparison === null) {
      setSelectedForComparison(stateId);
    } else {
      onCompare(selectedForComparison, stateId);
      setSelectedForComparison(null);
    }
  };

  return (
    <div className="space-y-2">
      {namedStates.map(state => (
        <div 
          key={state.id}
          className={`flex items-center justify-between p-2 rounded-md ${
            selectedForComparison === state.stateId ? 'bg-warning/10 border border-warning/20' : 'hover:bg-accent/50'
          }`}
        >
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{state.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(state.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          <div className="flex gap-1">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleCompareClick(state.stateId)}
              className={selectedForComparison === state.stateId ? "border-warning" : ""}
            >
              <DiffIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onJumpTo(state.stateId)}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
