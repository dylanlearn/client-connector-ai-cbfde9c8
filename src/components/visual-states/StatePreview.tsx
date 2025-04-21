
import React, { useState } from 'react';
import { ComponentState } from '@/contexts/VisualStateContext';
import StatefulComponent from './StatefulComponent';
import { cn } from '@/lib/utils';

interface StatePreviewProps {
  component: React.ReactNode;
  defaultStyles?: string;
  hoverStyles?: string;
  activeStyles?: string;
  focusStyles?: string;
  disabledStyles?: string;
  showAllStates?: boolean;
  transitionDuration?: number;
  transitionTimingFunction?: string;
  className?: string;
}

/**
 * Component for previewing all visual states of a component
 */
const StatePreview: React.FC<StatePreviewProps> = ({
  component,
  defaultStyles = '',
  hoverStyles = '',
  activeStyles = '',
  focusStyles = '',
  disabledStyles = '',
  showAllStates = false,
  transitionDuration = 300,
  transitionTimingFunction = 'ease',
  className,
}) => {
  const [currentState, setCurrentState] = useState<ComponentState>('default');

  // If showing all states, we render them in a grid
  if (showAllStates) {
    return (
      <div className={cn("state-preview-grid grid gap-4", className)}>
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Default</p>
          <StatefulComponent
            defaultStyles={defaultStyles}
            hoverStyles={hoverStyles}
            activeStyles={activeStyles}
            focusStyles={focusStyles}
            disabledStyles={disabledStyles}
            forceState="default"
            showTransition={false}
          >
            {component}
          </StatefulComponent>
        </div>
        
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Hover</p>
          <StatefulComponent
            defaultStyles={defaultStyles}
            hoverStyles={hoverStyles}
            activeStyles={activeStyles}
            focusStyles={focusStyles}
            disabledStyles={disabledStyles}
            forceState="hover"
            showTransition={false}
          >
            {component}
          </StatefulComponent>
        </div>
        
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Active</p>
          <StatefulComponent
            defaultStyles={defaultStyles}
            hoverStyles={hoverStyles}
            activeStyles={activeStyles}
            focusStyles={focusStyles}
            disabledStyles={disabledStyles}
            forceState="active"
            showTransition={false}
          >
            {component}
          </StatefulComponent>
        </div>
        
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Focus</p>
          <StatefulComponent
            defaultStyles={defaultStyles}
            hoverStyles={hoverStyles}
            activeStyles={activeStyles}
            focusStyles={focusStyles}
            disabledStyles={disabledStyles}
            forceState="focus"
            showTransition={false}
          >
            {component}
          </StatefulComponent>
        </div>
        
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Disabled</p>
          <StatefulComponent
            defaultStyles={defaultStyles}
            hoverStyles={hoverStyles}
            activeStyles={activeStyles}
            focusStyles={focusStyles}
            disabledStyles={disabledStyles}
            forceState="disabled"
            showTransition={false}
          >
            {component}
          </StatefulComponent>
        </div>
      </div>
    );
  }
  
  // Interactive state preview with transitions
  return (
    <div className={cn("state-preview", className)}>
      <div className="mb-2 flex space-x-2">
        <button 
          className={cn(
            "px-2 py-1 text-xs rounded", 
            currentState === 'default' ? 'bg-primary text-primary-foreground' : 'bg-muted'
          )}
          onClick={() => setCurrentState('default')}
        >
          Default
        </button>
        <button
          className={cn(
            "px-2 py-1 text-xs rounded",
            currentState === 'hover' ? 'bg-primary text-primary-foreground' : 'bg-muted'
          )}
          onClick={() => setCurrentState('hover')}
        >
          Hover
        </button>
        <button
          className={cn(
            "px-2 py-1 text-xs rounded",
            currentState === 'active' ? 'bg-primary text-primary-foreground' : 'bg-muted'
          )}
          onClick={() => setCurrentState('active')}
        >
          Active
        </button>
        <button
          className={cn(
            "px-2 py-1 text-xs rounded",
            currentState === 'focus' ? 'bg-primary text-primary-foreground' : 'bg-muted'
          )}
          onClick={() => setCurrentState('focus')}
        >
          Focus
        </button>
        <button
          className={cn(
            "px-2 py-1 text-xs rounded",
            currentState === 'disabled' ? 'bg-primary text-primary-foreground' : 'bg-muted'
          )}
          onClick={() => setCurrentState('disabled')}
        >
          Disabled
        </button>
      </div>
      
      <div className="state-preview-component border rounded p-4">
        <StatefulComponent
          defaultStyles={defaultStyles}
          hoverStyles={hoverStyles}
          activeStyles={activeStyles}
          focusStyles={focusStyles}
          disabledStyles={disabledStyles}
          forceState={currentState}
          style={{
            transitionDuration: `${transitionDuration}ms`,
            transitionTimingFunction,
          }}
        >
          {component}
        </StatefulComponent>
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground">
        Current State: <span className="font-medium">{currentState}</span>
      </div>
    </div>
  );
};

export default StatePreview;
