
import React from 'react';
import { cn } from '@/lib/utils';
import { BaseComponentRendererProps } from './BaseComponentRenderer';
import { ComponentRendererFactory } from '../ComponentRendererFactory';

/**
 * Specialized renderer for card/panel/tile components
 */
const CardComponentRenderer: React.FC<BaseComponentRendererProps> = ({
  component,
  darkMode = false,
  interactive = false,
  onClick,
  isSelected = false,
  deviceType = 'desktop',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    // Only trigger if clicking directly on card, not children
    if (interactive && onClick && component.id && e.target === e.currentTarget) {
      onClick(component.id);
    }
  };

  // Extract card styles from component
  const {
    backgroundColor = darkMode ? '#2D3748' : '#FFFFFF',
    borderRadius = '0.5rem',
    padding = '1rem',
    border = darkMode ? '1px solid #4A5568' : '1px solid #E2E8F0',
    boxShadow = darkMode ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    width = '100%',
    height = 'auto',
  } = component.style || {};

  return (
    <div 
      className={cn(
        "wireframe-card-component",
        isSelected && "ring-2 ring-primary",
        interactive && "cursor-pointer"
      )}
      style={{
        backgroundColor,
        borderRadius,
        padding,
        border,
        boxShadow,
        width,
        height,
        overflow: 'hidden'
      }}
      onClick={handleClick}
      data-component-id={component.id}
      data-component-type={component.type}
    >
      {/* Card Header if present */}
      {component.props?.headerText && (
        <div 
          className={cn(
            "card-header mb-4 pb-2",
            darkMode ? "border-gray-700" : "border-gray-200",
            component.props?.headerBorder && "border-b"
          )}
        >
          <h3 className={cn(
            "font-medium text-lg",
            darkMode ? "text-white" : "text-gray-900"
          )}>
            {component.props.headerText}
          </h3>
        </div>
      )}
      
      {/* Card Content */}
      <div className="card-body">
        {component.children && component.children.length > 0 ? (
          component.children.map((child, index) => (
            <ComponentRendererFactory
              key={child.id || `child-${index}`}
              component={child}
              darkMode={darkMode}
              interactive={interactive}
              onClick={onClick}
              deviceType={deviceType}
            />
          ))
        ) : component.content ? (
          <div className={cn(
            "text-sm",
            darkMode ? "text-gray-300" : "text-gray-600"
          )}>
            {component.content}
          </div>
        ) : (
          <div className={cn(
            "text-center py-6",
            darkMode ? "text-gray-400" : "text-gray-500"
          )}>
            Card Content
          </div>
        )}
      </div>
      
      {/* Card Footer if present */}
      {component.props?.footerText && (
        <div 
          className={cn(
            "card-footer mt-4 pt-2",
            darkMode ? "border-gray-700" : "border-gray-200",
            component.props?.footerBorder && "border-t"
          )}
        >
          <div className={cn(
            "text-sm",
            darkMode ? "text-gray-400" : "text-gray-500"
          )}>
            {component.props.footerText}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardComponentRenderer;
