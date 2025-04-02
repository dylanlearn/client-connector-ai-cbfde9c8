
import { useState } from "react";
import { FileText, PlusCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmptyState from "@/components/dashboard/EmptyState";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProjects } from "@/hooks/use-projects";
import { Button } from "@/components/ui/button";
import ProjectBoard from "@/components/projects/ProjectBoard";

const Projects = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { projects, isLoading, error, updateProject } = useProjects();
  
  // Filter out archived projects
  const activeProjects = projects.filter(project => project.status !== 'archived');

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Projects</h1>
        <Button onClick={() => navigate("/new-project")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          <span className={isMobile ? "sr-only" : ""}>New Project</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg text-red-800">
          <p className="font-semibold">Error loading projects</p>
          <p className="text-sm">Please try refreshing the page.</p>
        </div>
      ) : activeProjects.length === 0 ? (
        <EmptyState 
          title="No projects yet"
          description="Create your first project to get started with DezignSync."
          buttonText="Create Project"
          buttonAction={() => navigate("/new-project")}
          icon={FileText}
        />
      ) : (
        <ProjectBoard 
          projects={activeProjects} 
          updateProject={updateProject} 
        />
      )}
    </DashboardLayout>
  );
};

export default Projects;
