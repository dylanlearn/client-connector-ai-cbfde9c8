
import React from 'react';
import { SectionComponentProps } from '../types';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSuggestion, createStyleObject } from '@/utils/copy-suggestions-helper';

const ContactSectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  darkMode = false,
  deviceType = 'desktop',
  isSelected = false,
  onClick,
}) => {
  // Extract copy suggestions for the contact section
  const copySuggestions = section.copySuggestions;
  
  // Extract section style, defaulting to an empty object
  const sectionStyle = section.style || {};
  
  // Create CSS properties object properly handling textAlign
  const styleProps = createStyleObject({
    backgroundColor: section.backgroundColor || sectionStyle.backgroundColor || (darkMode ? '#1f2937' : '#f9fafb'),
    textAlign: section.style?.textAlign || 'left',
    padding: section.padding || sectionStyle.padding || '3rem 1.5rem',
    gap: section.gap || sectionStyle.gap || '2rem'
  });

  return (
    <div 
      className={cn(
        "contact-section w-full",
        isSelected ? "ring-2 ring-offset-2 ring-primary ring-offset-transparent" : "",
        darkMode ? "text-white" : "text-gray-800",
        deviceType === 'mobile' ? "px-4 py-8" : "px-8 py-12"
      )}
      style={styleProps}
      onClick={onClick}
    >
      <div className="container mx-auto">
        {/* Section Header */}
        <div className={cn("text-center mb-10", deviceType === 'mobile' ? "mb-6" : "")}>
          <h2 className={cn(
            "text-3xl font-bold mb-4", 
            deviceType === 'mobile' ? "text-2xl" : "",
            darkMode ? "text-white" : "text-gray-900"
          )}>
            {getSuggestion(copySuggestions, 'heading', 'Contact Us')}
          </h2>
          
          <p className={cn(
            "text-lg max-w-2xl mx-auto", 
            deviceType === 'mobile' ? "text-base" : "",
            darkMode ? "text-gray-300" : "text-gray-600"
          )}>
            {getSuggestion(copySuggestions, 'subheading', 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.')}
          </p>
        </div>
        
        <div className={cn(
          "flex flex-wrap",
          deviceType === 'mobile' ? "flex-col" : "flex-row"
        )}>
          {/* Contact Form */}
          <div className={cn(
            "w-full", 
            deviceType === 'mobile' ? "mb-8" : "lg:w-7/12 pr-8"
          )}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <form>
                <div className="mb-4">
                  <label 
                    htmlFor="name" 
                    className={`block mb-2 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
                  >
                    {getSuggestion(copySuggestions, 'nameLabel', 'Your Name')}
                  </label>
                  <input 
                    type="text" 
                    id="name"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder={getSuggestion(copySuggestions, 'namePlaceholder', 'Enter your full name')}
                  />
                </div>
                
                <div className="mb-4">
                  <label 
                    htmlFor="email" 
                    className={`block mb-2 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
                  >
                    {getSuggestion(copySuggestions, 'emailLabel', 'Email Address')}
                  </label>
                  <input 
                    type="email" 
                    id="email"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder={getSuggestion(copySuggestions, 'emailPlaceholder', 'Enter your email')}
                  />
                </div>
                
                <div className="mb-4">
                  <label 
                    htmlFor="subject" 
                    className={`block mb-2 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
                  >
                    {getSuggestion(copySuggestions, 'subjectLabel', 'Subject')}
                  </label>
                  <input 
                    type="text" 
                    id="subject"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder={getSuggestion(copySuggestions, 'subjectPlaceholder', 'What is this about?')}
                  />
                </div>
                
                <div className="mb-4">
                  <label 
                    htmlFor="message" 
                    className={`block mb-2 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
                  >
                    {getSuggestion(copySuggestions, 'messageLabel', 'Message')}
                  </label>
                  <textarea 
                    id="message" 
                    rows={4}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder={getSuggestion(copySuggestions, 'messagePlaceholder', 'Your message here...')}
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  {getSuggestion(copySuggestions, 'submitButton', 'Send Message')}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className={cn(
            "w-full", 
            deviceType === 'mobile' ? "" : "lg:w-5/12"
          )}>
            <div className="h-full bg-primary/10 rounded-lg p-6">
              <h3 className={cn(
                "text-xl font-semibold mb-6",
                darkMode ? "text-white" : "text-gray-800"
              )}>
                {getSuggestion(copySuggestions, 'contactInfoTitle', 'Contact Information')}
              </h3>
              
              <div className="space-y-6">
                {/* Address */}
                <div className="flex">
                  <div className="flex-shrink-0 mr-3">
                    <MapPin className={`h-6 w-6 ${darkMode ? 'text-gray-300' : 'text-primary'}`} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">
                      {getSuggestion(copySuggestions, 'addressTitle', 'Our Address')}
                    </h4>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {getSuggestion(copySuggestions, 'address', '1234 Street Name, City, ST 12345')}
                    </p>
                  </div>
                </div>
                
                {/* Phone */}
                <div className="flex">
                  <div className="flex-shrink-0 mr-3">
                    <Phone className={`h-6 w-6 ${darkMode ? 'text-gray-300' : 'text-primary'}`} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">
                      {getSuggestion(copySuggestions, 'phoneTitle', 'Phone Number')}
                    </h4>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {getSuggestion(copySuggestions, 'phone', '+1 (555) 123-4567')}
                    </p>
                  </div>
                </div>
                
                {/* Email */}
                <div className="flex">
                  <div className="flex-shrink-0 mr-3">
                    <Mail className={`h-6 w-6 ${darkMode ? 'text-gray-300' : 'text-primary'}`} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">
                      {getSuggestion(copySuggestions, 'emailTitle', 'Email Address')}
                    </h4>
                    <a 
                      href={`mailto:${getSuggestion(copySuggestions, 'emailAddress', 'info@company.com')}`} 
                      className="text-primary hover:underline"
                    >
                      {getSuggestion(copySuggestions, 'emailAddress', 'info@company.com')}
                    </a>
                  </div>
                </div>
                
                {/* Hours */}
                <div className="flex pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex-shrink-0 mr-3">
                    <Clock className={`h-6 w-6 ${darkMode ? 'text-gray-300' : 'text-primary'}`} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">
                      {getSuggestion(copySuggestions, 'hoursTitle', 'Business Hours')}
                    </h4>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {getSuggestion(copySuggestions, 'hours', 'Monday - Friday: 9am - 5pm')}
                    </p>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {getSuggestion(copySuggestions, 'weekend', 'Weekends: Closed')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSectionRenderer;
