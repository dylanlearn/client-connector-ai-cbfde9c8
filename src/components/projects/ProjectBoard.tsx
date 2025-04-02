
import { DragDropContext } from "react-beautiful-dnd";
import { Clock, ArrowRight, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import ProjectColumn from "./ProjectColumn";
import { Project } from "@/types/project";

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

interface ProjectBoardProps {
  projects: Project[];
  updateProject: any;
}

const ProjectBoard = ({ projects, updateProject }: ProjectBoardProps) => {
  // Normalize project statuses to match our columns
  const normalizedProjects = projects.map(project => {
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
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column, columnIndex) => (
          <ProjectColumn 
            key={column.id} 
            column={column} 
            projects={columnData[columnIndex].projects} 
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default ProjectBoard;
