
import React from 'react';
import { Card } from '@/components/ui/card';

interface SiteMapVisualizationProps {
  sections: {
    id: string;
    name: string;
    type: string;
    children?: any[];
  }[];
}

const SiteMapVisualization: React.FC<SiteMapVisualizationProps> = ({ sections }) => {
  return (
    <div className="w-full overflow-auto">
      <div className="min-w-[800px] p-4">
        {/* Home page node */}
        <div className="flex justify-center mb-10">
          <Card className="px-4 py-3 bg-blue-50 border-blue-200 flex items-center justify-center shadow-sm min-w-[180px]">
            <span className="font-medium">Homepage</span>
          </Card>
        </div>
        
        {/* Main pages level */}
        <div className="relative mb-16">
          <div className="absolute top-[-40px] left-1/2 h-10 w-0.5 bg-gray-300" />
          
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-300" />
          
          <div className="flex justify-between relative">
            {sections.filter(s => s.id !== '1').map((section, index) => (
              <div key={section.id} className="relative flex flex-col items-center">
                <div className="absolute top-[-20px] h-5 w-0.5 bg-gray-300" />
                <Card className="px-4 py-3 bg-gray-50 border-gray-200 flex items-center justify-center shadow-sm min-w-[140px]">
                  <span className="font-medium">{section.name}</span>
                </Card>
                
                {section.children && section.children.length > 0 && (
                  <>
                    <div className="h-10 w-0.5 bg-gray-300 mt-2" />
                    <div className="flex space-x-4 mt-2">
                      {section.children.map(child => (
                        <Card key={child.id} className="px-3 py-2 bg-white border-gray-200 flex items-center justify-center shadow-sm text-sm min-w-[120px]">
                          <span>{child.name}</span>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>Drag nodes to rearrange • Double-click to edit</p>
        </div>
      </div>
    </div>
  );
};

export default SiteMapVisualization;
