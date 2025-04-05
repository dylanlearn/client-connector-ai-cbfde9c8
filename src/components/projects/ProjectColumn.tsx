
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface ProjectColumnProps {
  title: string;
  count: number;
  children: React.ReactNode;
}

const ProjectColumn: React.FC<ProjectColumnProps> = ({ title, count, children }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center mb-3 font-medium">
        <h3 className="capitalize text-sm md:text-base">{title}</h3>
        <Badge variant="outline" className="ml-2">
          {count}
        </Badge>
      </div>
      <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg min-h-[300px] flex-1 overflow-y-auto">
        <div className="space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ProjectColumn;
