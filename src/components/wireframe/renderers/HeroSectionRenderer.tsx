
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
      onClick(section.id);
    }
  };
  
  // Create properly typed style object
  const styles = createStyleObject(section.style);
  
  // Get a background image if available
  const backgroundImage = section.style?.backgroundImage || '';
  
  // Determine component variant (default to centered)
  const variant = section.componentVariant || 'centered';
  
  return (
    <div 
      className={cn(
        'hero-section w-full py-16',
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900',
        isSelected && 'ring-2 ring-inset ring-primary',
        viewMode === 'flowchart' && 'border-2 border-dashed'
      )}
      onClick={handleClick}
      style={{
        ...styles,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: backgroundImage ? 'cover' : undefined,
        backgroundPosition: backgroundImage ? 'center' : undefined,
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div className={cn(
        'container mx-auto px-4',
        variant === 'centered' && 'text-center',
        variant === 'split' && 'grid grid-cols-1 md:grid-cols-2 gap-8 items-center'
      )}>
        <div className="hero-content max-w-3xl mx-auto">
          <h1 className={cn(
            'text-4xl md:text-5xl font-bold mb-4',
            darkMode ? 'text-white' : 'text-gray-900'
          )}>
            {getSuggestion(section.copySuggestions, 'heading', 'Build Your Next Great Project')}
          </h1>
          
          <p className={cn(
            'text-xl mb-8',
            darkMode ? 'text-gray-300' : 'text-gray-600'
          )}>
            {getSuggestion(section.copySuggestions, 'subheading', 'Create beautiful, responsive designs with our intuitive platform.')}
          </p>
          
          <div className={cn(
            'space-x-4',
            deviceType === 'mobile' && 'space-x-0 space-y-4 flex flex-col',
            variant === 'centered' ? 'justify-center' : 'justify-start',
            variant !== 'centered' && deviceType !== 'mobile' && 'flex'
          )}>
            <button className={cn(
              'px-6 py-2 rounded-md font-medium',
              darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white',
              deviceType === 'mobile' && 'w-full'
            )}>
              {getSuggestion(section.copySuggestions, 'primaryCta', 'Get Started')}
            </button>
            
            <button className={cn(
              'px-6 py-2 rounded-md font-medium',
              darkMode ? 'border border-white hover:bg-white hover:text-gray-900' : 'border border-blue-600 text-blue-600 hover:bg-blue-50',
              deviceType === 'mobile' && 'w-full'
            )}>
              {getSuggestion(section.copySuggestions, 'secondaryCta', 'Learn More')}
            </button>
          </div>
        </div>
        
        {/* Add image for split layout */}
        {variant === 'split' && (
          <div className="hero-image">
            <div className={cn(
              'aspect-video rounded-lg',
              darkMode ? 'bg-gray-800' : 'bg-gray-200'
            )}>
              {/* Placeholder for actual image */}
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-500">Hero Image</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSectionRenderer;
