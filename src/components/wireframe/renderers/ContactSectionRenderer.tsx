
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
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (onClick && section.id) {
      onClick(section.id);
    }
  };
  
  // Use createStyleObject utility to ensure type safety
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
      <div className={cn(
        'max-w-6xl mx-auto',
        deviceType === 'mobile' ? 'px-4' : 'px-8'
      )}>
        <div className={cn(
          'grid gap-8',
          deviceType === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'
        )}>
          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className={cn(
              'text-3xl font-bold mb-6',
              darkMode ? 'text-white' : 'text-gray-900'
            )}>
              {getSuggestion(section.copySuggestions, 'heading', 'Get in Touch')}
            </h2>
            
            <p className={cn(
              'mb-8',
              darkMode ? 'text-gray-300' : 'text-gray-600'
            )}>
              {getSuggestion(section.copySuggestions, 'subheading', 'We\'d love to hear from you. Fill out the form and we\'ll get back to you as soon as possible.')}
            </p>
            
            <div className="contact-info space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span role="img" aria-label="email">✉️</span>
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-gray-500">{getSuggestion(section.copySuggestions, 'email', 'contact@example.com')}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span role="img" aria-label="phone">📱</span>
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-gray-500">{getSuggestion(section.copySuggestions, 'phone', '+1 (555) 123-4567')}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span role="img" aria-label="location">📍</span>
                </div>
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-sm text-gray-500">{getSuggestion(section.copySuggestions, 'address', '123 Main St, City, Country')}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className={cn(
            'rounded-lg p-6',
            darkMode ? 'bg-gray-800' : 'bg-gray-50'
          )}>
            <h3 className={cn(
              'text-xl font-semibold mb-4',
              darkMode ? 'text-white' : 'text-gray-900'
            )}>
              {getSuggestion(section.copySuggestions, 'formHeading', 'Send Us a Message')}
            </h3>
            
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">First Name</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-md" />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Last Name</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-md" />
                </div>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">Email</label>
                <input type="email" className="w-full px-3 py-2 border rounded-md" />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">Subject</label>
                <input type="text" className="w-full px-3 py-2 border rounded-md" />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium">Message</label>
                <textarea rows={4} className="w-full px-3 py-2 border rounded-md"></textarea>
              </div>
              
              <button type="button" className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium">
                {getSuggestion(section.copySuggestions, 'submitButtonText', 'Send Message')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSectionRenderer;
