
import { Button } from "@/components/ui/button";
import { PlusCircle, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ClientLinksEmptyState() {
  const navigate = useNavigate();

  const handleCreateProject = () => {
    navigate('/new-project');
  };

  return (
    <div className="text-center py-10 border rounded-lg">
      <div className="space-y-3">
        <div className="bg-primary/10 h-12 w-12 rounded-full inline-flex items-center justify-center">
          <PlusCircle className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium">No client links found</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Create a client portal link to share with your clients and track their progress.
        </p>
        <div className="pt-3">
          <Button variant="outline" onClick={handleCreateProject}>
            <Briefcase className="mr-2 h-4 w-4" />
            Create a Project First
          </Button>
        </div>
      </div>
    </div>
  );
}
