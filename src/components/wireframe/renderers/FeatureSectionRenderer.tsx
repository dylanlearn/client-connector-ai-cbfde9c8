
import React from 'react';
import { SectionComponentProps } from '../types';
import { getBackgroundClass, getAlignmentClass } from '../utils/variant-utils';

const FeatureSectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
}) => {
  const { componentVariant, data = {} } = section;
  const {
    title,
    subtitle,
    features = [],
    columns = 3,
    backgroundStyle,
    alignment,
    mediaType
  } = data;
  
  // Style classes
  const backgroundClass = getBackgroundClass(backgroundStyle, darkMode);
  const alignmentClass = getAlignmentClass(alignment || 'center');
  
  // Grid columns based on specified count
  const gridCols = columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 
                   columns === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                   'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';

  return (
    <section className={`feature-section ${backgroundClass} py-16 px-4 sm:px-6 lg:px-8`}>
      <div className={`container mx-auto ${alignmentClass}`}>
        {(title || subtitle) && (
          <div className="section-header mb-12">
            {title && (
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">{title}</h2>
            )}
            
            {subtitle && (
              <p className="text-lg opacity-80 max-w-3xl mx-auto">{subtitle}</p>
            )}
          </div>
        )}
        
        <div className={`grid ${gridCols} gap-8`}>
          {features && features.map((feature, index) => (
            <div key={index} className="feature-card">
              {mediaType === 'icon' && feature.icon && (
                <div className="icon-container mb-4">
                  <div className="inline-flex items-center justify-center p-2 bg-primary-100 text-primary-600 rounded-lg">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                    </svg>
                  </div>
                </div>
              )}
              
              {mediaType === 'image' && feature.image && (
                <div className="image-container mb-4">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="h-32 w-auto mx-auto object-cover rounded-md"
                  />
                </div>
              )}
              
              {feature.badge && (
                <div className="badge mb-2">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                    {feature.badge}
                  </span>
                </div>
              )}
              
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              
              {feature.description && (
                <p className="opacity-80">{feature.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSectionRenderer;
