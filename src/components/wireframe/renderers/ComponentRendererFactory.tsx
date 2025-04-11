
import React from 'react';
import ContainerComponentRenderer from './specialized/ContainerComponentRenderer';
import ButtonComponentRenderer from './specialized/ButtonComponentRenderer';
import TextComponentRenderer from './specialized/TextComponentRenderer';
import ImageComponentRenderer from './specialized/ImageComponentRenderer';
import { BaseComponentRendererProps } from './specialized/BaseComponentRenderer';
import InputComponentRenderer from './specialized/InputComponentRenderer';
import CardComponentRenderer from './specialized/CardComponentRenderer';
import ListComponentRenderer from './specialized/ListComponentRenderer';
import IconComponentRenderer from './specialized/IconComponentRenderer';
import VideoComponentRenderer from './specialized/VideoComponentRenderer';
import ChartComponentRenderer from './specialized/ChartComponentRenderer';
import FormComponentRenderer from './specialized/FormComponentRenderer';
import { ErrorBoundary, useErrorHandler } from '@/components/ui/error-boundary';
import { ErrorMessage } from '@/components/admin/monitoring/controls/ErrorMessage';

/**
 * Factory component that renders the appropriate component renderer based on component type
 * Enterprise-level implementation with comprehensive type support
 */
export const ComponentRendererFactory: React.FC<BaseComponentRendererProps> = ({
  component,
  darkMode = false,
  interactive = false,
  onClick,
  isSelected = false,
  deviceType = 'desktop',
}) => {
  const handleError = useErrorHandler('ComponentRendererFactory');

  if (!component) {
    const error = new Error('ComponentRendererFactory received null or undefined component');
    handleError(error);
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded">
        <ErrorMessage 
          title="Rendering Error" 
          message="Invalid component data provided"
        />
      </div>
    );
  }
  
  const componentType = component.type?.toLowerCase();
  if (!componentType) {
    const error = new Error(`Component without type detected: ${component.id}`);
    handleError(error);
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded">
        <ErrorMessage 
          title="Invalid Component" 
          message={`Component ID ${component.id || 'unknown'} has no type`}
        />
      </div>
    );
  }
  
  // Select the appropriate renderer based on component type
  try {
    // Define a shared error boundary to wrap all component renderers
    const renderWithErrorBoundary = (RendererComponent: React.FC<BaseComponentRendererProps>) => (
      <ErrorBoundary 
        fallback={
          <div className="p-4 border border-red-300 bg-red-50 rounded">
            <ErrorMessage 
              title={`Failed to render ${componentType}`} 
              message={`Component ID: ${component.id}`}
            />
          </div>
        }
      >
        <RendererComponent 
          component={component}
          darkMode={darkMode}
          interactive={interactive}
          onClick={onClick}
          isSelected={isSelected}
          deviceType={deviceType}
        />
      </ErrorBoundary>
    );

    switch(componentType) {
      case 'button':
        return renderWithErrorBoundary(ButtonComponentRenderer);
        
      case 'text':
      case 'paragraph':
      case 'heading':
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
      case 'label':
      case 'span':
        return renderWithErrorBoundary(TextComponentRenderer);
        
      case 'image':
      case 'img':
      case 'picture':
        return renderWithErrorBoundary(ImageComponentRenderer);
        
      case 'input':
      case 'textfield':
      case 'textarea':
      case 'select':
      case 'checkbox':
      case 'radio':
      case 'switch':
        return renderWithErrorBoundary(InputComponentRenderer);
        
      case 'card':
      case 'panel':
      case 'tile':
        return renderWithErrorBoundary(CardComponentRenderer);
        
      case 'list':
      case 'menu':
      case 'ul':
      case 'ol':
        return renderWithErrorBoundary(ListComponentRenderer);
        
      case 'icon':
      case 'svg':
        return renderWithErrorBoundary(IconComponentRenderer);
        
      case 'video':
      case 'player':
        return renderWithErrorBoundary(VideoComponentRenderer);
        
      case 'chart':
      case 'graph':
      case 'diagram':
        return renderWithErrorBoundary(ChartComponentRenderer);
        
      case 'form':
        return renderWithErrorBoundary(FormComponentRenderer);
        
      case 'container':
      case 'group':
      case 'box':
      case 'section':
      case 'div':
      default:
        // Use container renderer for container types and as fallback
        return renderWithErrorBoundary(ContainerComponentRenderer);
    }
  } catch (error) {
    handleError(error instanceof Error ? error : new Error(`Error rendering component of type ${componentType}`));
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded">
        <ErrorMessage 
          title={`Error rendering ${componentType}`} 
          message={error instanceof Error ? error.message : String(error)}
        />
      </div>
    );
  }
};

export default ComponentRendererFactory;
