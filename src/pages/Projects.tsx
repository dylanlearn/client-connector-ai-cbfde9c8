
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { 
  FileText, 
  PlusCircle, 
  Loader2,
  Clock,
  CheckCheck,
  ArrowRight
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
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

// Map status to column
const statusToColumn = {
  'not_started': 0,
  'in_progress': 1,
  'ready': 2,
  'delivered': 3
};

// Map column to status
const columnToStatus = {
  0: 'not_started',
  1: 'in_progress',
  2: 'ready',
  3: 'delivered'
};

// Column definitions
const columns = [
  {
    id: 'not_started',
    title: 'Not Started',
    icon: <Clock className="h-4 w-4 mr-2" />,
    color: 'bg-gray-200 text-gray-800'
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    icon: <ArrowRight className="h-4 w-4 mr-2" />,
    color: 'bg-blue-200 text-blue-800'
  },
  {
    id: 'ready',
    title: 'Ready',
    icon: <CheckCheck className="h-4 w-4 mr-2" />,
    color: 'bg-green-200 text-green-800'
  },
  {
    id: 'delivered',
    title: 'Delivered',
    icon: <CheckCheck className="h-4 w-4 mr-2" />,
    color: 'bg-purple-200 text-purple-800'
  }
];

const ProjectCard = ({ project, index }) => {
  const statusColor = columns.find(col => col.id === project.status)?.color || 'bg-gray-200 text-gray-800';
  
  return (
    <Draggable draggableId={project.id} index={index}>
      {(provided) => (
        <Card 
          className="mb-3 cursor-pointer hover:shadow-md transition-shadow duration-200"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-semibold truncate">{project.title}</CardTitle>
              <Badge className={statusColor}>
                {project.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
      )}
    </Draggable>
  );
};

const Projects = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { projects, isLoading, error, updateProject } = useProjects();
  
  // Filter out archived projects
  const activeProjects = projects.filter(project => project.status !== 'archived');

  // Normalize project statuses to match our columns
  const normalizedProjects = activeProjects.map(project => {
    // Convert from existing statuses to new board statuses
    let newStatus = 'not_started';
    
    if (project.status === 'draft') newStatus = 'not_started';
    else if (project.status === 'active') newStatus = 'in_progress';
    else if (project.status === 'completed') newStatus = 'ready';
    else if (project.status === 'archived') newStatus = 'delivered';
    
    return {
      ...project,
      status: newStatus
    };
  });

  // Create column data
  const columnData = columns.map(column => {
    return {
      ...column,
      projects: normalizedProjects.filter(p => p.status === column.id)
    };
  });

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // Drop outside of any droppable
    if (!destination) return;

    // Drop in the same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    // Get the new status from the destination column
    const newStatus = destination.droppableId;
    
    // Find the project
    const project = projects.find(p => p.id === draggableId);
    
    if (project) {
      // Update the project status
      updateProject.mutate({
        id: project.id,
        status: newStatus
      });
      
      toast.success(`Project moved to ${columns.find(col => col.id === newStatus)?.title}`);
    }
  };

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
      ) : normalizedProjects.length === 0 ? (
        <EmptyState 
          title="No projects yet"
          description="Create your first project to get started with DezignSync."
          buttonText="Create Project"
          buttonAction={() => navigate("/new-project")}
          icon={FileText}
        />
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {columns.map((column, columnIndex) => (
              <div key={column.id} className="flex flex-col">
                <div className="flex items-center mb-3 font-medium">
                  {column.icon}
                  <h3>{column.title}</h3>
                  <Badge variant="outline" className="ml-2">
                    {columnData[columnIndex].projects.length}
                  </Badge>
                </div>
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="bg-gray-50 p-3 rounded-lg min-h-[300px] flex-1"
                    >
                      {columnData[columnIndex].projects.map((project, index) => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          index={index}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}
    </DashboardLayout>
  );
};

export default Projects;
