
import React from "react";

interface ContactSectionProps {
  sectionIndex: number;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ sectionIndex }) => {
  return (
    <div key={sectionIndex} className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
      <div className="text-center mb-8">
        <div className="w-48 h-8 bg-gray-300 rounded mx-auto"></div>
        <div className="w-72 h-4 bg-gray-200 rounded mx-auto mt-4"></div>
      </div>
      <div className="max-w-lg mx-auto mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="w-full h-10 bg-gray-200 rounded"></div>
          <div className="w-full h-10 bg-gray-200 rounded"></div>
        </div>
        <div className="w-full h-10 bg-gray-200 rounded"></div>
        <div className="w-full h-32 bg-gray-200 rounded"></div>
        <div className="pt-4">
          <div className="w-32 h-10 bg-gray-800 rounded inline-flex items-center justify-center">
            <div className="w-20 h-4 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
