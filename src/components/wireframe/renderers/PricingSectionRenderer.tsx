
import React from 'react';
import { SectionComponentProps } from '../types';
import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';

const PricingSectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
  isSelected = false,
  onClick
}) => {
  // Get copy suggestions or defaults
  const heading = section.copySuggestions?.heading || 'Simple, Transparent Pricing';
  const subheading = section.copySuggestions?.subheading || 'Choose the plan that best fits your needs. All plans include a 14-day free trial.';
  
  // Get components or create defaults
  const pricingCards = section.components?.filter(c => c.type === 'pricing-card') || [
    {
      props: {
        planName: "Basic",
        price: "$19",
        period: "per month",
        features: ["Feature 1", "Feature 2", "Feature 3"],
        cta: "Get Started",
        highlighted: false
      }
    },
    {
      props: {
        planName: "Pro",
        price: "$49",
        period: "per month",
        features: ["All Basic features", "Feature 4", "Feature 5", "Feature 6"],
        cta: "Get Started",
        highlighted: true
      }
    },
    {
      props: {
        planName: "Enterprise",
        price: "$99",
        period: "per month",
        features: ["All Pro features", "Feature 7", "Feature 8", "Feature 9"],
        cta: "Contact Sales",
        highlighted: false
      }
    }
  ];
  
  // Determine layout based on device type
  const isMobile = deviceType === 'mobile';
  
  const handleClick = () => {
    if (onClick && section.id) {
      onClick(section.id);
    }
  };

  return (
    <div 
      className={cn(
        'pricing-section w-full py-16 px-4',
        darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900',
        isSelected ? 'ring-2 ring-primary ring-offset-1' : '',
        viewMode === 'edit' ? 'cursor-pointer' : ''
      )}
      onClick={handleClick}
    >
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{heading}</h2>
          <p className={cn(
            'text-lg max-w-3xl mx-auto',
            darkMode ? 'text-gray-300' : 'text-gray-600'
          )}>
            {subheading}
          </p>
        </div>
        
        {/* Pricing Cards */}
        <div className={cn(
          'grid gap-8',
          isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'
        )}>
          {pricingCards.map((card, index) => (
            <div 
              key={index}
              className={cn(
                'pricing-card rounded-lg overflow-hidden',
                'flex flex-col h-full',
                card.props?.highlighted ? 
                  (darkMode ? 'border-2 border-blue-500 shadow-xl scale-105 z-10 bg-gray-700' : 'border-2 border-blue-500 shadow-xl scale-105 z-10 bg-white') : 
                  (darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'),
                isMobile && card.props?.highlighted && 'scale-100 my-8'
              )}
            >
              {/* Header */}
              <div className={cn(
                'p-6 text-center',
                card.props?.highlighted ? 
                  (darkMode ? 'bg-blue-900' : 'bg-blue-50') : 
                  (darkMode ? 'bg-gray-800' : 'bg-gray-50')
              )}>
                <h3 className="text-lg font-bold mb-1">{card.props?.planName || `Plan ${index + 1}`}</h3>
                <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold">{card.props?.price || '$0'}</span>
                  <span className={cn(
                    'ml-1',
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  )}>
                    {card.props?.period || '/mo'}
                  </span>
                </div>
              </div>
              
              {/* Features */}
              <div className="p-6 flex-grow">
                <ul className="space-y-3">
                  {(card.props?.features || ['Feature 1', 'Feature 2']).map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* CTA */}
              <div className="p-6 pt-0">
                <div className={cn(
                  'py-3 px-4 text-center rounded-md w-full font-medium',
                  card.props?.highlighted ? 
                    (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white') : 
                    (darkMode ? 'bg-gray-700 text-white border border-gray-600' : 'bg-white text-gray-800 border border-gray-300')
                )}>
                  {card.props?.cta || 'Sign Up'}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional Info */}
        <p className={cn(
          'text-center mt-8',
          darkMode ? 'text-gray-400' : 'text-gray-500'
        )}>
          All plans include our core features. Need something custom? Contact our sales team.
        </p>
      </div>
    </div>
  );
};

export default PricingSectionRenderer;
