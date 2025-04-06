
import React from "react";

interface GenericSectionProps {
  sectionIndex: number;
}

export const GenericSection: React.FC<GenericSectionProps> = ({ sectionIndex }) => {
  return (
    <div key={sectionIndex} className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
      <div className="text-center mb-4">
        <div className="w-48 h-8 bg-gray-300 rounded mx-auto"></div>
        <div className="w-72 h-4 bg-gray-200 rounded mx-auto mt-4"></div>
      </div>
      <div className="space-y-4 mt-8">
        <div className="w-full h-16 bg-gray-200 rounded"></div>
        <div className="w-full h-16 bg-gray-200 rounded"></div>
        <div className="w-full h-16 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};
