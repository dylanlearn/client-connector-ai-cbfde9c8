
import React from "react";
import { TestimonialComponentProps } from "@/types/component-library";

interface TestimonialsSectionProps {
  sectionIndex: number;
  data?: Partial<TestimonialComponentProps>;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ sectionIndex, data }) => {
  // Fallback to wireframe display if no specific data is provided
  if (!data) {
    return (
      <div key={sectionIndex} className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
        <div className="text-center mb-8">
          <div className="w-48 h-8 bg-gray-300 rounded mx-auto"></div>
          <div className="w-72 h-4 bg-gray-200 rounded mx-auto mt-4"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          {[1, 2].map(i => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="space-y-2 mb-4">
                <div className="w-full h-3 bg-gray-200 rounded"></div>
                <div className="w-5/6 h-3 bg-gray-200 rounded"></div>
                <div className="w-4/6 h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="flex items-center mt-4">
                <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                <div className="ml-4">
                  <div className="w-24 h-4 bg-gray-300 rounded"></div>
                  <div className="w-32 h-3 bg-gray-200 rounded mt-2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // When actual component data is available, render the real testimonial component
  return (
    <div key={sectionIndex} className={`testimonials-section ${data.backgroundStyle === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'} py-12`}>
      <div className="container mx-auto px-4">
        {(data.title || data.subtitle) && (
          <div className={`text-${data.alignment || 'center'} mb-12`}>
            {data.title && <h2 className="text-3xl font-bold mb-4">{data.title}</h2>}
            {data.subtitle && <p className="text-lg text-gray-500 dark:text-gray-300">{data.subtitle}</p>}
          </div>
        )}
        
        <div className={`grid grid-cols-1 ${data.testimonials?.length > 1 ? 'md:grid-cols-2 lg:grid-cols-3' : ''} gap-8`}>
          {data.testimonials?.map((testimonial, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="mb-4">
                {data.mediaType === 'avatar' && testimonial.avatar && (
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
                    <img src={testimonial.avatar} alt={testimonial.author} className="w-full h-full object-cover" />
                  </div>
                )}
                {data.mediaType === 'logo' && testimonial.brandLogo && (
                  <div className="h-10 mb-4">
                    <img src={testimonial.brandLogo} alt="Brand" className="h-full" />
                  </div>
                )}
              </div>
              
              <blockquote className="text-lg mb-4 italic">"{testimonial.quote}"</blockquote>
              
              <div className="mt-4">
                <p className="font-bold">{testimonial.author}</p>
                {testimonial.role && <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
