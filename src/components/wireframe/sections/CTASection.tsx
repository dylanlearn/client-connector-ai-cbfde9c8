
import React from "react";

interface CTAComponentProps {
  variant: string;
  headline: string;
  subheadline?: string;
  cta: {
    label: string;
    url: string;
  };
  ctaSecondary?: {
    label: string;
    url: string;
  };
  backgroundStyle?: 'light' | 'dark' | 'image' | 'gradient';
  alignment?: 'left' | 'center' | 'right';
  styleNote?: string;
  testimonial?: {
    quote: string;
    author: string;
    avatar?: string;
  };
}

interface CTASectionProps {
  sectionIndex: number;
  data?: Partial<CTAComponentProps>;
  viewMode?: 'preview' | 'flowchart';
  darkMode?: boolean;
}

export const CTASection: React.FC<CTASectionProps> = ({ 
  sectionIndex, 
  data,
  viewMode = 'preview',
  darkMode = false
}) => {
  // Fallback to wireframe display if no specific data is provided
  if (!data || viewMode === 'flowchart') {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
        <div className="text-center mb-6">
          <div className="w-64 h-8 bg-gray-300 rounded mx-auto"></div>
          <div className="w-80 h-4 bg-gray-200 rounded mx-auto mt-4"></div>
        </div>
        <div className="flex justify-center gap-4 mt-6">
          <div className="w-32 h-10 bg-gray-800 rounded"></div>
          <div className="w-32 h-10 bg-gray-400 rounded"></div>
        </div>
      </div>
    );
  }

  // Determine the alignment class
  const alignmentClass = data.alignment === 'left' 
    ? 'text-left items-start' 
    : data.alignment === 'right' 
      ? 'text-right items-end' 
      : 'text-center items-center';

  // Determine the background class based on backgroundStyle
  let bgClass;
  switch(data.backgroundStyle) {
    case 'dark':
      bgClass = 'bg-gray-900 text-white';
      break;
    case 'image':
      bgClass = 'bg-gray-800 text-white bg-center bg-cover';
      break;
    case 'gradient':
      bgClass = 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white';
      break;
    default: // 'light'
      bgClass = 'bg-white text-gray-900';
  }

  // Determine button styles based on the background
  const primaryBtnClass = (data.backgroundStyle === 'dark' || data.backgroundStyle === 'image' || data.backgroundStyle === 'gradient')
    ? 'bg-white text-gray-900 hover:bg-gray-100'
    : 'bg-gray-900 text-white hover:bg-gray-800';
    
  const secondaryBtnClass = (data.backgroundStyle === 'dark' || data.backgroundStyle === 'image' || data.backgroundStyle === 'gradient')
    ? 'bg-transparent border border-white text-white hover:bg-white hover:bg-opacity-10'
    : 'bg-transparent border border-gray-900 text-gray-900 hover:bg-gray-100';

  return (
    <div className={`cta-section py-16 ${bgClass}`}>
      <div className="container mx-auto px-4">
        <div className={`flex flex-col ${alignmentClass} max-w-3xl mx-auto`}>
          {data.headline && (
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{data.headline}</h2>
          )}
          
          {data.subheadline && (
            <p className={`text-lg mb-8 ${
              (data.backgroundStyle === 'dark' || data.backgroundStyle === 'image' || data.backgroundStyle === 'gradient') 
                ? 'text-gray-300' 
                : 'text-gray-600'
            }`}>
              {data.subheadline}
            </p>
          )}
          
          <div className={`flex flex-wrap gap-4 mt-4 ${
            data.alignment === 'center' ? 'justify-center' : 
            data.alignment === 'right' ? 'justify-end' : ''
          }`}>
            {data.cta && (
              <a 
                href={data.cta.url} 
                className={`px-6 py-3 rounded-md font-medium ${primaryBtnClass}`}
              >
                {data.cta.label}
              </a>
            )}
            
            {data.ctaSecondary && (
              <a 
                href={data.ctaSecondary.url} 
                className={`px-6 py-3 rounded-md font-medium ${secondaryBtnClass}`}
              >
                {data.ctaSecondary.label}
              </a>
            )}
          </div>
          
          {data.testimonial && (
            <div className={`mt-10 flex items-center ${
              data.alignment === 'center' ? 'justify-center' : 
              data.alignment === 'right' ? 'justify-end' : ''
            }`}>
              {data.testimonial.avatar && (
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src={data.testimonial.avatar} 
                    alt={data.testimonial.author} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <p className="italic mb-1">"{data.testimonial.quote}"</p>
                <p className="font-medium">{data.testimonial.author}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CTASection;
