
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Project } from '@/types/project';
import { Sparkles, Grid3X3, PanelLeft } from 'lucide-react';
import WireframeList from '../components/AI/WireframeList';

interface ProjectWireframesTabProps {
  project: Project;
}

const ProjectWireframesTab: React.FC<ProjectWireframesTabProps> = ({ project }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            AI Wireframes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WireframeList projectId={project.id} />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Grid3X3 className="h-5 w-5 mr-2 text-primary" />
              Design Elements Library
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              Reusable components and design elements will appear here as you create wireframes.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PanelLeft className="h-5 w-5 mr-2 text-primary" />
              Design System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              Your project's design system will automatically update based on the wireframes you create.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectWireframesTab;
