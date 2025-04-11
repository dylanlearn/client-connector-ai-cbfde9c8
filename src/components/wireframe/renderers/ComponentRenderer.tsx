import React from 'react';
import { SectionComponentProps } from '../types';
import { cn } from '@/lib/utils';

/**
 * Generic component renderer for wireframe sections
 * This component renders a section with a consistent structure across the application
 */
const ComponentRenderer: React.FC<SectionComponentProps> = ({
  section,
  darkMode,
  deviceType,
  viewMode = 'preview',
  isSelected = false,
  onClick = () => {},
}) => {
  // Determine background color based on section style or default to transparent
  const backgroundColor = section.style?.backgroundColor || 
                         section.backgroundColor || 
                         'transparent';
  
  // Apply text alignment from the section style
  const textAlign = section.style?.textAlign || section.textAlign || 'left';
  
  // Apply padding from section style
  const padding = section.style?.padding || section.padding || '2rem';
  
  // Apply gap for flex/grid containers
  const gap = section.style?.gap || section.gap || '1rem';
  
  // Determine if we should add dark mode styles
  const darkModeStyles = darkMode ? 
    'text-gray-100 bg-opacity-90 border-gray-700' : 
    'text-gray-900 bg-opacity-100 border-gray-200';

  // Apply responsive styles based on device type
  const deviceStyles = {
    desktop: 'p-8',
    tablet: 'p-6',
    mobile: 'p-4'
  };
  
  // Apply selection styles if this section is selected
  const selectionStyles = isSelected 
    ? 'ring-2 ring-primary ring-offset-2' 
    : '';

  return (
    <div
      id={`section-${section.id}`}
      role="region"
      aria-label={section.name}
      className={cn(
        'wireframe-section relative transition-all duration-200',
        darkModeStyles,
        deviceStyles[deviceType],
        selectionStyles,
        viewMode === 'flowchart' && 'border border-dashed border-gray-400'
      )}
      style={{
        backgroundColor,
        textAlign: textAlign as any,
        padding,
        gap,
        ...section.style
      }}
      onClick={() => onClick(section.id)}
      data-section-id={section.id}
      data-section-type={section.sectionType}
    >
      <div className="section-content">
        {/* Section name header - only visible in edit/flowchart modes */}
        {viewMode === 'flowchart' && (
          <div className="section-header text-sm font-medium bg-gray-100 dark:bg-gray-800 p-2 mb-4">
            {section.name} ({section.sectionType})
          </div>
        )}

        {/* Content area - render components based on data */}
        <div className="section-body">
          {/* Handle section with copySuggestions */}
          {section.copySuggestions && (
            <div className="space-y-4">
              {section.copySuggestions.heading && (
                <h2 className="text-2xl font-bold">{section.copySuggestions.heading}</h2>
              )}
              
              {section.copySuggestions.subheading && (
                <p className="text-lg">{section.copySuggestions.subheading}</p>
              )}
              
              {/* Other copy elements like CTA buttons, etc */}
              {section.copySuggestions.ctaText && (
                <button className="px-4 py-2 bg-primary text-white rounded-md">
                  {section.copySuggestions.ctaText}
                </button>
              )}
            </div>
          )}

          {/* Handle section with components array */}
          {section.components && section.components.length > 0 && (
            <div className="components-container flex flex-wrap gap-4">
              {section.components.map((component: any, index: number) => (
                <div key={component.id || index} className="component">
                  {/* Component content based on type */}
                  {component.type === 'text' && (
                    <div className="text-component" dangerouslySetInnerHTML={{ __html: component.content }} />
                  )}
                  {component.type === 'image' && (
                    <div className="image-component bg-gray-200 dark:bg-gray-700 rounded">
                      {component.src ? (
                        <img 
                          src={component.src} 
                          alt={component.alt || 'Image'} 
                          className="max-w-full h-auto" 
                        />
                      ) : (
                        <div className="placeholder-image flex items-center justify-center h-40">
                          {component.alt || 'Image Placeholder'}
                        </div>
                      )}
                    </div>
                  )}
                  {component.type === 'button' && (
                    <button className="px-4 py-2 bg-primary text-white rounded-md">
                      {component.content || 'Button'}
                    </button>
                  )}
                  {/* Fallback for other component types */}
                  {!['text', 'image', 'button'].includes(component.type) && (
                    <div className="generic-component">
                      {component.content || `${component.type} Component`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Fallback content if no components or copy */}
          {(!section.components || section.components.length === 0) && !section.copySuggestions && (
            <div className="section-placeholder text-center p-6 bg-gray-100 dark:bg-gray-800 rounded">
              <p className="text-gray-500 dark:text-gray-400">
                {section.sectionType} Section
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                No content defined
              </p>
            </div>
          )}
        </div>

        {/* Bottom indicator for selection - only visible when selected */}
        {isSelected && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
        )}
      </div>
    </div>
  );
};

export default ComponentRenderer;
