
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQComponentProps {
  variant: string;
  title?: string;
  subtitle?: string;
  faqs: Array<{
    question: string;
    answer: string;
    isExpandedByDefault?: boolean;
  }>;
  faqType?: 'accordion' | 'list' | 'grid';
  animationStyle?: 'expand' | 'fade' | 'none';
  alignment?: 'left' | 'center' | 'right';
  backgroundStyle?: 'light' | 'dark' | 'image';
  styleNote?: string;
}

interface FAQSectionProps {
  sectionIndex: number;
  data?: Partial<FAQComponentProps>;
  viewMode?: 'preview' | 'flowchart';
  darkMode?: boolean;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ 
  sectionIndex, 
  data,
  viewMode = 'preview',
  darkMode = false
}) => {
  // Fallback to wireframe display if no specific data is provided
  if (!data || viewMode === 'flowchart') {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
        <div className={`text-${data?.alignment || 'center'} mb-8`}>
          <div className="w-48 h-8 bg-gray-300 rounded mx-auto"></div>
          <div className="w-72 h-4 bg-gray-200 rounded mx-auto mt-4"></div>
        </div>
        <div className="space-y-4 mt-6">
          {[1, 2].map(i => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex justify-between items-center">
                <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
                <div className="w-6 h-6 rounded-full bg-gray-200"></div>
              </div>
              <div className="mt-4 space-y-2 hidden">
                <div className="w-full h-3 bg-gray-200 rounded"></div>
                <div className="w-5/6 h-3 bg-gray-200 rounded"></div>
                <div className="w-4/6 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Determine text alignment class
  const alignmentClass = data.alignment === 'left' 
    ? 'text-left' 
    : data.alignment === 'right' 
      ? 'text-right' 
      : 'text-center';

  // Determine background class
  const bgClass = data.backgroundStyle === 'dark' 
    ? 'bg-gray-900 text-white' 
    : data.backgroundStyle === 'image' 
      ? 'bg-gray-800 text-white bg-opacity-70 bg-center bg-cover' 
      : 'bg-white';

  // Render as appropriate FAQ type
  const renderFAQItems = () => {
    switch(data.faqType) {
      case 'accordion':
        return (
          <Accordion type="single" collapsible className="w-full">
            {data.faqs?.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`} className={darkMode ? 'border-gray-700' : ''}>
                <AccordionTrigger className={`text-lg font-medium ${darkMode ? 'hover:text-white' : ''}`}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        );
        
      case 'grid':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.faqs?.map((faq, index) => (
              <div key={index} className={`p-5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h4 className="text-lg font-medium mb-2">{faq.question}</h4>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{faq.answer}</p>
              </div>
            ))}
          </div>
        );
        
      case 'list':
      default:
        return (
          <div className="space-y-6">
            {data.faqs?.map((faq, index) => (
              <div key={index} className="border-b pb-5 last:border-0">
                <h4 className="text-lg font-medium mb-3">{faq.question}</h4>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{faq.answer}</p>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className={`faq-section py-12 ${bgClass}`}>
      <div className="container mx-auto px-4">
        {(data.title || data.subtitle) && (
          <div className={`${alignmentClass} mb-10`}>
            {data.title && <h2 className="text-3xl font-bold mb-4">{data.title}</h2>}
            {data.subtitle && <p className={`text-lg ${darkMode || data.backgroundStyle === 'dark' || data.backgroundStyle === 'image' ? 'text-gray-300' : 'text-gray-600'}`}>{data.subtitle}</p>}
          </div>
        )}
        
        <div className={`max-w-3xl mx-auto ${data.alignment === 'left' ? 'ml-0' : data.alignment === 'right' ? 'mr-0' : ''}`}>
          {renderFAQItems()}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
