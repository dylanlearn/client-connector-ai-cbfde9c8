
import React from 'react';
import { SectionComponentProps } from '../types';
import { getSuggestion } from '@/utils/copy-suggestions-helper';

const HeroSectionRenderer: React.FC<SectionComponentProps> = ({ 
  section, 
  darkMode = false, 
  deviceType = 'desktop',
  isSelected = false,
  onClick 
}) => {
  const style = section.style || {};
  const copySuggestions = section.copySuggestions || {};
  
  const heroClasses = `hero-section w-full p-8 ${isSelected ? 'ring-2 ring-primary' : ''}`;
  
  const renderHeroContent = () => (
    <div className="container mx-auto">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
          {getSuggestion(copySuggestions, 'heading') || 'Hero Heading Goes Here'}
        </h1>
        
        <p className="text-xl opacity-80">
          {getSuggestion(copySuggestions, 'subheading') || 'This is a wireframe hero section. Add your compelling subheading here.'}
        </p>
        
        {getSuggestion(copySuggestions, 'ctaText') && (
          <div className="flex justify-center gap-4 mt-8">
            <button 
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
            >
              {getSuggestion(copySuggestions, 'ctaText')}
            </button>
            
            {getSuggestion(copySuggestions, 'secondaryCta') && (
              <button 
                className="px-6 py-3 bg-transparent border border-current font-medium rounded-md"
              >
                {getSuggestion(copySuggestions, 'secondaryCta')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
  
  const heroStyle: React.CSSProperties = {
    backgroundColor: style.backgroundColor || (darkMode ? '#111827' : '#ffffff'),
    color: style.color || (darkMode ? '#ffffff' : '#111827'),
    ...style
  };
  
  return (
    <div 
      className={heroClasses}
      style={heroStyle}
      onClick={onClick}
      data-section-id={section.id}
      data-testid="hero-section"
    >
      {renderHeroContent()}
    </div>
  );
};

export default HeroSectionRenderer;
