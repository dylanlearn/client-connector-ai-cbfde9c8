
import React from 'react';
import { cn } from '@/lib/utils';
import { SectionComponentProps } from '../types';

const PricingSectionRenderer: React.FC<SectionComponentProps> = ({
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
  
  const copySuggestions = section.copySuggestions || {};
  
  // Pricing plans
  const plans = [
    {
      name: copySuggestions.basicPlanName || 'Basic',
      price: copySuggestions.basicPlanPrice || '$9',
      period: copySuggestions.basicPlanPeriod || '/month',
      description: copySuggestions.basicPlanDescription || 'Perfect for individuals and small projects',
      features: [
        copySuggestions.basicFeature1 || 'Feature one',
        copySuggestions.basicFeature2 || 'Feature two',
        copySuggestions.basicFeature3 || 'Feature three',
        copySuggestions.basicFeature4 || 'Feature four'
      ],
      cta: copySuggestions.basicPlanCta || 'Get Started'
    },
    {
      name: copySuggestions.proPlanName || 'Professional',
      price: copySuggestions.proPlanPrice || '$29',
      period: copySuggestions.proPlanPeriod || '/month',
      description: copySuggestions.proPlanDescription || 'For professionals and growing teams',
      features: [
        copySuggestions.proFeature1 || 'Everything in Basic',
        copySuggestions.proFeature2 || 'Pro feature one',
        copySuggestions.proFeature3 || 'Pro feature two',
        copySuggestions.proFeature4 || 'Pro feature three',
        copySuggestions.proFeature5 || 'Pro feature four'
      ],
      cta: copySuggestions.proPlanCta || 'Get Started',
      highlighted: true
    },
    {
      name: copySuggestions.enterprisePlanName || 'Enterprise',
      price: copySuggestions.enterprisePlanPrice || '$99',
      period: copySuggestions.enterprisePlanPeriod || '/month',
      description: copySuggestions.enterprisePlanDescription || 'For large organizations and complex needs',
      features: [
        copySuggestions.enterpriseFeature1 || 'Everything in Professional',
        copySuggestions.enterpriseFeature2 || 'Enterprise feature one',
        copySuggestions.enterpriseFeature3 || 'Enterprise feature two',
        copySuggestions.enterpriseFeature4 || 'Enterprise feature three',
        copySuggestions.enterpriseFeature5 || 'Enterprise feature four'
      ],
      cta: copySuggestions.enterprisePlanCta || 'Contact Sales'
    }
  ];
  
  return (
    <div 
      className={cn(
        'px-6 py-16 w-full',
        darkMode ? 'bg-gray-800' : 'bg-white',
        isSelected && 'ring-2 ring-inset ring-primary',
        viewMode === 'flowchart' && 'border-2 border-dashed'
      )}
      onClick={handleClick}
      style={section.style}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={cn(
            'text-3xl font-bold mb-4',
            darkMode ? 'text-white' : 'text-gray-900'
          )}>
            {copySuggestions.heading || 'Simple, Transparent Pricing'}
          </h2>
          
          <p className={cn(
            'max-w-3xl mx-auto',
            darkMode ? 'text-gray-300' : 'text-gray-600'
          )}>
            {copySuggestions.subheading || 'Choose the plan that works best for you and your team.'}
          </p>
        </div>
        
        <div className={cn(
          'grid gap-8',
          deviceType === 'mobile' ? 'grid-cols-1' : 
          deviceType === 'tablet' ? 'grid-cols-2' : 
          'grid-cols-3'
        )}>
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={cn(
                'p-6 rounded-lg border',
                plan.highlighted && 'ring-2 ring-blue-500',
                darkMode ? 
                  plan.highlighted ? 'bg-gray-700 border-blue-500' : 'bg-gray-700 border-gray-600' : 
                  plan.highlighted ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
              )}
            >
              <h3 className={cn(
                'text-xl font-bold mb-2',
                darkMode ? 'text-white' : 'text-gray-900'
              )}>
                {plan.name}
              </h3>
              
              <div className="flex items-baseline mb-4">
                <span className={cn(
                  'text-4xl font-extrabold',
                  darkMode ? 'text-white' : 'text-gray-900'
                )}>
                  {plan.price}
                </span>
                <span className={cn(
                  'ml-1 text-lg',
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                )}>
                  {plan.period}
                </span>
              </div>
              
              <p className={cn(
                'mb-6',
                darkMode ? 'text-gray-300' : 'text-gray-600'
              )}>
                {plan.description}
              </p>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start">
                    <span className={cn(
                      'text-green-500 mr-2',
                      darkMode ? 'text-green-400' : 'text-green-500'
                    )}>
                      ✓
                    </span>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              <button className={cn(
                'w-full py-2 rounded-md font-medium',
                plan.highlighted ? 
                  'bg-blue-600 hover:bg-blue-700 text-white' : 
                  darkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              )}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSectionRenderer;
