
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Project } from '@/types/project';
import { FileText, BarChart4, MessageSquare, Layers, BoxIcon, Grid3X3 } from 'lucide-react';
import ProjectSummaryTab from './tabs/ProjectSummaryTab';
import ProjectSiteMapTab from './tabs/ProjectSiteMapTab';
import ProjectAnalyticsTab from './tabs/ProjectAnalyticsTab';
import ProjectFeedbackTab from './tabs/ProjectFeedbackTab';
import ProjectDesignTab from './tabs/ProjectDesignTab';
import ProjectWireframesTab from './tabs/ProjectWireframesTab';

interface ProjectDetailTabsProps {
  project: Project;
}

const ProjectDetailTabs: React.FC<ProjectDetailTabsProps> = ({ project }) => {
  const [activeTab, setActiveTab] = useState('summary');
  
  return (
    <Tabs
      defaultValue="summary"
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="w-full grid grid-cols-3 md:grid-cols-6 mb-8">
        <TabsTrigger value="summary" className="flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">Summary</span>
        </TabsTrigger>
        <TabsTrigger value="sitemap" className="flex items-center">
          <Grid3X3 className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">Site Map</span>
        </TabsTrigger>
        <TabsTrigger value="wireframes" className="flex items-center">
          <Layers className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">Wireframes</span>
        </TabsTrigger>
        <TabsTrigger value="design" className="flex items-center">
          <BoxIcon className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">Design</span>
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center">
          <BarChart4 className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">Analytics</span>
        </TabsTrigger>
        <TabsTrigger value="feedback" className="flex items-center">
          <MessageSquare className="h-4 w-4 mr-2" />
          <span className="hidden md:inline">Feedback</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="summary">
        <ProjectSummaryTab project={project} />
      </TabsContent>
      
      <TabsContent value="sitemap">
        <ProjectSiteMapTab project={project} />
      </TabsContent>
      
      <TabsContent value="wireframes">
        <ProjectWireframesTab project={project} />
      </TabsContent>
      
      <TabsContent value="design">
        <ProjectDesignTab project={project} />
      </TabsContent>
      
      <TabsContent value="analytics">
        <ProjectAnalyticsTab project={project} />
      </TabsContent>
      
      <TabsContent value="feedback">
        <ProjectFeedbackTab project={project} />
      </TabsContent>
    </Tabs>
  );
};

export default ProjectDetailTabs;
