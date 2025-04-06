
import React from "react";

interface PricingSectionProps {
  sectionIndex: number;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ sectionIndex }) => {
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
};
