
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
      onClick();
    }
  };
  
  // Plans with getSuggestion utility
  const plans = [
    {
      name: getSuggestion(section.copySuggestions, 'basicPlanName', 'Basic'),
      price: getSuggestion(section.copySuggestions, 'basicPlanPrice', '$9'),
      period: getSuggestion(section.copySuggestions, 'basicPlanPeriod', '/month'),
      description: getSuggestion(section.copySuggestions, 'basicPlanDescription', 'Perfect for individuals and small teams getting started.'),
      features: [
        getSuggestion(section.copySuggestions, 'basicFeature1', 'Up to 5 users'),
        getSuggestion(section.copySuggestions, 'basicFeature2', '10GB storage'),
        getSuggestion(section.copySuggestions, 'basicFeature3', 'Basic support'),
        getSuggestion(section.copySuggestions, 'basicFeature4', 'Standard features'),
      ],
      cta: getSuggestion(section.copySuggestions, 'basicPlanCta', 'Get Started'),
      highlight: false,
    },
    {
      name: getSuggestion(section.copySuggestions, 'proPlanName', 'Professional'),
      price: getSuggestion(section.copySuggestions, 'proPlanPrice', '$29'),
      period: getSuggestion(section.copySuggestions, 'proPlanPeriod', '/month'),
      description: getSuggestion(section.copySuggestions, 'proPlanDescription', 'Great for growing teams that need more capabilities.'),
      features: [
        getSuggestion(section.copySuggestions, 'proFeature1', 'Up to 20 users'),
        getSuggestion(section.copySuggestions, 'proFeature2', '100GB storage'),
        getSuggestion(section.copySuggestions, 'proFeature3', 'Priority support'),
        getSuggestion(section.copySuggestions, 'proFeature4', 'Advanced features'),
        getSuggestion(section.copySuggestions, 'proFeature5', 'Analytics dashboard'),
      ],
      cta: getSuggestion(section.copySuggestions, 'proPlanCta', 'Start Free Trial'),
      highlight: true,
    },
    {
      name: getSuggestion(section.copySuggestions, 'enterprisePlanName', 'Enterprise'),
      price: getSuggestion(section.copySuggestions, 'enterprisePlanPrice', '$99'),
      period: getSuggestion(section.copySuggestions, 'enterprisePlanPeriod', '/month'),
      description: getSuggestion(section.copySuggestions, 'enterprisePlanDescription', 'For large organizations with advanced requirements.'),
      features: [
        getSuggestion(section.copySuggestions, 'enterpriseFeature1', 'Unlimited users'),
        getSuggestion(section.copySuggestions, 'enterpriseFeature2', '1TB storage'),
        getSuggestion(section.copySuggestions, 'enterpriseFeature3', 'Dedicated support'),
        getSuggestion(section.copySuggestions, 'enterpriseFeature4', 'Premium features'),
        getSuggestion(section.copySuggestions, 'enterpriseFeature5', 'Custom integrations'),
      ],
      cta: getSuggestion(section.copySuggestions, 'enterprisePlanCta', 'Contact Sales'),
      highlight: false,
    },
  ];
  
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
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={cn(
            'text-3xl font-bold mb-4',
            darkMode ? 'text-white' : 'text-gray-900'
          )}>
            {getSuggestion(section.copySuggestions, 'heading', 'Pricing Plans')}
          </h2>
          
          <p className={cn(
            'max-w-3xl mx-auto',
            darkMode ? 'text-gray-300' : 'text-gray-600'
          )}>
            {getSuggestion(section.copySuggestions, 'subheading', 'Choose the perfect plan for your needs. All plans include a 14-day free trial.')}
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
                darkMode 
                  ? plan.highlight ? 'bg-blue-900 border-blue-700' : 'bg-gray-800 border-gray-700'
                  : plan.highlight ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200',
                plan.highlight && 'shadow-lg transform scale-105'
              )}
            >
              <h3 className={cn(
                'text-xl font-bold mb-2',
                darkMode ? 'text-white' : 'text-gray-900'
              )}>
                {plan.name}
              </h3>
              
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{plan.period}</span>
              </div>
              
              <p className={cn(
                'mb-6',
                darkMode ? 'text-gray-300' : 'text-gray-600'
              )}>
                {plan.description}
              </p>
              
              <ul className="mb-6 space-y-2">
                {plan.features.map((feature, j) => (
                  <li 
                    key={j}
                    className={cn(
                      'flex items-start',
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    )}
                  >
                    <span className="mr-2">✓</span> {feature}
                  </li>
                ))}
              </ul>
              
              <button 
                className={cn(
                  'w-full py-3 rounded-md font-medium',
                  plan.highlight
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : darkMode
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                )}
              >
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
