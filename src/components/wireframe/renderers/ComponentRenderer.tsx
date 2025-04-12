
import React from 'react';
import { SectionComponentProps } from '../types';
import { cn } from '@/lib/utils';

/**
 * Default component renderer for sections without a specific renderer
 */
const ComponentRenderer: React.FC<SectionComponentProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
  isSelected = false,
  onClick
}) => {
  const handleClick = () => {
    if (onClick && section.id) {
      onClick(section.id);
    }
  };

  // Extract section properties or use defaults
  const sectionName = section.name || 'Section';
  const sectionType = section.sectionType || 'content';
  const sectionDescription = section.description || 'Section description';
  
  return (
    <div 
      className={cn(
        'component-section w-full py-12 px-4',
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900',
        isSelected ? 'ring-2 ring-primary ring-offset-1' : '',
        viewMode === 'edit' ? 'cursor-pointer' : ''
      )}
      onClick={handleClick}
    >
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-3">{sectionName}</h2>
          <p className={cn(
            'text-lg mx-auto max-w-2xl',
            darkMode ? 'text-gray-300' : 'text-gray-600'
          )}>
            {sectionDescription}
          </p>
          <div className={cn(
            'text-sm mt-2 py-1 px-3 rounded-full inline-flex items-center',
            darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
          )}>
            <span>{sectionType} section</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-transparent via-gray-200 to-transparent h-px w-full my-8" />
        
        <div className={cn(
          'border-2 border-dashed rounded-lg p-8 flex items-center justify-center min-h-[200px]',
          darkMode ? 'border-gray-700' : 'border-gray-300'
        )}>
          <div className="text-center">
            <div className={cn(
              'text-4xl font-light mb-4',
              darkMode ? 'text-gray-400' : 'text-gray-400'
            )}>
              {sectionName} Content
            </div>
            <p className={cn(
              darkMode ? 'text-gray-500' : 'text-gray-500'
            )}>
              Content for this section will be rendered here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentRenderer;
