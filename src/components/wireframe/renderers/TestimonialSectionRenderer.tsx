
import React from 'react';
import { cn } from '@/lib/utils';
import { SectionComponentProps } from '../types';
import { getSuggestion, createStyleObject } from './utilities';

const TestimonialSectionRenderer: React.FC<SectionComponentProps> = ({
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
  
  // Create properly typed style object
  const styles = createStyleObject(section.style);
  
  return (
    <div 
      className={cn(
        'px-6 py-16 w-full',
        darkMode ? 'bg-gray-900' : 'bg-gray-100',
        isSelected && 'ring-2 ring-inset ring-primary',
        viewMode === 'flowchart' && 'border-2 border-dashed'
      )}
      onClick={handleClick}
      style={styles}
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="text-yellow-500 mb-4 text-3xl">★★★★★</div>
        
        <blockquote>
          <p className={cn(
            'text-xl md:text-2xl italic mb-6',
            darkMode ? 'text-white' : 'text-gray-800'
          )}>
            "{getSuggestion(section.copySuggestions, 'quote', 'This product has completely transformed our business operations. The intuitive interface and powerful features have improved our efficiency by over 40%. I wish we had found it sooner!')}"
          </p>
          
          <footer>
            <div className="flex justify-center items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-300 mr-4"></div>
              <div className="text-left">
                <p className={cn(
                  'font-semibold',
                  darkMode ? 'text-white' : 'text-gray-900'
                )}>
                  {getSuggestion(section.copySuggestions, 'author', 'Sarah Johnson')}
                </p>
                <p className={cn(
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {getSuggestion(section.copySuggestions, 'position', 'CEO at TechCorp')}
                </p>
              </div>
            </div>
          </footer>
        </blockquote>
      </div>
    </div>
  );
};

export default TestimonialSectionRenderer;
