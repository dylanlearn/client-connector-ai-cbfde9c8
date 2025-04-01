
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useProjects } from "@/hooks/use-projects";

interface ClientInfoFormProps {
  clientName: string;
  setClientName: (name: string) => void;
  clientEmail: string;
  setClientEmail: (email: string) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
}

const ClientInfoForm = ({
  clientName,
  setClientName,
  clientEmail,
  setClientEmail,
  selectedProjectId,
  setSelectedProjectId
}: ClientInfoFormProps) => {
  const { projects, isLoading: isLoadingProjects } = useProjects();

  // Prefill client information if a project is selected
  useEffect(() => {
    if (selectedProjectId) {
      const selectedProject = projects.find(p => p.id === selectedProjectId);
      if (selectedProject) {
        setClientName(selectedProject.client_name);
        setClientEmail(selectedProject.client_email);
      }
    }
  }, [selectedProjectId, projects, setClientName, setClientEmail]);

  return (
    <div className="grid gap-4 py-4">
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
              {isLoadingProjects ? (
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
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="client-name" className="text-right">
          Name
        </Label>
        <Input
          id="client-name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="col-span-3"
          placeholder="Client Name"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="client-email" className="text-right">
          Email
        </Label>
        <Input
          id="client-email"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          className="col-span-3"
          placeholder="client@example.com"
          type="email"
        />
      </div>
    </div>
  );
};

export default ClientInfoForm;
