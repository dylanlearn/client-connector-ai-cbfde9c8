
import React from 'react';
import { ContactComponentProps } from '@/types/component-library';
import { cn } from '@/lib/utils';
import { Mail, MapPin, Phone } from 'lucide-react';

interface ContactSectionProps {
  sectionIndex?: number;
  data?: ContactComponentProps;
  variant?: string;
  className?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ 
  sectionIndex = 0,
  data,
  variant = 'contact-startup-001',
  className
}) => {
  // Default contact data if none provided
  const contactData: Partial<ContactComponentProps> = data || {
    variant,
    headline: "Contact Us",
    subheadline: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    formFields: [
      { label: "Name", name: "name", type: "text", required: true },
      { label: "Email", name: "email", type: "email", required: true },
      { label: "Message", name: "message", type: "textarea", required: true }
    ],
    ctaLabel: "Send Message",
    alignment: 'left',
    backgroundStyle: 'light'
  };
  
  // Determine background class based on style
  const getBgClass = () => {
    switch (contactData.backgroundStyle) {
      case 'dark': 
        return 'bg-gray-900 text-white';
      case 'light': 
        return 'bg-gray-50 text-gray-800';
      case 'gradient':
        return 'bg-gradient-to-r from-purple-500 to-blue-500 text-white';
      case 'image':
        return 'bg-gray-800 bg-opacity-75 text-white';
      default:
        return 'bg-gray-50 text-gray-800';
    }
  };
  
  // Determine alignment class
  const getAlignmentClass = () => {
    switch (contactData.alignment) {
      case 'left': return 'text-left';
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

  return (
    <div 
      key={sectionIndex} 
      className={cn(
        'border-2 border-dashed border-gray-300 rounded-lg p-4',
        getBgClass(),
        getAlignmentClass(),
        className
      )}
    >
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className={`space-y-6 ${contactData.alignment === 'right' ? 'md:order-2' : ''}`}>
            {contactData.headline && (
              <div className="w-64 h-8 bg-gray-300 bg-opacity-30 rounded mb-2">
                {contactData.headline}
              </div>
            )}
            
            {contactData.subheadline && (
              <div className="w-full h-4 bg-gray-200 bg-opacity-30 rounded mb-8">
                {contactData.subheadline}
              </div>
            )}
            
            <div className="space-y-4">
              {contactData.formFields?.map((field, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="w-24 h-4 bg-gray-200 bg-opacity-30 rounded">{field.label}</div>
                  {field.type === 'textarea' ? (
                    <div className="w-full h-32 bg-gray-200 bg-opacity-20 rounded border border-gray-300 border-opacity-30"></div>
                  ) : (
                    <div className="w-full h-10 bg-gray-200 bg-opacity-20 rounded border border-gray-300 border-opacity-30"></div>
                  )}
                </div>
              ))}
              
              <div className="pt-4">
                <div className="w-32 h-10 bg-blue-500 rounded flex items-center justify-center">
                  <div className="w-24 h-4 bg-white bg-opacity-90 rounded">{contactData.ctaLabel}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Info */}
          <div className={`space-y-6 ${contactData.alignment === 'right' ? 'md:order-1' : ''}`}>
            {contactData.showMap && (
              <div className="w-full h-48 bg-gray-300 bg-opacity-30 rounded mb-6"></div>
            )}
            
            {contactData.contactInfo && (
              <div className="space-y-4 my-8">
                {contactData.contactInfo.email && (
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-300 bg-opacity-30 rounded-full flex items-center justify-center">
                      <Mail size={14} />
                    </div>
                    <div className="w-40 h-4 bg-gray-200 bg-opacity-30 rounded">{contactData.contactInfo.email}</div>
                  </div>
                )}
                
                {contactData.contactInfo.phone && (
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-300 bg-opacity-30 rounded-full flex items-center justify-center">
                      <Phone size={14} />
                    </div>
                    <div className="w-32 h-4 bg-gray-200 bg-opacity-30 rounded">{contactData.contactInfo.phone}</div>
                  </div>
                )}
                
                {contactData.contactInfo.address && (
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-300 bg-opacity-30 rounded-full flex items-center justify-center">
                      <MapPin size={14} />
                    </div>
                    <div className="w-48 h-4 bg-gray-200 bg-opacity-30 rounded">{contactData.contactInfo.address}</div>
                  </div>
                )}
              </div>
            )}
            
            {contactData.socialLinks && contactData.socialLinks.length > 0 && (
              <div className="flex space-x-3 mt-8">
                {contactData.socialLinks.map((link, idx) => (
                  <div key={idx} className="w-8 h-8 bg-gray-300 bg-opacity-30 rounded-full"></div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
