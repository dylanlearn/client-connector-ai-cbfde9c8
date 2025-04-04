
import React from 'react';
import { ChevronRight, FileText, Folder, PenLine, Trash2 } from 'lucide-react';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

interface SiteMapSectionProps {
  section: {
    id: string;
    name: string;
    type: string;
    children?: any[];
  };
}

const SiteMapSection: React.FC<SiteMapSectionProps> = ({ section }) => {
  return (
    <AccordionItem value={section.id} className="border rounded-md mb-2 overflow-hidden">
      <AccordionTrigger className="px-4 py-3 hover:bg-gray-50">
        <div className="flex items-center">
          {section.type === 'page' ? (
            <Folder className="h-5 w-5 mr-2 text-blue-500" />
          ) : (
            <FileText className="h-5 w-5 mr-2 text-gray-500" />
          )}
          <span>{section.name}</span>
          {section.type === 'page' && section.children && section.children.length > 0 && (
            <div className="ml-2 text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
              {section.children.length}
            </div>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-3 pt-1">
        {section.children && section.children.length > 0 ? (
          <div className="space-y-2 ml-6 border-l-2 border-gray-200 pl-4 py-2">
            {section.children.map((child) => (
              <div key={child.id} className="flex items-center justify-between group">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{child.name}</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <PenLine className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 ml-6 pl-4 border-l-2 border-gray-200 py-2">
            No subsections yet
          </div>
        )}
        
        <div className="flex mt-4 space-x-2">
          <Button variant="outline" size="sm" className="text-xs">
            Add Subsection
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            Edit Section
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default SiteMapSection;
