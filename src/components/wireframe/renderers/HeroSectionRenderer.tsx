
import React from 'react';
import { cn } from '@/lib/utils';
import { SectionComponentProps } from '../types';
import { getSuggestion, createStyleObject } from './utilities';

const HeroSectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
  isSelected = false,
  onClick
}) => {
  const handleClick = () => {
    if (onClick && section.id) {
      onClick();
    }
  };
  
  // Create a properly typed style object
  const styleBase: Record<string, any> = {
    minHeight: 'min(600px, 60vh)',
    ...(section.style || {})
  };
  
  const styles = createStyleObject(styleBase);
  
  return (
    <div 
      className={cn(
        'px-6 py-20 w-full flex flex-col items-center text-center',
        darkMode ? 'bg-gray-900' : 'bg-gray-100',
        isSelected && 'ring-2 ring-inset ring-primary',
        viewMode === 'flowchart' && 'border-2 border-dashed'
      )}
      onClick={handleClick}
      style={styles}
    >
      <div className={cn(
        'max-w-4xl mx-auto',
        deviceType === 'mobile' ? 'px-4' : 'px-8'
      )}>
        <h1 className={cn(
          'text-4xl md:text-5xl lg:text-6xl font-bold mb-6',
          deviceType === 'mobile' && 'text-3xl'
        )}>
          {getSuggestion(section.copySuggestions, 'heading', section.name || 'Compelling Headline')}
        </h1>
        
        <p className={cn(
          'text-lg md:text-xl mb-8 mx-auto',
          darkMode ? 'text-gray-300' : 'text-gray-600',
          deviceType === 'mobile' && 'text-base'
        )}>
          {getSuggestion(section.copySuggestions, 'subheading', 'Supporting subtitle text that expands on the headline and connects with your audience.')}
        </p>
        
        <div className={cn(
          'flex gap-4 justify-center',
          deviceType === 'mobile' && 'flex-col'
        )}>
          <button className={cn(
            'px-6 py-3 rounded-md font-medium',
            darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
          )}>
            {getSuggestion(section.copySuggestions, 'primaryCta', 'Primary Action')}
          </button>
          
          <button className={cn(
            'px-6 py-3 rounded-md font-medium',
            darkMode ? 'bg-transparent border border-gray-300 text-gray-300' : 'bg-white border border-gray-300 text-gray-700'
          )}>
            {getSuggestion(section.copySuggestions, 'secondaryCta', 'Secondary Action')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionRenderer;
