
import React from "react";

interface FooterSectionProps {
  sectionIndex: number;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ sectionIndex }) => {
  return (
    <div key={sectionIndex} className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-4">
          <div className="w-20 h-8 bg-gray-300 rounded"></div>
          <div className="space-y-2">
            <div className="w-4/5 h-3 bg-gray-200 rounded"></div>
            <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
          </div>
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-8 h-8 rounded-full bg-gray-200"></div>
            ))}
          </div>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-3">
            <div className="w-24 h-6 bg-gray-300 rounded"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map(j => (
                <div key={j} className="w-4/5 h-3 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 mt-6 pt-4 text-center">
        <div className="w-48 h-3 bg-gray-200 rounded mx-auto"></div>
      </div>
    </div>
  );
};
