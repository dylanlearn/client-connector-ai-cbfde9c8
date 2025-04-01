
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "@/components/dashboard/EmptyState";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RecentProjectsProps {
  projects: any[];
}

const RecentProjects = ({ projects }: RecentProjectsProps) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
        <CardDescription>
          Create or continue working on your design projects
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default RecentProjects;
