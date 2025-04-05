
import { useState, useEffect } from "react";
import { FileText, PlusCircle, Loader2, Info, Database, AlertCircle, FolderTree, Layers } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Projects = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { projects, isLoading, error, updateProject } = useProjects();
  const { generateSampleData, isGenerating } = useSampleData();
  const { refreshMemoryContext } = useMemory();
  const { initializeMemory, isInitialized } = useMemoryInitialization();
  const [view, setView] = useState<"board" | "list">(isMobile ? "list" : "board");
  
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

  // Set view to list on small screens
  useEffect(() => {
    if (isMobile && view === "board") {
      setView("list");
    }
  }, [isMobile]);

  const handleNewProject = () => {
    navigate("/new-project");
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#ee682b] via-[#8439e9] to-[#6142e7] bg-clip-text text-transparent">Projects</h1>
          <p className="text-muted-foreground">Manage and organize your design projects</p>
        </div>
        
        <div className="flex items-center gap-2">
          {activeProjects.length > 0 && (
            <div className="bg-muted/40 rounded-lg p-1 mr-2">
              <Button 
                variant={view === "board" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setView("board")}
                className={`px-3 ${isMobile ? 'hidden sm:flex' : 'flex'}`}
              >
                <Layers className="h-4 w-4 mr-1" />
                Board
              </Button>
              <Button 
                variant={view === "list" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setView("list")}
                className="px-3 flex"
              >
                <FolderTree className="h-4 w-4 mr-1" />
                List
              </Button>
            </div>
          )}
          
          <Button onClick={handleNewProject} className="bg-gradient-to-r from-[#3a8ef6] via-[#7b61ff] to-[#5f9df7] hover:opacity-90">
            <PlusCircle className="mr-2 h-4 w-4" />
            <span className={isMobile ? "sr-only sm:not-sr-only" : ""}>New Project</span>
          </Button>
        </div>
      </div>

      {activeProjects.length > 0 && (
        <Alert className="mb-6 border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/10 text-blue-800 dark:text-blue-300">
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
        <Alert variant="destructive" className="mb-6 border-l-4 border-l-destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold">Error loading projects</p>
            <p className="text-sm">{error instanceof Error ? error.message : "Please try refreshing the page."}</p>
          </AlertDescription>
        </Alert>
      ) : activeProjects.length === 0 ? (
        <div className="mt-8">
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
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800/50 rounded-lg border shadow-sm p-1 md:p-2">
          <ProjectBoard 
            projects={activeProjects} 
            updateProject={updateProject} 
            onProjectClick={handleProjectClick}
            view={view}
          />
        </div>
      )}
    </DashboardLayout>
  );
};

export default Projects;
