
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface ClientProgressItemProps {
  clientName: string;
  completed: number;
  total: number;
  percentage?: number;
  lastActive?: string | null; // Changed from Date to string | null
  email?: string;
  onClick?: () => void;
}

export default function ClientProgressItem({ 
  clientName, 
  completed, 
  total, 
  lastActive,
  email,
  onClick
}: ClientProgressItemProps) {
  const progressPercentage = total > 0 ? (completed / total) * 100 : 0;
  
  return (
    <div className="space-y-2 hover:bg-gray-50 p-2 rounded-md transition-colors" onClick={onClick}>
      <div className="flex justify-between items-center text-sm">
        <div className="flex flex-col">
          <span className="font-medium truncate max-w-[180px]">{clientName}</span>
          {email && <span className="text-xs text-muted-foreground truncate max-w-[180px]">{email}</span>}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={progressPercentage === 100 ? "success" : "secondary"} className="whitespace-nowrap">
            {completed}/{total} tasks
          </Badge>
        </div>
      </div>
      
      <Progress
        value={progressPercentage}
        className="h-2"
      />
      
      {lastActive && (
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          <span>Active {formatDistanceToNow(new Date(lastActive), { addSuffix: true })}</span>
        </div>
      )}
    </div>
  );
}
