
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Project } from "@/types/project";

interface ProjectSelectorProps {
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  projects: Project[];
  isLoading: boolean;
}

export default function ProjectSelector({
  selectedProjectId,
  setSelectedProjectId,
  projects,
  isLoading
}: ProjectSelectorProps) {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="project-select" className="text-right">
        Project
      </Label>
      <div className="col-span-3">
        <Select 
          value={selectedProjectId || ""} 
          onValueChange={(value) => setSelectedProjectId(value || null)}
        >
          <SelectTrigger id="project-select">
            <SelectValue placeholder="Select a project (optional)" />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <SelectItem value="loading" disabled>Loading projects...</SelectItem>
            ) : projects.length === 0 ? (
              <SelectItem value="none" disabled>No projects available</SelectItem>
            ) : (
              <>
                <SelectItem value="">No project</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.title}
                  </SelectItem>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          Selecting a project will prefill client details
        </p>
      </div>
    </div>
  );
}
