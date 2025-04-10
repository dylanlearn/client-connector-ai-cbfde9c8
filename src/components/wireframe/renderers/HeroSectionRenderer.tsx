
import React from 'react';
import { cn } from '@/lib/utils';
import { SectionComponentProps } from '../types';
import { Button } from '@/components/ui/button';
import { Image } from 'lucide-react';
import { getSuggestion, createStyleObject } from './utilities';

export const HeroSectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
  isSelected = false,
  onClick
}) => {
  // Extract image component if it exists
  const imageComponent = section.components?.find(c => c.type === 'image' || c.type === 'hero-image');
  const headingComponent = section.components?.find(c => c.type === 'heading' || c.type === 'hero-heading');
  const subheadingComponent = section.components?.find(c => c.type === 'subheading' || c.type === 'hero-subheading');
  const ctaComponent = section.components?.find(c => c.type === 'button' || c.type === 'cta');
  
  // Handle click event
  const handleClick = () => {
    if (onClick) onClick();
  };
  
  const getHeadingText = () => {
    if (headingComponent?.content) {
      return typeof headingComponent.content === 'string' 
        ? headingComponent.content 
        : 'Powerful Heading That Converts';
    }
    
    return getSuggestion(section.copySuggestions, 'heading', 'Powerful Heading That Converts');
  };
  
  const getSubheadingText = () => {
    if (subheadingComponent?.content) {
      return typeof subheadingComponent.content === 'string' 
        ? subheadingComponent.content 
        : 'A brief description of your product or service that clearly communicates your value proposition.';
    }
    
    return getSuggestion(section.copySuggestions, 'subheading', 
      'A brief description of your product or service that clearly communicates your value proposition.');
  };
  
  const getCtaText = () => {
    if (ctaComponent?.content) {
      return typeof ctaComponent.content === 'string' ? ctaComponent.content : 'Get Started';
    }
    
    return getSuggestion(section.copySuggestions, 'cta', 'Get Started');
  };
  
  const getBackgroundStyle = () => {
    // Start with section.style or an empty object
    const style = section.style || {};
    
    if (section.backgroundColor) {
      return { ...style, backgroundColor: section.backgroundColor };
    }
    
    return style;
  };
  
  const imageUrl = imageComponent?.url || 
    imageComponent?.src || 
    'https://via.placeholder.com/800x500?text=Hero+Image';
  
  return (
    <div
      className={cn(
        'hero-section w-full',
        deviceType === 'mobile' ? 'py-10' : 'py-16',
        isSelected ? 'ring-2 ring-primary ring-inset' : '',
        darkMode ? 'bg-gray-900 text-white' : 'bg-background text-foreground'
      )}
      style={getBackgroundStyle()}
      onClick={handleClick}
      data-section-id={section.id}
    >
      <div className="container px-4 mx-auto">
        <div className={cn(
          'flex flex-col items-center text-center',
          deviceType === 'desktop' ? 'gap-8' : 'gap-6'
        )}>
          <h1 className={cn(
            'font-bold tracking-tight',
            deviceType === 'desktop' ? 'text-5xl md:text-6xl' : 'text-4xl',
            darkMode ? 'text-white' : 'text-foreground'
          )}>
            {getHeadingText()}
          </h1>
          
          <p className={cn(
            'text-xl max-w-3xl mx-auto',
            darkMode ? 'text-gray-300' : 'text-muted-foreground'
          )}>
            {getSubheadingText()}
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center mt-2">
            <Button size={deviceType === 'mobile' ? 'sm' : 'lg'} className="px-8">
              {getCtaText()}
            </Button>
            
            <Button 
              size={deviceType === 'mobile' ? 'sm' : 'lg'} 
              variant="outline"
              className="px-8"
            >
              Learn More
            </Button>
          </div>
          
          {viewMode === 'preview' && (
            <div className="mt-8 w-full max-w-4xl mx-auto overflow-hidden rounded-xl shadow-lg">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="Hero visual" 
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <Image className="w-16 h-16 text-muted-foreground/50" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSectionRenderer;
