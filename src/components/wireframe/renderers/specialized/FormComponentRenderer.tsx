
import React from 'react';
import { cn } from '@/lib/utils';
import { BaseComponentRendererProps } from './BaseComponentRenderer';
import { ComponentRendererFactory } from '../ComponentRendererFactory';

/**
 * Specialized renderer for form components
 */
const FormComponentRenderer: React.FC<BaseComponentRendererProps> = ({
  component,
  darkMode = false,
  interactive = false,
  onClick,
  isSelected = false,
  deviceType = 'desktop',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    // Only trigger if clicking directly on form, not children
    if (interactive && onClick && component.id && e.target === e.currentTarget) {
      onClick(component.id);
    }
  };

  // Extract form styles
  const {
    width = '100%',
    height = 'auto',
    padding = '1rem',
    gap = '1rem',
    backgroundColor = darkMode ? 'transparent' : 'transparent',
    borderRadius = '0.375rem',
    border = component.props?.hasBorder ? (darkMode ? '1px solid #4B5563' : '1px solid #D1D5DB') : 'none',
  } = component.style || {};

  // Form title and description from props
  const formTitle = component.props?.title || '';
  const formDescription = component.props?.description || '';

  return (
    <div 
      className={cn(
        "wireframe-form-component",
        isSelected && "ring-2 ring-primary",
        interactive && "cursor-pointer"
      )}
      style={{
        width,
        height,
        padding,
        backgroundColor,
        borderRadius,
        border
      }}
      onClick={handleClick}
      data-component-id={component.id}
      data-component-type="form"
    >
      {/* Form Header */}
      {(formTitle || formDescription) && (
        <div className="form-header mb-4">
          {formTitle && (
            <h3 className={cn(
              "text-xl font-medium mb-1",
              darkMode ? "text-white" : "text-gray-900"
            )}>
              {formTitle}
            </h3>
          )}
          
          {formDescription && (
            <p className={cn(
              "text-sm",
              darkMode ? "text-gray-300" : "text-gray-600"
            )}>
              {formDescription}
            </p>
          )}
        </div>
      )}
      
      {/* Form Fields */}
      <div className="form-fields" style={{ display: 'flex', flexDirection: 'column', gap }}>
        {component.children && component.children.length > 0 ? (
          component.children.map((child, index) => (
            <ComponentRendererFactory
              key={child.id || `field-${index}`}
              component={child}
              darkMode={darkMode}
              interactive={interactive}
              onClick={onClick}
              deviceType={deviceType}
            />
          ))
        ) : (
          <>
            <div className="form-field">
              <label className={cn("block text-sm font-medium mb-1", darkMode ? "text-gray-200" : "text-gray-700")}>
                Email
              </label>
              <input 
                type="email" 
                className={cn(
                  "w-full px-3 py-2 rounded-md border",
                  darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                )}
                placeholder="Your email address"
              />
            </div>
            
            <div className="form-field">
              <label className={cn("block text-sm font-medium mb-1", darkMode ? "text-gray-200" : "text-gray-700")}>
                Password
              </label>
              <input 
                type="password" 
                className={cn(
                  "w-full px-3 py-2 rounded-md border",
                  darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                )}
                placeholder="Your password"
              />
            </div>
          </>
        )}
      </div>
      
      {/* Form Actions */}
      <div className="form-actions mt-6">
        <button
          className={cn(
            "px-4 py-2 rounded-md font-medium",
            "bg-blue-600 text-white hover:bg-blue-700"
          )}
        >
          {component.props?.submitText || "Submit"}
        </button>
        
        {component.props?.hasCancel && (
          <button
            className={cn(
              "px-4 py-2 ml-2 rounded-md font-medium",
              darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {component.props?.cancelText || "Cancel"}
          </button>
        )}
      </div>
    </div>
  );
};

export default FormComponentRenderer;
