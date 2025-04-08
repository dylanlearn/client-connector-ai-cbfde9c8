
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan: any, index: number) => (
            <div 
              key={index}
              className={`pricing-plan rounded-lg p-6 ${
                plan.featured 
                  ? 'border-2 border-primary shadow-lg' 
                  : 'border border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.badge && (
                <div className="inline-block px-3 py-1 text-xs font-semibold bg-primary text-white rounded-full mb-4">
                  {plan.badge}
                </div>
              )}
              
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              
              <div className="price-container mb-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.interval && (
                  <span className="text-sm opacity-80">/{plan.interval}</span>
                )}
              </div>
              
              {plan.description && (
                <p className="mb-6 opacity-80">{plan.description}</p>
              )}
              
              <ul className="space-y-2 mb-6">
                {plan.features?.map((feature: string, i: number) => (
                  <li key={i} className="flex items-center">
                    <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              {plan.cta && (
                <a 
                  href={plan.cta.url || '#'}
                  className={`block w-full py-2 px-4 text-center rounded-md ${
                    plan.featured
                      ? 'bg-primary hover:bg-primary-600 text-white'
                      : 'border border-primary text-primary hover:bg-primary hover:text-white'
                  }`}
                >
                  {plan.cta.label || 'Choose Plan'}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSectionRenderer;
