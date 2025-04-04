
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProjectDetailHeader from "@/components/project-detail/ProjectDetailHeader";
import ProjectDetailTabs from "@/components/project-detail/ProjectDetailTabs";
import { useProjectDetail } from '@/hooks/use-project-detail';

/**
 * Comprehensive Project Detail page that displays consolidated information
 * from various sources like Design Picker, Intake Form, Website Analyzer etc.
 */
const ProjectDetail = () => {
  const { id } = useParams();
  const { project, isLoading, error } = useProjectDetail(id);
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8 px-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded-md w-full"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (error || !project) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Project</h2>
            <p className="text-red-600">{error?.message || "Project not found. Please check the URL and try again."}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 px-4">
        <ProjectDetailHeader project={project} />
        <ProjectDetailTabs project={project} />
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetail;
