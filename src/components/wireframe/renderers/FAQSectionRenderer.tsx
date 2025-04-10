
import React from 'react';
import { cn } from '@/lib/utils';
import { SectionComponentProps } from '../types';
import { getSuggestion, createStyleObject } from './utilities';

const FAQSectionRenderer: React.FC<SectionComponentProps> = ({
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
  
  // FAQ items using getSuggestion utility
  const faqs = [
    {
      question: getSuggestion(section.copySuggestions, 'question1', 'What is your product/service?'),
      answer: getSuggestion(section.copySuggestions, 'answer1', 'Our product is designed to help businesses streamline their workflow and increase productivity. It provides powerful tools for task management, team collaboration, and performance tracking.')
    },
    {
      question: getSuggestion(section.copySuggestions, 'question2', 'How does the pricing work?'),
      answer: getSuggestion(section.copySuggestions, 'answer2', 'We offer different pricing tiers based on your needs. Our plans start at $9/month for individuals and go up to custom enterprise solutions. All plans come with a 14-day free trial, no credit card required.')
    },
    {
      question: getSuggestion(section.copySuggestions, 'question3', 'Do you offer support?'),
      answer: getSuggestion(section.copySuggestions, 'answer3', 'Yes, we provide 24/7 customer support via chat and email for all paid plans. Our enterprise customers also get dedicated account management and priority phone support.')
    },
    {
      question: getSuggestion(section.copySuggestions, 'question4', 'Can I cancel my subscription?'),
      answer: getSuggestion(section.copySuggestions, 'answer4', 'Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. You\'ll continue to have access until the end of your billing period.')
    },
    {
      question: getSuggestion(section.copySuggestions, 'question5', 'Is my data secure?'),
      answer: getSuggestion(section.copySuggestions, 'answer5', 'We take security very seriously. All data is encrypted both in transit and at rest. We use industry-standard security practices and regularly conduct security audits.')
    }
  ];
  
  // Create properly typed style object
  const styles = createStyleObject(section.style);
  
  return (
    <div 
      className={cn(
        'px-6 py-16 w-full',
        darkMode ? 'bg-gray-900' : 'bg-gray-50',
        isSelected && 'ring-2 ring-inset ring-primary',
        viewMode === 'flowchart' && 'border-2 border-dashed'
      )}
      onClick={handleClick}
      style={styles}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={cn(
            'text-3xl font-bold mb-4',
            darkMode ? 'text-white' : 'text-gray-900'
          )}>
            {getSuggestion(section.copySuggestions, 'heading', 'Frequently Asked Questions')}
          </h2>
          
          <p className={cn(
            'max-w-2xl mx-auto',
            darkMode ? 'text-gray-300' : 'text-gray-600'
          )}>
            {getSuggestion(section.copySuggestions, 'subheading', 'Find answers to common questions about our product and services.')}
          </p>
        </div>
        
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className={cn(
                'p-6 rounded-lg',
                darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'
              )}
            >
              <h3 className={cn(
                'text-lg font-semibold mb-3',
                darkMode ? 'text-white' : 'text-gray-900'
              )}>
                {faq.question}
              </h3>
              <p className={cn(
                darkMode ? 'text-gray-300' : 'text-gray-600'
              )}>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <p className={cn(
            darkMode ? 'text-gray-300' : 'text-gray-600',
            'mb-4'
          )}>
            {getSuggestion(section.copySuggestions, 'supportText', 'Still have questions?')}
          </p>
          <button className={cn(
            'px-6 py-2 rounded-md font-medium',
            darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
          )}>
            {getSuggestion(section.copySuggestions, 'supportCta', 'Contact Support')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQSectionRenderer;
