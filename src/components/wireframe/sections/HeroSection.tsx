
import React from "react";
import { Image } from "lucide-react";

interface HeroSectionProps {
  sectionIndex: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ sectionIndex }) => {
  return (
    <div key={sectionIndex} className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <div className="w-20 h-8 bg-gray-300 rounded"></div>
        <div className="hidden sm:flex space-x-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-12 h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="w-24 h-8 bg-gray-800 rounded"></div>
      </div>
      <div className="flex flex-col sm:flex-row gap-6 mt-12">
        <div className="flex-1 space-y-4">
          <div className="w-3/4 h-10 bg-gray-300 rounded"></div>
          <div className="space-y-2">
            <div className="w-full h-4 bg-gray-200 rounded"></div>
            <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
            <div className="w-4/6 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="pt-4">
            <div className="w-32 h-10 bg-gray-800 rounded inline-flex items-center justify-center">
              <div className="w-20 h-4 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
            <Image className="w-12 h-12 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
