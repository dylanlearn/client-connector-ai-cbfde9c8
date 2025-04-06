
import React from "react";

interface TestimonialsSectionProps {
  sectionIndex: number;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ sectionIndex }) => {
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
};
