import React from 'react';
import { ComponentState } from '@/contexts/VisualStateContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface StatefulComponentProps {
  state?: ComponentState;
  variant?: 'button' | 'card' | 'input';
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  forceState?: ComponentState;
  defaultStyles?: string;
  hoverStyles?: string;
  activeStyles?: string;
  focusStyles?: string;
  disabledStyles?: string;
  showTransition?: boolean;
}

export const StatefulComponent: React.FC<StatefulComponentProps> = ({
  state = 'default',
  variant = 'button',
  style,
  className,
  children,
  forceState,
  defaultStyles = '',
  hoverStyles = '',
  activeStyles = '',
  focusStyles = '',
  disabledStyles = '',
  showTransition = true
}) => {
  const currentState = forceState || state;
  
  const getStateClasses = () => {
    switch (currentState) {
      case 'hover':
        return cn(defaultStyles, hoverStyles);
      case 'active':
        return cn(defaultStyles, activeStyles);
      case 'focus':
        return cn(defaultStyles, focusStyles);
      case 'disabled':
        return cn(defaultStyles, disabledStyles);
      default:
        return defaultStyles;
    }
  };

  const renderComponent = () => {
    if (defaultStyles) {
      return (
        <div 
          className={cn(
            getStateClasses(),
            className
          )}
          style={{
            ...style,
            transition: showTransition ? 'all 0.2s ease' : 'none'
          }}
        >
          {children}
        </div>
      );
    }
    
    switch (variant) {
      case 'card':
        return (
          <Card
            className={cn(
              'transition-all',
              currentState === 'hover' && 'shadow-lg transform -translate-y-1',
              currentState === 'active' && 'shadow-sm transform translate-y-0.5',
              currentState === 'focus' && 'ring-2 ring-primary ring-offset-2',
              currentState === 'disabled' && 'opacity-50 cursor-not-allowed',
              className
            )}
            style={style}
          >
            <div className="p-4">
              <h3 className="font-medium">Card Component</h3>
              <p className="text-sm text-muted-foreground">
                Current state: {currentState}
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
              placeholder={`Input in ${currentState} state`}
              disabled={currentState === 'disabled'}
              className={cn(
                'w-full px-3 py-2 border rounded-md transition-all',
                currentState === 'hover' && 'border-primary/50',
                currentState === 'focus' && 'outline-none ring-2 ring-primary ring-offset-2',
                currentState === 'active' && 'bg-primary/5',
                currentState === 'disabled' && 'opacity-50 cursor-not-allowed bg-muted',
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
            disabled={currentState === 'disabled'}
            className={cn(
              'transition-all',
              currentState === 'hover' && 'bg-primary-600',
              currentState === 'active' && 'bg-primary-700 transform scale-95',
              currentState === 'focus' && 'ring-2 ring-primary ring-offset-2',
              currentState === 'disabled' && 'opacity-50 cursor-not-allowed',
              className
            )}
            style={style}
          >
            {children || `Button - ${currentState} state`}
          </Button>
        );
    }
  };
  
  return renderComponent();
};

export default StatefulComponent;
