
import React from 'react';
import { cn } from '@/lib/utils';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { getSuggestion } from '@/utils/copy-suggestions-helper';

interface WireframePreviewSectionProps {
  section: WireframeSection;
  darkMode?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  className?: string;
  style?: React.CSSProperties;
}

const WireframePreviewSection: React.FC<WireframePreviewSectionProps> = ({
  section,
  darkMode = false,
  deviceType = 'desktop',
  className,
  style
}) => {
  const sectionType = section.sectionType?.toLowerCase();
  const { layout } = section;
  
  // Process layout properties
  let layoutStyles: React.CSSProperties = {};
  let layoutClasses = '';
  
  if (layout) {
    // Handle layout whether it's a string or an object
    if (typeof layout === 'string') {
      // Simple layout string
      switch(layout) {
        case 'flex':
          layoutClasses = 'flex flex-col';
          break;
        case 'grid':
          layoutClasses = 'grid grid-cols-1';
          break;
        default:
          layoutClasses = '';
      }
    } else {
      // Complex layout object
      const layoutObj = layout;
      
      // Process layout type
      if (layoutObj.type) {
        switch (layoutObj.type) {
          case 'flex':
            layoutClasses = 'flex';
            
            // Direction
            layoutClasses += layoutObj.direction === 'horizontal' ? ' flex-row' : ' flex-col';
            
            // Wrapping
            if (layoutObj.wrap) {
              layoutClasses += ' flex-wrap';
            }
            
            // Alignment
            if (layoutObj.alignItems) {
              layoutStyles.alignItems = layoutObj.alignItems;
            }
            
            // Justify content
            if (layoutObj.justifyContent) {
              layoutStyles.justifyContent = layoutObj.justifyContent;
            }
            
            // Min height
            if (layoutObj.minHeight) {
              layoutStyles.minHeight = layoutObj.minHeight;
            }
            break;
            
          case 'grid':
            layoutClasses = 'grid';
            
            // Set grid columns
            if (typeof layoutObj.columns === 'number') {
              switch (deviceType) {
                case 'desktop':
                  layoutClasses += ` grid-cols-${layoutObj.columns}`;
                  break;
                case 'tablet':
                  const tabletColumns = Math.min(layoutObj.columns, 2);
                  layoutClasses += ` grid-cols-${tabletColumns}`;
                  break;
                case 'mobile':
                  layoutClasses += ' grid-cols-1';
                  break;
                default:
                  layoutClasses += ` grid-cols-${layoutObj.columns}`;
              }
            }
            
            // Grid gap
            if (layoutObj.gap) {
              layoutClasses += ` gap-${layoutObj.gap}`;
            }
            break;
            
          default:
            // No specific layout type
        }
      }
    }
  }
  
  // For grid layouts where columns are defined but needs responsiveness
  if (typeof layout === 'object' && layout && layout.type === 'grid') {
    if (layout.columns) {
      switch (deviceType) {
        case 'desktop':
          layoutClasses = `grid grid-cols-${layout.columns}`;
          break;
        case 'tablet':
          const tabletColumns = Math.min(Number(layout.columns), 2);
          layoutClasses = `grid grid-cols-${tabletColumns}`;
          break;
        case 'mobile':
          layoutClasses = 'grid grid-cols-1';
          break;
      }
    }
  }
  
  // Add spacing based on device type
  const spacingClass = deviceType === 'mobile' ? 'p-4' : deviceType === 'tablet' ? 'p-6' : 'p-8';
  
  return (
    <section
      className={cn(
        'wireframe-preview-section relative',
        spacingClass,
        layoutClasses,
        className,
        darkMode ? 'text-white' : 'text-gray-800'
      )}
      style={{
        ...layoutStyles,
        ...style,
        backgroundColor: section.backgroundColor || 'transparent'
      }}
    >
      {/* Section content - render based on section type */}
      {section.name && (
        <div className="text-xs absolute top-1 right-1 bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded">
          {section.name}
        </div>
      )}
      
      {/* Default content rendering */}
      {section.copySuggestions && (
        <div className="space-y-4 w-full">
          {getSuggestion(section.copySuggestions, 'heading') && (
            <h2 className={cn("text-2xl font-bold", deviceType === 'mobile' ? 'text-xl' : '')}>
              {getSuggestion(section.copySuggestions, 'heading')}
            </h2>
          )}
          
          {getSuggestion(section.copySuggestions, 'subheading') && (
            <p className="text-lg mb-4">
              {getSuggestion(section.copySuggestions, 'subheading')}
            </p>
          )}
        </div>
      )}
      
      {/* Placeholder for when no content is provided */}
      {(!section.copySuggestions && !section.components?.length) && (
        <div className="flex items-center justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded-md text-center h-32">
          <p className="text-gray-500 dark:text-gray-400">
            {section.sectionType || 'Section'} Content
          </p>
        </div>
      )}
    </section>
  );
};

export default WireframePreviewSection;
