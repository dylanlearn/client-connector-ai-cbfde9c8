
import React from 'react';
import { SectionComponentProps } from '../types';
import { getBackgroundClass, getAlignmentClass } from '../utils/variant-utils';

const PricingSectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
}) => {
  const { componentVariant, data = {} } = section;
  const {
    title,
    description,
    plans = [],
    mediaType,
    backgroundStyle,
    alignment
  } = data;
  
  // Style classes
  const backgroundClass = getBackgroundClass(backgroundStyle, darkMode);
  const alignmentClass = getAlignmentClass(alignment || 'center');

  return (
    <section className={`pricing-section ${backgroundClass} py-16 px-4 sm:px-6 lg:px-8`}>
      <div className={`container mx-auto ${alignmentClass}`}>
        {(title || description) && (
          <div className="section-header mb-12">
            {title && (
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">{title}</h2>
            )}
            
            {description && (
              <p className="text-lg opacity-80 max-w-3xl mx-auto">{description}</p>
            )}
          </div>
        )}
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const isPopular = plan.badge === 'Most Popular';
            
            return (
              <div 
                key={index}
                className={`pricing-card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border ${
                  isPopular ? 'border-primary' : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {plan.badge && (
                  <div className="badge mb-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      isPopular ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      {plan.badge}
                    </span>
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                
                {plan.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{plan.description}</p>
                )}
                
                <div className="price-container my-6">
                  <span className="text-3xl font-bold">{plan.price}</span>
                </div>
                
                {plan.features && plan.features.length > 0 && (
                  <ul className="features-list space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                {plan.cta && (
                  <a 
                    href={plan.cta.url} 
                    className={`block w-full py-2 px-4 text-center rounded-md font-medium ${
                      isPopular 
                        ? 'bg-primary hover:bg-primary-600 text-white' 
                        : 'border border-primary text-primary hover:bg-primary-50'
                    }`}
                  >
                    {plan.cta.label}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSectionRenderer;
