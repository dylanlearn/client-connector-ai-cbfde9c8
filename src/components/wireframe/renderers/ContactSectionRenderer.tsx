
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
    title,
    subtitle,
    contactInfo = {},
    formFields = [],
    backgroundStyle,
    alignment,
    mapEnabled
  } = data;
  
  // Style classes
  const backgroundClass = getBackgroundClass(backgroundStyle, darkMode);
  const alignmentClass = getAlignmentClass(alignment || 'center');

  return (
    <section className={`contact-section ${backgroundClass} py-16 px-4 sm:px-6 lg:px-8`}>
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="contact-form bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <form className="space-y-4">
              {formFields.map((field: any, index: number) => (
                <div key={index} className="form-group">
                  <label className="block text-sm font-medium mb-1">
                    {field.label}
                  </label>
                  
                  {field.type === 'textarea' ? (
                    <textarea
                      className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      rows={4}
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <input
                      type={field.type || 'text'}
                      className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
              
              <button className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-md">
                Submit
              </button>
            </form>
          </div>
          
          {/* Contact Information */}
          <div className="contact-info">
            {contactInfo.address && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-2">Address</h3>
                <p>{contactInfo.address}</p>
              </div>
            )}
            
            {contactInfo.email && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-2">Email</h3>
                <p>{contactInfo.email}</p>
              </div>
            )}
            
            {contactInfo.phone && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-2">Phone</h3>
                <p>{contactInfo.phone}</p>
              </div>
            )}
            
            {mapEnabled && (
              <div className="mt-8">
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Map Placeholder</span>
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
