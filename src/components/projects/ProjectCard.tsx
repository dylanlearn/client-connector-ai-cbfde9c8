
import { Draggable } from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types/project";
import { useNavigate } from "react-router-dom";

interface ProjectCardProps {
  project: Project & { boardStatus?: string };
  index: number;
  statusColor: string;
}

const ProjectCard = ({ project, index, statusColor }: ProjectCardProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/project/${project.id}`);
  };

  return (
    <Draggable draggableId={project.id} index={index}>
      {(provided) => (
        <Card 
          className="mb-3 cursor-pointer hover:shadow-md transition-shadow"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleClick}
        >
          <CardHeader className="p-3 pb-0">
            <CardTitle className="text-base flex justify-between items-start">
              <span className="truncate mr-2">{project.title}</span>
              <Badge className={`${statusColor} text-xs font-normal`}>
                {project.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-2">
            <div className="text-xs text-gray-600">
              <p className="truncate">{project.client_name}</p>
              <p className="truncate">{project.client_email}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

export default ProjectCard;
