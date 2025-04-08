
import React, { useState } from 'react';
import { SectionComponentProps } from '../types';
import { getBackgroundClass, getAlignmentClass } from '../utils/variant-utils';

const FAQSectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
}) => {
  const { componentVariant, data = {} } = section;
  const {
    title,
    subtitle,
    faqs = [],
    faqType = 'accordion',
    animationStyle = 'expand',
    backgroundStyle,
    alignment
  } = data;
  
  // State for accordion open/close
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});
  
  // Style classes
  const backgroundClass = getBackgroundClass(backgroundStyle, darkMode);
  const alignmentClass = getAlignmentClass(alignment || 'left');
  
  // Toggle accordion item
  const toggleAccordion = (index: number) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Render FAQ based on type (accordion, grid, or list)
  const renderFAQItems = () => {
    switch(faqType) {
      case 'grid':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h4 className="text-lg font-bold mb-2">{faq.question}</h4>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        );
        
      case 'list':
        return (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h4 className="text-lg font-bold mb-2">{faq.question}</h4>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        );
        
      // Default: accordion
      default:
        return (
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                  className="flex items-center justify-between w-full p-4 text-left bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => toggleAccordion(index)}
                >
                  <span className="font-semibold">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 transition-transform ${openItems[index] ? 'transform rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {openItems[index] && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-900">
                    <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <section className={`faq-section ${backgroundClass} py-16 px-4 sm:px-6 lg:px-8`}>
      <div className={`container mx-auto ${alignmentClass}`}>
        {(title || subtitle) && (
          <div className="section-header mb-12">
            {title && (
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">{title}</h2>
            )}
            
            {subtitle && (
              <p className="text-lg opacity-80 max-w-3xl">{subtitle}</p>
            )}
          </div>
        )}
        
        <div className="faq-content max-w-3xl mx-auto">
          {renderFAQItems()}
        </div>
      </div>
    </section>
  );
};

export default FAQSectionRenderer;
