
import React from 'react';
import { cn } from '@/lib/utils';
import { SectionComponentProps } from '../types';
import { getSuggestion, createStyleObject } from './utilities';

const CTASectionRenderer: React.FC<SectionComponentProps> = ({
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
  
  // Use the createStyleObject utility to ensure type safety
  const styles = createStyleObject(section.style);
  
  return (
    <div 
      className={cn(
        'px-6 py-16 w-full',
        darkMode ? 'bg-blue-900' : 'bg-blue-600',
        isSelected && 'ring-2 ring-inset ring-primary',
        viewMode === 'flowchart' && 'border-2 border-dashed'
      )}
      onClick={handleClick}
      style={styles}
    >
      <div className={cn(
        'max-w-4xl mx-auto text-center',
        deviceType === 'mobile' ? 'px-4' : 'px-8'
      )}>
        <h2 className="text-white text-3xl font-bold mb-6">
          {getSuggestion(section.copySuggestions, 'heading', 'Ready to Get Started?')}
        </h2>
        
        <p className="text-blue-100 text-lg mb-8">
          {getSuggestion(section.copySuggestions, 'subheading', 'Join thousands of satisfied customers using our product today.')}
        </p>
        
        <div className={cn(
          'flex gap-4 justify-center',
          deviceType === 'mobile' && 'flex-col'
        )}>
          <button className="px-8 py-3 bg-white text-blue-600 rounded-md font-medium hover:bg-blue-50">
            {getSuggestion(section.copySuggestions, 'primaryCta', 'Get Started')}
          </button>
          
          <button className="px-8 py-3 bg-transparent border border-white text-white rounded-md font-medium hover:bg-blue-800">
            {getSuggestion(section.copySuggestions, 'secondaryCta', 'Learn More')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CTASectionRenderer;
