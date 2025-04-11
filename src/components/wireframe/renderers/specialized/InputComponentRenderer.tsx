
import React from 'react';
import { WireframeComponent } from '@/services/ai/wireframe/wireframe-types';
import { cn } from '@/lib/utils';
import { BaseComponentRendererProps } from './BaseComponentRenderer';

/**
 * Specialized renderer for input components (textfield, textarea, select, checkbox, etc)
 */
const InputComponentRenderer: React.FC<BaseComponentRendererProps> = ({
  component,
  darkMode = false,
  interactive = false,
  onClick,
  isSelected = false,
  deviceType = 'desktop',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    // Prevent event bubbling if interactive
    if (interactive) {
      e.stopPropagation();
      if (onClick && component.id) {
        onClick(component.id);
      }
    }
  };

  // Get input styles
  const {
    width = '100%',
    height = 'auto',
    borderRadius = '0.375rem',
    fontSize = '0.875rem',
    padding = '0.5rem 0.75rem',
    backgroundColor = darkMode ? '#374151' : '#ffffff',
    color = darkMode ? '#ffffff' : '#000000',
    borderColor = darkMode ? '#4B5563' : '#D1D5DB',
    border = `1px solid ${darkMode ? '#4B5563' : '#D1D5DB'}`,
    disabled = false,
    placeholder = component.props?.placeholder || 'Enter text...'
  } = component.style || {};

  // Get input type
  const inputType = component.type?.toLowerCase() || 'text';
  
  // Determine what kind of input to render
  const renderInputElement = () => {
    switch(inputType) {
      case 'textarea':
        return (
          <textarea 
            className={cn(
              'w-full border rounded-md bg-opacity-50',
              darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            placeholder={placeholder}
            disabled={disabled}
            style={{ 
              borderRadius,
              fontSize,
              padding,
              border,
              backgroundColor,
              color
            }}
            readOnly={!interactive}
          ></textarea>
        );
      
      case 'select':
        return (
          <select
            className={cn(
              'w-full border rounded-md bg-opacity-50',
              darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            disabled={disabled}
            style={{ 
              borderRadius,
              fontSize,
              padding,
              border,
              backgroundColor,
              color
            }}
          >
            <option>Select an option...</option>
            {component.props?.options && Array.isArray(component.props.options) ? (
              component.props.options.map((option: string, index: number) => (
                <option key={index} value={option}>{option}</option>
              ))
            ) : (
              <>
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </>
            )}
          </select>
        );
      
      case 'checkbox':
      case 'radio':
        return (
          <div className="flex items-center gap-2">
            <input
              type={inputType}
              className={cn(
                'w-4 h-4',
                inputType === 'checkbox' ? 'rounded' : 'rounded-full',
                darkMode ? 'bg-gray-700 border-gray-500' : 'bg-white border-gray-300',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              disabled={disabled}
            />
            <label className={cn(
              'text-sm',
              darkMode ? 'text-white' : 'text-gray-900'
            )}>
              {component.content || component.props?.label || 'Label'}
            </label>
          </div>
        );
      
      case 'switch':
        return (
          <div className="flex items-center gap-2">
            <div className={cn(
              'relative inline-block w-10 h-6 rounded-full transition-colors',
              disabled ? 'opacity-50 cursor-not-allowed' : '',
              component.props?.checked ? 'bg-blue-600' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
            )}>
              <span className={cn(
                'absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform',
                component.props?.checked && 'transform translate-x-4'
              )}></span>
            </div>
            <label className={cn(
              'text-sm',
              darkMode ? 'text-white' : 'text-gray-900'
            )}>
              {component.content || component.props?.label || 'Toggle'}
            </label>
          </div>
        );
      
      default: // text, email, password, etc.
        return (
          <input
            type={inputType === 'input' ? 'text' : inputType}
            className={cn(
              'w-full border rounded-md bg-opacity-50',
              darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            placeholder={placeholder}
            disabled={disabled}
            style={{ 
              borderRadius,
              fontSize,
              padding,
              border,
              backgroundColor,
              color
            }}
            readOnly={!interactive}
          />
        );
    }
  };

  return (
    <div 
      className={cn(
        "wireframe-input-component",
        isSelected && "ring-2 ring-primary p-1",
        interactive && !disabled && "cursor-pointer"
      )}
      data-component-id={component.id}
      data-component-type={component.type}
      onClick={handleClick}
      style={{
        width,
        height
      }}
    >
      {renderInputElement()}
    </div>
  );
};

export default InputComponentRenderer;
