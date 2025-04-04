
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

// Map from board status to Project status type
const boardToProjectStatus: Record<string, Project['status']> = {
  'not_started': 'draft',
  'in_progress': 'active',
  'ready': 'completed',
  'archived': 'archived',
  'delivered': 'archived' // Map delivered to archived as well
};

// Map from Project status to board status
const projectToBoardStatus: Record<Project['status'], string> = {
  'draft': 'not_started',
  'active': 'in_progress',
  'completed': 'ready',
  'archived': 'delivered'
};

interface ProjectBoardProps {
  projects: Project[];
  updateProject: any;
}

const ProjectBoard = ({ projects, updateProject }: ProjectBoardProps) => {
  // Normalize project statuses to match our columns
  const normalizedProjects = projects.map(project => {
    // Get board status from project status
    const boardStatus = projectToBoardStatus[project.status];
    
    return {
      ...project,
      // This is just for internal use in the board component, not changing the actual project status
      boardStatus
    };
  });

  // Create column data
  const columnData = columns.map(column => {
    return {
      ...column,
      // Filter projects that match this column's id
      projects: normalizedProjects.filter(p => p.boardStatus === column.id)
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

    // Get the new board status from the destination column
    const newBoardStatus = destination.droppableId;
    
    // Map board status to project status
    const newProjectStatus = boardToProjectStatus[newBoardStatus];
    
    // Find the project
    const project = projects.find(p => p.id === draggableId);
    
    if (project) {
      // Update the project status with proper typed value
      updateProject.mutate({
        id: project.id,
        status: newProjectStatus
      });
      
      toast.success(`Project moved to ${columns.find(col => col.id === newBoardStatus)?.title}`);
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
