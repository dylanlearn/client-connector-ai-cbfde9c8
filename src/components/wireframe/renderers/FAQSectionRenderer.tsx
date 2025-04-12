
import React from 'react';
import { SectionComponentProps } from '../types';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
  deviceType = 'desktop',
  isSelected = false,
  onClick
}) => {
  // Get accordion items or use defaults
  const accordionItems = section.components?.[0]?.props?.items || [
    { 
      question: "How does the free trial work?", 
      answer: "Our 14-day free trial gives you full access to all features with no credit card required." 
    },
    { 
      question: "Can I upgrade or downgrade my plan?", 
      answer: "Yes, you can change your plan at any time. Changes take effect at the next billing cycle." 
    },
    { 
      question: "Do you offer refunds?", 
      answer: "We offer a 30-day money-back guarantee if you're not satisfied with our service." 
    },
    { 
      question: "How secure is your platform?", 
      answer: "We use industry-leading security measures including encryption and regular security audits." 
    }
  ];
  
  const handleClick = () => {
    if (onClick && section.id) {
      onClick(section.id);
    }
  };

  return (
    <div 
      className={cn(
        'faq-section w-full py-16 px-4',
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900',
        isSelected ? 'ring-2 ring-primary ring-offset-1' : '',
        viewMode === 'edit' ? 'cursor-pointer' : ''
      )}
      onClick={handleClick}
    >
      <div className="container mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className={cn(
            'text-lg max-w-3xl mx-auto',
            darkMode ? 'text-gray-300' : 'text-gray-600'
          )}>
            Find answers to common questions about our platform and services.
          </p>
        </div>
        
        {/* Accordion */}
        <div className="space-y-4">
          {accordionItems.map((item, index) => (
            <div 
              key={index} 
              className={cn(
                'border rounded-lg overflow-hidden',
                darkMode ? 'border-gray-700' : 'border-gray-200'
              )}
            >
              {/* Question (Always visible) */}
              <div className={cn(
                'p-5 flex justify-between items-center cursor-pointer',
                darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-50 hover:bg-gray-100',
                viewMode === 'preview' && index === 0 ? 'border-b' : ''
              )}>
                <h3 className="font-medium text-lg">{item.question}</h3>
                <div>
                  {viewMode === 'preview' && index === 0 ? 
                    <ChevronUp className="h-5 w-5" /> : 
                    <ChevronDown className="h-5 w-5" />
                  }
                </div>
              </div>
              
              {/* Answer (Only visible for first item in preview mode) */}
              {(viewMode === 'preview' && index === 0) && (
                <div className={cn(
                  'p-5',
                  darkMode ? 'bg-gray-900' : 'bg-white'
                )}>
                  <p className={cn(
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  )}>
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQSectionRenderer;
