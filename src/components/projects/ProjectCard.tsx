
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Draggable } from "react-beautiful-dnd";
import { formatDistanceToNow } from "date-fns";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string | null;
    client_name: string;
    status: string;
    created_at: string;
  };
  index: number;
  statusColor: string;
}

const ProjectCard = ({ project, index, statusColor }: ProjectCardProps) => {
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

export default ProjectCard;
