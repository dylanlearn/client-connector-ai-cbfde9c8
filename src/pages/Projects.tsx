
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmptyState from "@/components/dashboard/EmptyState";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useIsMobile } from "@/hooks/use-mobile";

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const isMobile = useIsMobile();

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Projects</h1>
        <Button onClick={() => navigate("/new-project")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          <span className={isMobile ? "sr-only" : ""}>New Project</span>
        </Button>
      </div>

      {projects.length === 0 ? (
        <EmptyState 
          title="No projects yet"
          description="Create your first project to get started with DezignSync."
          buttonText="Create Project"
          buttonAction={() => navigate("/new-project")}
          icon={FileText}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Project cards would go here */}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Projects;
