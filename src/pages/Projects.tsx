
import { useState, useEffect } from "react";
import { FileText, PlusCircle, Loader2, Info, Database, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmptyState from "@/components/dashboard/EmptyState";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProjects } from "@/hooks/use-projects";
import { Button } from "@/components/ui/button";
import ProjectBoard from "@/components/projects/ProjectBoard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSampleData } from "@/hooks/use-sample-data";
import { useMemory } from "@/contexts/ai/MemoryContext";
import { useMemoryInitialization } from "@/hooks/use-memory-initialization";

const Projects = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { projects, isLoading, error, updateProject } = useProjects();
  const { generateSampleData, isGenerating } = useSampleData();
  const { refreshMemoryContext } = useMemory();
  const { initializeMemory, isInitialized } = useMemoryInitialization();
  
  // Filter out archived projects for display
  const activeProjects = projects.filter(project => project.status !== 'archived');

  // Check memory initialization when projects load
  useEffect(() => {
    if (activeProjects.length > 0 && !isInitialized) {
      // Initialize memory with the first project if available
      initializeMemory(activeProjects[0].id);
    }
    
    // Refresh memory context when projects change
    if (activeProjects.length > 0) {
      refreshMemoryContext(activeProjects[0].id);
    }
  }, [activeProjects, isInitialized, initializeMemory, refreshMemoryContext]);

  const handleNewProject = () => {
    navigate("/new-project");
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Projects</h1>
        <Button onClick={handleNewProject}>
          <PlusCircle className="mr-2 h-4 w-4" />
          <span className={isMobile ? "sr-only" : ""}>New Project</span>
        </Button>
      </div>

      {activeProjects.length > 0 && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription>
            Click on any project card to view detailed information, notes, site map, and wireframes.
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold">Error loading projects</p>
            <p className="text-sm">{error instanceof Error ? error.message : "Please try refreshing the page."}</p>
          </AlertDescription>
        </Alert>
      ) : activeProjects.length === 0 ? (
        <EmptyState 
          title="No projects yet"
          description="Create your first project to get started with DezignSync."
          buttonText="Create Project"
          buttonAction={handleNewProject}
          secondaryButton={
            <Button 
              variant="outline" 
              onClick={generateSampleData} 
              disabled={isGenerating}
              className="w-full sm:w-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Generate Sample Data
                </>
              )}
            </Button>
          }
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
