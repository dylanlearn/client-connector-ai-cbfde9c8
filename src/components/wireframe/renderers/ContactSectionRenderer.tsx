
import React from 'react';
import { SectionComponentProps } from '../types';
import { getBackgroundClass, getAlignmentClass } from '../utils/variant-utils';

const ContactSectionRenderer: React.FC<SectionComponentProps> = ({
  section,
  viewMode = 'preview',
  darkMode = false,
}) => {
  const { componentVariant, data = {} } = section;
  const {
    headline,
    subheadline,
    formFields = [],
    ctaLabel,
    showMap,
    contactInfo,
    socialLinks,
    backgroundStyle,
    alignment
  } = data;
  
  // Style classes
  const backgroundClass = getBackgroundClass(backgroundStyle, darkMode);
  const alignmentClass = getAlignmentClass(alignment || 'left');

  return (
    <section className={`contact-section ${backgroundClass} py-16 px-4 sm:px-6 lg:px-8`}>
      <div className={`container mx-auto ${alignmentClass}`}>
        <div className="grid gap-12 md:grid-cols-2">
          {/* Contact Form */}
          <div className="contact-form">
            {(headline || subheadline) && (
              <div className="mb-8">
                {headline && (
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4">{headline}</h2>
                )}
                
                {subheadline && (
                  <p className="text-lg opacity-80">{subheadline}</p>
                )}
              </div>
            )}
            
            <form className="space-y-4">
              {formFields.map((field, index) => (
                <div key={index} className="form-field">
                  <label className="block mb-1 font-medium text-sm">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {field.type === 'textarea' ? (
                    <textarea 
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                      rows={4}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      name={field.name}
                      required={field.required}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                    >
                      <option value="">Select an option</option>
                    </select>
                  ) : (
                    <input 
                      type={field.type || 'text'} 
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                    />
                  )}
                </div>
              ))}
              
              <button 
                type="submit" 
                className="px-6 py-3 bg-primary text-white rounded-md font-medium"
              >
                {ctaLabel || 'Submit'}
              </button>
            </form>
          </div>
          
          {/* Contact Info & Map */}
          <div className="contact-info">
            {showMap && (
              <div className="contact-map mb-8 h-64 bg-gray-300 dark:bg-gray-700 rounded-md overflow-hidden">
                {/* Map would be embedded here - using placeholder */}
                <div className="h-full w-full flex items-center justify-center">
                  <p className="text-center text-gray-600 dark:text-gray-400">Map View</p>
                </div>
              </div>
            )}
            
            {contactInfo && (
              <div className="contact-details space-y-4">
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                
                {contactInfo.address && (
                  <div className="flex items-start">
                    <div className="mr-3">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>{contactInfo.address}</div>
                  </div>
                )}
                
                {contactInfo.phone && (
                  <div className="flex items-center">
                    <div className="mr-3">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>{contactInfo.phone}</div>
                  </div>
                )}
                
                {contactInfo.email && (
                  <div className="flex items-center">
                    <div className="mr-3">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>{contactInfo.email}</div>
                  </div>
                )}
              </div>
            )}
            
            {socialLinks && socialLinks.length > 0 && (
              <div className="social-links mt-6">
                <h4 className="font-medium mb-2">Connect With Us</h4>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <a 
                      key={index}
                      href={social.url}
                      className="text-current opacity-80 hover:opacity-100"
                      aria-label={social.platform}
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                        {social.platform.charAt(0)}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSectionRenderer;
