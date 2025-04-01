
import { Button } from "@/components/ui/button";
import { UserPlus, RefreshCw } from "lucide-react";

interface ClientManagerHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
  onCreateLink: () => void;
}

export default function ClientManagerHeader({ 
  isLoading,
  onRefresh, 
  onCreateLink 
}: ClientManagerHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 className="text-3xl font-bold">Client Management</h1>
        <p className="text-muted-foreground">Create and manage client access portals</p>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
        
        <Button size="sm" onClick={onCreateLink}>
          <UserPlus className="h-4 w-4 mr-2" />
          New Client
        </Button>
      </div>
    </div>
  );
}
