
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  PlusCircle, 
  Loader2, 
  MoreVertical, 
  Archive, 
  Trash2, 
  AlertTriangle 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmptyState from "@/components/dashboard/EmptyState";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProjects } from "@/hooks/use-projects";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { archiveProject, deleteProject } from "@/utils/client-service";

const ProjectCard = ({ project, onClick, onArchive, onDelete }) => {
  const statusColors = {
    draft: "bg-gray-200 text-gray-800",
    active: "bg-green-200 text-green-800",
    completed: "bg-blue-200 text-blue-800",
    archived: "bg-gray-200 text-gray-600"
  };

  const statusColor = statusColors[project.status] || statusColors.draft;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [deleteWithLinks, setDeleteWithLinks] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await onDelete(project.id, deleteWithLinks);
      toast.success("Project deleted successfully");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleArchive = async (e) => {
    e.stopPropagation();
    setIsArchiving(true);
    try {
      await onArchive(project.id);
      toast.success("Project archived successfully");
      setIsArchiveDialogOpen(false);
    } catch (error) {
      console.error("Error archiving project:", error);
      toast.error("Failed to archive project");
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <>
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow duration-200"
        onClick={onClick}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold truncate">{project.title}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={statusColor}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    setIsArchiveDialogOpen(true);
                  }}>
                    <Archive className="mr-2 h-4 w-4" />
                    Archive Project
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDeleteDialogOpen(true);
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <CardDescription className="truncate">{project.client_name}</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-gray-600 line-clamp-2">
            {project.description || "No description provided"}
          </p>
        </CardContent>
        <CardFooter className="pt-2 text-xs text-gray-500">
          Created {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
        </CardFooter>
      </Card>

      {/* Archive Dialog */}
      <AlertDialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This project will be moved to the archived status. You can still access it, but it will no longer appear in your active projects.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleArchive}
              disabled={isArchiving}
            >
              {isArchiving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Archive className="mr-2 h-4 w-4" />
              )}
              Archive Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>This action cannot be undone. This will permanently delete the project and its data.</p>
              
              <div className="flex items-center space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <p className="text-sm text-amber-800">
                  What would you like to do with client links associated with this project?
                </p>
              </div>
              
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="delete-links"
                  checked={deleteWithLinks}
                  onChange={() => setDeleteWithLinks(!deleteWithLinks)}
                  className="mt-1"
                />
                <label htmlFor="delete-links" className="text-sm">
                  Also delete all client links associated with this project
                </label>
              </div>
              
              <p className="text-sm text-muted-foreground">
                If unchecked, client links will be kept but unlinked from this project.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const Projects = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { projects, isLoading, error, deleteProject: deleteProjectHook, updateProject } = useProjects();

  const handleArchiveProject = async (projectId) => {
    try {
      await archiveProject(projectId);
      // Update the local projects state
      await updateProject.mutateAsync({ id: projectId, status: 'archived' });
      return true;
    } catch (error) {
      console.error("Error archiving project:", error);
      throw error;
    }
  };

  const handleDeleteProject = async (projectId, deleteLinks) => {
    try {
      await deleteProject(projectId, deleteLinks);
      // Remove the project from the local state
      deleteProjectHook.mutate(projectId);
      return true;
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => navigate(`/projects/${project.id}`)}
              onArchive={handleArchiveProject}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Projects;
