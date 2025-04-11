
import React from 'react';
import { SectionComponentProps } from '../types';
import { cn } from '@/lib/utils';

const FeaturesSectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  darkMode,
  viewMode,
  deviceType,
  isSelected,
  onClick,
}) => {
  // Extract features from section data with fallbacks for production readiness
  const features = section.data?.features || [];
  const heading = section.data?.heading || 'Feature Highlights';
  const subheading = section.data?.subheading || 'Discover what makes us different';
  
  // Get section styling with fallbacks
  const sectionStyle = section.style || {};
  const backgroundColor = sectionStyle.backgroundColor || (darkMode ? '#1f2937' : '#ffffff');
  const textColor = sectionStyle.textColor || (darkMode ? '#ffffff' : '#111827');
  
  // Handle section click
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <div
      className={cn(
        'wireframe-section features-section py-12 md:py-16 px-4',
        {
          'border-2 border-blue-500': isSelected,
          'dark': darkMode,
        }
      )}
      style={{
        backgroundColor,
        color: textColor,
      }}
      onClick={handleClick}
      data-section-id={section.id}
      data-section-type={section.sectionType}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={cn(
            'text-2xl md:text-3xl lg:text-4xl font-bold mb-4',
            { 'text-white': darkMode }
          )}>
            {heading}
          </h2>
          <p className={cn(
            'text-lg opacity-80 max-w-3xl mx-auto',
            { 'text-gray-300': darkMode, 'text-gray-600': !darkMode }
          )}>
            {subheading}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.length > 0 ? features.map((feature: any, index: number) => (
            <div key={feature.id || `feature-${index}`} className={cn(
              'feature-item p-6 rounded-lg',
              { 'bg-gray-800': darkMode, 'bg-gray-50': !darkMode }
            )}>
              {feature.icon && (
                <div className="icon-container h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                  <span className="text-xl">{feature.icon}</span>
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2">{feature.title || `Feature ${index + 1}`}</h3>
              <p className={cn(
                'opacity-80',
                { 'text-gray-300': darkMode, 'text-gray-600': !darkMode }
              )}>
                {feature.description || 'Feature description placeholder'}
              </p>
            </div>
          )) : (
            // Display placeholder features if none are defined
            Array.from({ length: 3 }).map((_, index) => (
              <div key={`placeholder-feature-${index}`} className={cn(
                'feature-item p-6 rounded-lg',
                { 'bg-gray-800': darkMode, 'bg-gray-50': !darkMode }
              )}>
                <div className="icon-container h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                  <span className="text-xl">✦</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Feature {index + 1}</h3>
                <p className={cn(
                  'opacity-80',
                  { 'text-gray-300': darkMode, 'text-gray-600': !darkMode }
                )}>
                  This is a sample feature description. Replace with your actual feature details.
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSectionRenderer;
