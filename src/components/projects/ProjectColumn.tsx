
import { Badge } from "@/components/ui/badge";
import { Droppable } from "react-beautiful-dnd";
import ProjectCard from "./ProjectCard";
import { Project } from "@/types/project";

interface ProjectColumnProps {
  column: {
    id: string;
    title: string;
    icon: React.ReactNode;
    color: string;
  };
  projects: (Project & { boardStatus?: string })[];
}

const ProjectColumn = ({ column, projects }: ProjectColumnProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center mb-3 font-medium">
        {column.icon}
        <h3>{column.title}</h3>
        <Badge variant="outline" className="ml-2">
          {projects.length}
        </Badge>
      </div>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="bg-gray-50 p-3 rounded-lg min-h-[300px] flex-1"
          >
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                statusColor={column.color}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default ProjectColumn;
