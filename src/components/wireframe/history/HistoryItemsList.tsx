
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight } from 'lucide-react';

export interface HistoryItem {
  id: string;
  timestamp: number;
  description: string;
  isCurrent?: boolean;
}

interface HistoryItemsListProps {
  history: HistoryItem[];
  currentPosition: number;
  onJumpTo: (id: string) => void;
}

export const HistoryItemsList: React.FC<HistoryItemsListProps> = ({ 
  history, 
  currentPosition,
  onJumpTo
}) => {
  if (!history || history.length === 0) {
    return <p className="text-sm text-muted-foreground">No history items yet.</p>;
  }

  return (
    <div className="space-y-2">
      {history.map((item, index) => (
        <div 
          key={item.id}
          className={`flex items-center justify-between p-2 rounded-md ${
            index === currentPosition ? 'bg-primary/10 border border-primary/20' : 'hover:bg-accent/50'
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{item.description || `Edit ${index + 1}`}</p>
              <time className="text-xs text-muted-foreground">
                {new Date(item.timestamp).toLocaleTimeString()}
              </time>
            </div>
          </div>
          
          {index !== currentPosition && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onJumpTo(item.id)}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
