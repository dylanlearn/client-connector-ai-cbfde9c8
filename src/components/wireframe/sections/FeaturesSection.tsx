
import React from "react";
import { CheckSquare } from "lucide-react";

interface FeaturesSectionProps {
  sectionIndex: number;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ sectionIndex }) => {
  return (
    <div key={sectionIndex} className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
      <div className="text-center mb-8">
        <div className="w-48 h-8 bg-gray-300 rounded mx-auto"></div>
        <div className="w-72 h-4 bg-gray-200 rounded mx-auto mt-4"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex flex-col items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <CheckSquare className="w-8 h-8 text-gray-400" />
            </div>
            <div className="w-24 h-6 bg-gray-300 rounded"></div>
            <div className="space-y-2">
              <div className="w-full h-3 bg-gray-200 rounded"></div>
              <div className="w-5/6 h-3 bg-gray-200 rounded mx-auto"></div>
              <div className="w-4/6 h-3 bg-gray-200 rounded mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
