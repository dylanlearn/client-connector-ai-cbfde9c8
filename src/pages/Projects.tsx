
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmptyState from "@/components/dashboard/EmptyState";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProjects } from "@/hooks/use-projects";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

const ProjectCard = ({ project, onClick }) => {
  const statusColors = {
    draft: "bg-gray-200 text-gray-800",
    active: "bg-green-200 text-green-800",
    completed: "bg-blue-200 text-blue-800",
    archived: "bg-gray-200 text-gray-600"
  };

  const statusColor = statusColors[project.status] || statusColors.draft;

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold truncate">{project.title}</CardTitle>
          <Badge className={statusColor}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </Badge>
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
  );
};

const Projects = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { projects, isLoading, error } = useProjects();

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
      ) : projects.length === 0 ? (
        <EmptyState 
          title="No projects yet"
          description="Create your first project to get started with DezignSync."
          buttonText="Create Project"
          buttonAction={() => navigate("/new-project")}
          icon={FileText}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => navigate(`/projects/${project.id}`)}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Projects;
