
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Project } from '@/types/project';
import ProjectSummaryTab from './tabs/ProjectSummaryTab';
import ProjectSiteMapTab from './tabs/ProjectSiteMapTab';
import ProjectDesignTab from './tabs/ProjectDesignTab';
import ProjectFeedbackTab from './tabs/ProjectFeedbackTab';
import ProjectAnalyticsTab from './tabs/ProjectAnalyticsTab';

interface ProjectDetailTabsProps {
  project: Project;
}

const ProjectDetailTabs: React.FC<ProjectDetailTabsProps> = ({ project }) => {
  const [activeTab, setActiveTab] = useState('summary');
  
  return (
    <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-5 w-full mb-8">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="sitemap">Site Map</TabsTrigger>
        <TabsTrigger value="design">Design</TabsTrigger>
        <TabsTrigger value="feedback">Feedback</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      
      <TabsContent value="summary" className="space-y-4">
        <ProjectSummaryTab project={project} />
      </TabsContent>
      
      <TabsContent value="sitemap" className="space-y-4">
        <ProjectSiteMapTab project={project} />
      </TabsContent>
      
      <TabsContent value="design" className="space-y-4">
        <ProjectDesignTab project={project} />
      </TabsContent>
      
      <TabsContent value="feedback" className="space-y-4">
        <ProjectFeedbackTab project={project} />
      </TabsContent>
      
      <TabsContent value="analytics" className="space-y-4">
        <ProjectAnalyticsTab project={project} />
      </TabsContent>
    </Tabs>
  );
};

export default ProjectDetailTabs;
