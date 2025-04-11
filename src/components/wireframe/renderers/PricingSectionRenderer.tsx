
import React from 'react';
import { cn } from '@/lib/utils';
import { SectionComponentProps } from '../types';
import { getSuggestion, createStyleObject } from './utilities';

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
      onClick(section.id);
    }
  };
  
  // Pricing plan data
  const plans = [
    {
      name: getSuggestion(section.copySuggestions, 'plan1Name', 'Basic'),
      price: getSuggestion(section.copySuggestions, 'plan1Price', '$9'),
      period: getSuggestion(section.copySuggestions, 'plan1Period', '/month'),
      description: getSuggestion(section.copySuggestions, 'plan1Description', 'Perfect for individuals and small projects'),
      features: [
        getSuggestion(section.copySuggestions, 'plan1Feature1', '5 Projects'),
        getSuggestion(section.copySuggestions, 'plan1Feature2', '10GB Storage'),
        getSuggestion(section.copySuggestions, 'plan1Feature3', 'Basic Support'),
        getSuggestion(section.copySuggestions, 'plan1Feature4', 'Email Notifications'),
      ],
      cta: getSuggestion(section.copySuggestions, 'plan1Cta', 'Get Started'),
      popular: false
    },
    {
      name: getSuggestion(section.copySuggestions, 'plan2Name', 'Pro'),
      price: getSuggestion(section.copySuggestions, 'plan2Price', '$29'),
      period: getSuggestion(section.copySuggestions, 'plan2Period', '/month'),
      description: getSuggestion(section.copySuggestions, 'plan2Description', 'For professional users and growing teams'),
      features: [
        getSuggestion(section.copySuggestions, 'plan2Feature1', '20 Projects'),
        getSuggestion(section.copySuggestions, 'plan2Feature2', '50GB Storage'),
        getSuggestion(section.copySuggestions, 'plan2Feature3', 'Priority Support'),
        getSuggestion(section.copySuggestions, 'plan2Feature4', 'Advanced Analytics'),
        getSuggestion(section.copySuggestions, 'plan2Feature5', 'Team Collaboration'),
      ],
      cta: getSuggestion(section.copySuggestions, 'plan2Cta', 'Get Started'),
      popular: true
    },
    {
      name: getSuggestion(section.copySuggestions, 'plan3Name', 'Enterprise'),
      price: getSuggestion(section.copySuggestions, 'plan3Price', '$99'),
      period: getSuggestion(section.copySuggestions, 'plan3Period', '/month'),
      description: getSuggestion(section.copySuggestions, 'plan3Description', 'For large organizations with advanced needs'),
      features: [
        getSuggestion(section.copySuggestions, 'plan3Feature1', 'Unlimited Projects'),
        getSuggestion(section.copySuggestions, 'plan3Feature2', '500GB Storage'),
        getSuggestion(section.copySuggestions, 'plan3Feature3', 'Dedicated Support'),
        getSuggestion(section.copySuggestions, 'plan3Feature4', 'Custom Integrations'),
        getSuggestion(section.copySuggestions, 'plan3Feature5', 'Advanced Security'),
        getSuggestion(section.copySuggestions, 'plan3Feature6', 'SLA Guarantees'),
      ],
      cta: getSuggestion(section.copySuggestions, 'plan3Cta', 'Contact Sales'),
      popular: false
    }
  ];
  
  // Determine variant
  const variant = section.componentVariant || 'columns';
  
  // Create properly typed style object
  const styles = createStyleObject(section.style);
  
  return (
    <div 
      className={cn(
        'px-6 py-16 w-full',
        darkMode ? 'bg-gray-900' : 'bg-white',
        isSelected && 'ring-2 ring-inset ring-primary',
        viewMode === 'flowchart' && 'border-2 border-dashed'
      )}
      onClick={handleClick}
      style={styles}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={cn(
            'text-3xl font-bold mb-4',
            darkMode ? 'text-white' : 'text-gray-900'
          )}>
            {getSuggestion(section.copySuggestions, 'heading', 'Simple, Transparent Pricing')}
          </h2>
          
          <p className={cn(
            'max-w-3xl mx-auto',
            darkMode ? 'text-gray-300' : 'text-gray-600'
          )}>
            {getSuggestion(section.copySuggestions, 'subheading', 'Choose the plan that best fits your needs. All plans include a 14-day free trial.')}
          </p>
        </div>
        
        {/* Columns layout */}
        {variant === 'columns' && (
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
                  'rounded-lg overflow-hidden',
                  plan.popular && 'ring-2 ring-blue-500 ring-offset-2',
                  darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200',
                )}
              >
                {plan.popular && (
                  <div className={cn(
                    'bg-blue-600 text-white text-center py-2 font-medium',
                  )}>
                    Most Popular
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className={cn(
                    'text-xl font-bold mb-2',
                    darkMode ? 'text-white' : 'text-gray-900'
                  )}>
                    {plan.name}
                  </h3>
                  
                  <p className={cn(
                    'mb-4',
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    {plan.description}
                  </p>
                  
                  <div className="flex items-baseline mb-6">
                    <span className={cn(
                      'text-4xl font-bold',
                      darkMode ? 'text-white' : 'text-gray-900'
                    )}>
                      {plan.price}
                    </span>
                    <span className={cn(
                      'ml-1 text-gray-500',
                    )}>
                      {plan.period}
                    </span>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center">
                        <svg className={cn(
                          'h-5 w-5 mr-2',
                          darkMode ? 'text-blue-400' : 'text-blue-500'
                        )} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button className={cn(
                    'w-full py-2 px-4 rounded font-medium',
                    plan.popular ? 
                      'bg-blue-600 text-white hover:bg-blue-700' : 
                      darkMode ? 
                        'bg-gray-700 text-white hover:bg-gray-600' : 
                        'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  )}>
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Toggle variant (simplified) */}
        {variant === 'toggle' && (
          <div className="mb-8 text-center">
            <div className="inline-flex items-center bg-gray-200 rounded-full p-1">
              <button className="px-4 py-2 rounded-full bg-white shadow">Monthly</button>
              <button className="px-4 py-2 rounded-full">Yearly</button>
            </div>
            <p className={cn(
              'mt-2 text-sm',
              darkMode ? 'text-gray-400' : 'text-gray-600'
            )}>
              Save 20% with yearly billing
            </p>
          </div>
        )}
        
        {/* Additional note */}
        <div className="text-center mt-12">
          <p className={cn(
            'text-sm',
            darkMode ? 'text-gray-400' : 'text-gray-600'
          )}>
            {getSuggestion(section.copySuggestions, 'additionalNote', 'All plans include our core features. Need something custom? Contact our sales team.')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingSectionRenderer;
