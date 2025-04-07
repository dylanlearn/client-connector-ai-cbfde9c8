
import React from "react";
import { PricingComponentProps } from "@/types/component-library";

interface PricingSectionProps {
  sectionIndex: number;
  data?: Partial<PricingComponentProps>;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ sectionIndex, data }) => {
  // Fallback to wireframe display if no specific data is provided
  if (!data) {
    return (
      <div key={sectionIndex} className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
        <div className="text-center mb-8">
          <div className="w-48 h-8 bg-gray-300 rounded mx-auto"></div>
          <div className="w-72 h-4 bg-gray-200 rounded mx-auto mt-4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`border ${i === 2 ? 'border-gray-400' : 'border-gray-200'} rounded-lg p-4 bg-white ${i === 2 ? 'relative transform md:scale-105' : ''}`}
            >
              {i === 2 && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-100 px-3 py-1 rounded text-xs">
                  Popular
                </div>
              )}
              <div className="text-center border-b border-gray-100 pb-4">
                <div className="w-20 h-6 bg-gray-300 rounded mx-auto"></div>
                <div className="w-24 h-8 bg-gray-300 rounded mx-auto mt-4"></div>
                <div className="w-32 h-3 bg-gray-200 rounded mx-auto mt-2"></div>
              </div>
              <div className="py-4 space-y-2">
                {[1, 2, 3, 4].map(j => (
                  <div key={j} className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                    <div className="w-full h-3 bg-gray-200 rounded ml-3"></div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="w-full h-10 bg-gray-800 rounded flex items-center justify-center">
                  <div className="w-20 h-4 bg-gray-100 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // When actual component data is available, render the real pricing component
  return (
    <div key={sectionIndex} className={`pricing-section ${data.backgroundStyle === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'} py-12`}>
      <div className="container mx-auto px-4">
        {(data.title || data.description) && (
          <div className={`text-${data.alignment || 'center'} mb-12`}>
            {data.title && <h2 className="text-3xl font-bold mb-4">{data.title}</h2>}
            {data.description && <p className="text-lg text-gray-500 dark:text-gray-300">{data.description}</p>}
          </div>
        )}
        
        <div className={`grid grid-cols-1 md:grid-cols-${data.plans?.length || 3} gap-8`}>
          {data.plans?.map((plan, index) => (
            <div 
              key={index}
              className={`pricing-plan relative border rounded-lg p-6 ${
                plan.badge ? 'border-indigo-500 shadow-lg' : 'border-gray-200'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 right-4 bg-indigo-600 text-white px-3 py-1 text-xs rounded-full">
                  {plan.badge}
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="text-3xl font-bold my-4">{plan.price}</div>
                {plan.description && <p className="text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>}
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto">
                <a 
                  href={plan.cta.url} 
                  className={`block w-full py-2 px-4 text-center rounded ${
                    plan.badge ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  } transition duration-200`}
                >
                  {plan.cta.label}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
