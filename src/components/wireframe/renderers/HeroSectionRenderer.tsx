
import React from 'react';
import { SectionComponentProps } from '../types';
import { cn } from '@/lib/utils';

const HeroSectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
  isSelected = false,
  onClick
}) => {
  // Get copy suggestions from section or use defaults
  const title = section.copySuggestions?.heading || 'Powerful SaaS Solution';
  const subtitle = section.copySuggestions?.subheading || 'Streamline your workflow and boost productivity';
  const primaryCta = section.copySuggestions?.primaryCta || 'Get Started';
  const secondaryCta = section.copySuggestions?.secondaryCta || 'Learn More';

  // Determine layout style based on variant or device
  const isSplit = section.componentVariant === 'split';
  const isCentered = section.componentVariant === 'centered';
  const isFullWidth = section.componentVariant === 'full-width';
  const isMobile = deviceType === 'mobile';
  
  const handleClick = () => {
    if (onClick && section.id) {
      onClick(section.id);
    }
  };

  return (
    <div 
      className={cn(
        'hero-section w-full py-16 px-4',
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900',
        isSelected ? 'ring-2 ring-primary ring-offset-1' : '',
        viewMode === 'edit' ? 'cursor-pointer' : ''
      )}
      onClick={handleClick}
      style={{
        minHeight: isFullWidth ? '100vh' : isMobile ? 'auto' : '70vh',
        paddingTop: isMobile ? '4rem' : '6rem',
        paddingBottom: isMobile ? '4rem' : '6rem'
      }}
    >
      <div className="container mx-auto">
        <div className={cn(
          'flex flex-wrap items-center gap-8',
          isMobile ? 'flex-col text-center' : 
          isSplit ? 'md:flex-row justify-between' :
          'flex-col text-center justify-center items-center'
        )}>
          {/* Hero Content */}
          <div className={cn(
            'hero-content space-y-6',
            isMobile ? 'w-full' : 
            isSplit ? 'md:w-5/12' : 
            'md:w-3/4 max-w-3xl'
          )}>
            <h1 className={cn(
              'font-bold tracking-tight',
              isMobile ? 'text-3xl' : 'text-4xl md:text-5xl'
            )}>
              {title}
            </h1>
            
            <p className={cn(
              'text-lg',
              darkMode ? 'text-gray-300' : 'text-gray-600'
            )}>
              {subtitle}
            </p>
            
            <div className={cn(
              'flex gap-4 pt-4',
              isMobile || !isSplit ? 'justify-center' : 'justify-start'
            )}>
              <div className={cn(
                'px-6 py-3 rounded-md text-white font-medium',
                darkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'
              )}>
                {primaryCta}
              </div>
              <div className={cn(
                'px-6 py-3 rounded-md font-medium',
                darkMode ? 'border border-gray-300 text-gray-300' : 'border border-gray-300 text-gray-700'
              )}>
                {secondaryCta}
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          {(!isCentered || viewMode === 'preview') && (
            <div className={cn(
              'hero-image',
              isMobile ? 'w-full mt-8' : 
              isSplit ? 'md:w-6/12' : 
              'md:w-3/4 max-w-3xl mt-12'
            )}>
              <div className={cn(
                'aspect-video rounded-xl overflow-hidden',
                darkMode ? 'bg-gray-800' : 'bg-gray-100'
              )}>
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSectionRenderer;
