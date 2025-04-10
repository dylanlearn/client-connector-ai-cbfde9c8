
import React from 'react';
import { cn } from '@/lib/utils';
import { SectionComponentProps } from '../types';

const ContactSectionRenderer: React.FC<SectionComponentProps> = ({
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
            {copySuggestions.heading || 'Get in Touch'}
          </h2>
          
          <p className={cn(
            'max-w-3xl mx-auto',
            darkMode ? 'text-gray-300' : 'text-gray-600'
          )}>
            {copySuggestions.subheading || 'Have questions or need assistance? Contact us and we\'ll get back to you as soon as possible.'}
          </p>
        </div>
        
        <div className={cn(
          'grid gap-12',
          deviceType === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'
        )}>
          {/* Contact Form */}
          <div>
            <div className={cn(
              'space-y-4 p-6 rounded-lg',
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            )}>
              <div>
                <label className={cn(
                  'block text-sm font-medium mb-1',
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                )}>
                  {copySuggestions.nameLabel || 'Full Name'}
                </label>
                <input
                  type="text"
                  className={cn(
                    'w-full p-2 rounded-md',
                    darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'
                  )}
                  placeholder={copySuggestions.namePlaceholder || 'Your name'}
                />
              </div>
              
              <div>
                <label className={cn(
                  'block text-sm font-medium mb-1',
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                )}>
                  {copySuggestions.emailLabel || 'Email Address'}
                </label>
                <input
                  type="email"
                  className={cn(
                    'w-full p-2 rounded-md',
                    darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'
                  )}
                  placeholder={copySuggestions.emailPlaceholder || 'your.email@example.com'}
                />
              </div>
              
              <div>
                <label className={cn(
                  'block text-sm font-medium mb-1',
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                )}>
                  {copySuggestions.subjectLabel || 'Subject'}
                </label>
                <input
                  type="text"
                  className={cn(
                    'w-full p-2 rounded-md',
                    darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'
                  )}
                  placeholder={copySuggestions.subjectPlaceholder || 'How can we help?'}
                />
              </div>
              
              <div>
                <label className={cn(
                  'block text-sm font-medium mb-1',
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                )}>
                  {copySuggestions.messageLabel || 'Message'}
                </label>
                <textarea
                  className={cn(
                    'w-full p-2 rounded-md h-32',
                    darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'
                  )}
                  placeholder={copySuggestions.messagePlaceholder || 'Your message here...'}
                />
              </div>
              
              <button className={cn(
                'w-full py-2 rounded-md font-medium',
                'bg-blue-600 hover:bg-blue-700 text-white'
              )}>
                {copySuggestions.submitButton || 'Send Message'}
              </button>
            </div>
          </div>
          
          {/* Contact Information */}
          <div>
            <div className="space-y-8">
              <div>
                <h3 className={cn(
                  'text-xl font-semibold mb-4',
                  darkMode ? 'text-white' : 'text-gray-900'
                )}>
                  {copySuggestions.contactInfoTitle || 'Contact Information'}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center mr-4',
                      darkMode ? 'bg-gray-700' : 'bg-gray-100'
                    )}>
                      📍
                    </div>
                    <div>
                      <p className={cn(
                        'font-medium',
                        darkMode ? 'text-white' : 'text-gray-900'
                      )}>
                        {copySuggestions.addressTitle || 'Address'}
                      </p>
                      <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                        {copySuggestions.address || '123 Business Street, Suite 100, City, State 12345'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center mr-4',
                      darkMode ? 'bg-gray-700' : 'bg-gray-100'
                    )}>
                      📞
                    </div>
                    <div>
                      <p className={cn(
                        'font-medium',
                        darkMode ? 'text-white' : 'text-gray-900'
                      )}>
                        {copySuggestions.phoneTitle || 'Phone'}
                      </p>
                      <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                        {copySuggestions.phone || '+1 (555) 123-4567'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center mr-4',
                      darkMode ? 'bg-gray-700' : 'bg-gray-100'
                    )}>
                      ✉️
                    </div>
                    <div>
                      <p className={cn(
                        'font-medium',
                        darkMode ? 'text-white' : 'text-gray-900'
                      )}>
                        {copySuggestions.emailTitle || 'Email'}
                      </p>
                      <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                        {copySuggestions.emailAddress || 'contact@yourcompany.com'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className={cn(
                  'text-xl font-semibold mb-4',
                  darkMode ? 'text-white' : 'text-gray-900'
                )}>
                  {copySuggestions.hoursTitle || 'Business Hours'}
                </h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {copySuggestions.hours || 'Monday - Friday: 9:00 AM - 5:00 PM'}
                </p>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {copySuggestions.weekend || 'Saturday - Sunday: Closed'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSectionRenderer;
