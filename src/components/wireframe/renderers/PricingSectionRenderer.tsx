
import React from 'react';
import { SectionComponentProps } from '../types';
import { cn } from '@/lib/utils';

const PricingSectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  darkMode,
  viewMode,
  deviceType,
  isSelected,
  onClick,
}) => {
  // Extract pricing plans from section data with fallbacks
  const plans = section.data?.plans || [];
  const heading = section.data?.heading || 'Simple, Transparent Pricing';
  const subheading = section.data?.subheading || 'Choose the plan that works best for you';
  
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
        'wireframe-section pricing-section py-12 md:py-16 px-4',
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
          {plans.length > 0 ? plans.map((plan: any, index: number) => {
            const isPopular = plan.isPopular || plan.popular || false;
            
            return (
              <div key={plan.id || `plan-${index}`} className={cn(
                'pricing-plan relative p-6 rounded-lg border',
                {
                  'border-blue-500 shadow-lg': isPopular,
                  'border-gray-300': !isPopular && !darkMode,
                  'border-gray-700': !isPopular && darkMode,
                  'bg-gray-800': darkMode,
                  'bg-white': !darkMode,
                }
              )}>
                {isPopular && (
                  <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-3">
                    <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Popular
                    </div>
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-2">{plan.name || `Plan ${index + 1}`}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price || `$${(index + 1) * 10}`}</span>
                  <span className="text-sm opacity-70">{plan.billingPeriod || '/month'}</span>
                </div>
                <p className="mb-6 opacity-80">{plan.description || 'Plan description placeholder'}</p>
                
                <ul className="space-y-3 mb-8">
                  {(plan.features || []).map((feature: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-600 mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                  
                  {/* Display placeholder features if none are defined */}
                  {(!plan.features || plan.features.length === 0) && (
                    Array.from({ length: 4 }).map((_, i) => (
                      <li key={i} className="flex items-start">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-600 mr-2">✓</span>
                        <span>Feature {i + 1} included</span>
                      </li>
                    ))
                  )}
                </ul>
                
                <button className={cn(
                  'w-full py-3 px-4 rounded-lg font-medium',
                  {
                    'bg-blue-600 text-white hover:bg-blue-700': isPopular,
                    'bg-gray-200 text-gray-800 hover:bg-gray-300': !isPopular && !darkMode,
                    'bg-gray-700 text-white hover:bg-gray-600': !isPopular && darkMode,
                  }
                )}>
                  {plan.ctaText || 'Get Started'}
                </button>
              </div>
            );
          }) : (
            // Display placeholder plans if none are defined
            ['Basic', 'Pro', 'Enterprise'].map((planName, index) => {
              const isPopular = index === 1; // Make the middle plan popular by default
              
              return (
                <div key={`placeholder-plan-${index}`} className={cn(
                  'pricing-plan relative p-6 rounded-lg border',
                  {
                    'border-blue-500 shadow-lg': isPopular,
                    'border-gray-300': !isPopular && !darkMode,
                    'border-gray-700': !isPopular && darkMode,
                    'bg-gray-800': darkMode,
                    'bg-white': !darkMode,
                  }
                )}>
                  {isPopular && (
                    <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-3">
                      <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Popular
                      </div>
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold mb-2">{planName}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">${(index + 1) * 10}</span>
                    <span className="text-sm opacity-70">/month</span>
                  </div>
                  <p className="mb-6 opacity-80">
                    {index === 0 && "Perfect for individuals and small projects"}
                    {index === 1 && "Ideal for growing businesses and teams"}
                    {index === 2 && "Advanced features for large organizations"}
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    {Array.from({ length: 4 + index }).map((_, i) => (
                      <li key={i} className="flex items-start">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-600 mr-2">✓</span>
                        <span>Feature {i + 1} included</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button className={cn(
                    'w-full py-3 px-4 rounded-lg font-medium',
                    {
                      'bg-blue-600 text-white hover:bg-blue-700': isPopular,
                      'bg-gray-200 text-gray-800 hover:bg-gray-300': !isPopular && !darkMode,
                      'bg-gray-700 text-white hover:bg-gray-600': !isPopular && darkMode,
                    }
                  )}>
                    Get Started
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingSectionRenderer;
