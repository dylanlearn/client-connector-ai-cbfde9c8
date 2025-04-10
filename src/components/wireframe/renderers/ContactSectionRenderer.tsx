
import React from 'react';
import { cn } from '@/lib/utils';
import { SectionComponentProps } from '../types';
import { getSuggestion, createStyleObject } from './utilities';

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
  
  // Create a properly typed style object
  const styles = createStyleObject(section.style);
  
  return (
    <div 
      className={cn(
        'px-6 py-16 w-full',
        darkMode ? 'bg-gray-900' : 'bg-gray-100',
        isSelected && 'ring-2 ring-inset ring-primary',
        viewMode === 'flowchart' && 'border-2 border-dashed'
      )}
      onClick={handleClick}
      style={styles}
    >
      <div className={cn('max-w-5xl mx-auto')}>
        <div className="text-center mb-12">
          <h2 className={cn(
            'text-3xl font-bold mb-4',
            darkMode ? 'text-white' : 'text-gray-900'
          )}>
            {getSuggestion(section.copySuggestions, 'heading', 'Contact Us')}
          </h2>
          
          <p className={cn(
            'max-w-2xl mx-auto',
            darkMode ? 'text-gray-300' : 'text-gray-600'
          )}>
            {getSuggestion(section.copySuggestions, 'subheading', 'Have questions or need assistance? Reach out to our team using the form below.')}
          </p>
        </div>
        
        <div className={cn(
          deviceType === 'mobile' ? 'flex flex-col gap-8' : 'grid grid-cols-3 gap-8'
        )}>
          {/* Contact Form */}
          <div className={cn(
            'col-span-2',
            deviceType === 'mobile' && 'order-2'
          )}>
            <form className="space-y-6">
              <div>
                <label 
                  htmlFor="name" 
                  className={cn(
                    'block mb-2 font-medium',
                    darkMode ? 'text-white' : 'text-gray-700'
                  )}
                >
                  {getSuggestion(section.copySuggestions, 'nameLabel', 'Name')}
                </label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder={getSuggestion(section.copySuggestions, 'namePlaceholder', 'Your name')}
                />
              </div>
              
              <div>
                <label 
                  htmlFor="email" 
                  className={cn(
                    'block mb-2 font-medium',
                    darkMode ? 'text-white' : 'text-gray-700'
                  )}
                >
                  {getSuggestion(section.copySuggestions, 'emailLabel', 'Email')}
                </label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder={getSuggestion(section.copySuggestions, 'emailPlaceholder', 'Your email address')}
                />
              </div>
              
              <div>
                <label 
                  htmlFor="subject" 
                  className={cn(
                    'block mb-2 font-medium',
                    darkMode ? 'text-white' : 'text-gray-700'
                  )}
                >
                  {getSuggestion(section.copySuggestions, 'subjectLabel', 'Subject')}
                </label>
                <input 
                  type="text" 
                  id="subject" 
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder={getSuggestion(section.copySuggestions, 'subjectPlaceholder', 'What is this regarding?')}
                />
              </div>
              
              <div>
                <label 
                  htmlFor="message" 
                  className={cn(
                    'block mb-2 font-medium',
                    darkMode ? 'text-white' : 'text-gray-700'
                  )}
                >
                  {getSuggestion(section.copySuggestions, 'messageLabel', 'Message')}
                </label>
                <textarea 
                  id="message" 
                  className="w-full px-4 py-2 border rounded-md h-32"
                  placeholder={getSuggestion(section.copySuggestions, 'messagePlaceholder', 'Your message...')}
                ></textarea>
              </div>
              
              <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">
                {getSuggestion(section.copySuggestions, 'submitButton', 'Send Message')}
              </button>
            </form>
          </div>
          
          {/* Contact Information */}
          <div className={cn(
            'col-span-1',
            darkMode ? 'bg-gray-800' : 'bg-white',
            'p-6 rounded-lg shadow',
            deviceType === 'mobile' && 'order-1'
          )}>
            <h3 className={cn(
              'text-xl font-semibold mb-4',
              darkMode ? 'text-white' : 'text-gray-900'
            )}>
              {getSuggestion(section.copySuggestions, 'contactInfoTitle', 'Contact Information')}
            </h3>
            
            <div className="space-y-6">
              {/* Address */}
              <div>
                <p className={cn(
                  'font-medium',
                  darkMode ? 'text-white' : 'text-gray-900'
                )}>
                  {getSuggestion(section.copySuggestions, 'addressTitle', 'Address')}
                </p>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {getSuggestion(section.copySuggestions, 'address', '123 Business Street, Suite 100')}
                </p>
              </div>
              
              {/* Phone */}
              <div>
                <p className={cn(
                  'font-medium',
                  darkMode ? 'text-white' : 'text-gray-900'
                )}>
                  {getSuggestion(section.copySuggestions, 'phoneTitle', 'Phone')}
                </p>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {getSuggestion(section.copySuggestions, 'phone', '+1 (555) 123-4567')}
                </p>
              </div>
              
              {/* Email */}
              <div>
                <p className={cn(
                  'font-medium',
                  darkMode ? 'text-white' : 'text-gray-900'
                )}>
                  {getSuggestion(section.copySuggestions, 'emailTitle', 'Email')}
                </p>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {getSuggestion(section.copySuggestions, 'emailAddress', 'contact@company.com')}
                </p>
              </div>
              
              {/* Hours */}
              <div>
                <p className={cn(
                  'font-medium',
                  darkMode ? 'text-white' : 'text-gray-900'
                )}>
                  {getSuggestion(section.copySuggestions, 'hoursTitle', 'Hours')}
                </p>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {getSuggestion(section.copySuggestions, 'hours', 'Monday - Friday: 9AM - 5PM')}
                </p>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {getSuggestion(section.copySuggestions, 'weekend', 'Weekend: Closed')}
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
