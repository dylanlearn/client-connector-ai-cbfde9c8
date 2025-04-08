
import React from 'react';
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
    animationStyle,
    backgroundStyle,
    alignment
  } = data;
  
  // Style classes
  const backgroundClass = getBackgroundClass(backgroundStyle, darkMode);
  const alignmentClass = getAlignmentClass(alignment || 'center');

  return (
    <section className={`faq-section ${backgroundClass} py-16 px-4 sm:px-6 lg:px-8`}>
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
        
        <div className="faq-container max-w-4xl mx-auto">
          {faqs.map((faq: any, index: number) => (
            <div 
              key={index}
              className="faq-item mb-4 border-b border-gray-200 dark:border-gray-700 pb-4"
            >
              <div className="faq-question font-medium text-lg mb-2">
                {faq.question}
              </div>
              
              <div className="faq-answer opacity-80">
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSectionRenderer;
