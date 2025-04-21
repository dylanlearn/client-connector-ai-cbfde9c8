
import React from 'react';
import { ComponentState } from '@/contexts/VisualStateContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface StatefulComponentProps {
  state: ComponentState;
  variant?: 'button' | 'card' | 'input';
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

export const StatefulComponent: React.FC<StatefulComponentProps> = ({
  state = 'default',
  variant = 'button',
  style,
  className,
  children
}) => {
  // Determine which component to render based on variant
  const renderComponent = () => {
    switch (variant) {
      case 'card':
        return (
          <Card
            className={cn(
              'transition-all',
              state === 'hover' && 'shadow-lg transform -translate-y-1',
              state === 'active' && 'shadow-sm transform translate-y-0.5',
              state === 'focus' && 'ring-2 ring-primary ring-offset-2',
              state === 'disabled' && 'opacity-50 cursor-not-allowed',
              className
            )}
            style={style}
          >
            <div className="p-4">
              <h3 className="font-medium">Card Component</h3>
              <p className="text-sm text-muted-foreground">
                Current state: {state}
              </p>
              {children}
            </div>
          </Card>
        );
        
      case 'input':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">Input Label</label>
            <input
              type="text"
              placeholder={`Input in ${state} state`}
              disabled={state === 'disabled'}
              className={cn(
                'w-full px-3 py-2 border rounded-md transition-all',
                state === 'hover' && 'border-primary/50',
                state === 'focus' && 'outline-none ring-2 ring-primary ring-offset-2',
                state === 'active' && 'bg-primary/5',
                state === 'disabled' && 'opacity-50 cursor-not-allowed bg-muted',
                className
              )}
              style={style}
            />
            {children}
          </div>
        );
        
      case 'button':
      default:
        return (
          <Button
            disabled={state === 'disabled'}
            className={cn(
              'transition-all',
              state === 'hover' && 'bg-primary-600',
              state === 'active' && 'bg-primary-700 transform scale-95',
              state === 'focus' && 'ring-2 ring-primary ring-offset-2',
              state === 'disabled' && 'opacity-50 cursor-not-allowed',
              className
            )}
            style={style}
          >
            {children || `Button - ${state} state`}
          </Button>
        );
    }
  };
  
  return renderComponent();
};

export default StatefulComponent;
