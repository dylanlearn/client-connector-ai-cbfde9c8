
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface CurrentPlanDisplayProps {
  status: string;
  inTrial: boolean;
  willCancel: boolean;
  expiresAt: string | null;
}

export function CurrentPlanDisplay({ 
  status, 
  inTrial, 
  willCancel, 
  expiresAt 
}: CurrentPlanDisplayProps) {
  // Format the status for display
  const getDisplayStatus = (status: string) => {
    switch(status) {
      case 'sync': return 'Sync';
      case 'sync-pro': return 'Sync Pro';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Current Plan</h3>
        <div className="flex items-center gap-2">
          <Badge variant={status === "free" ? "outline" : "default"} className="capitalize">
            {getDisplayStatus(status)}
          </Badge>
          {inTrial && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              Trial
            </Badge>
          )}
          {willCancel && (
            <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
              Cancels soon
            </Badge>
          )}
        </div>
      </div>
      
      {status !== "free" && expiresAt && (
        <div className="text-right text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {willCancel ? "Ends on" : "Next billing date"}:
          </div>
          <div className="font-medium">{format(new Date(expiresAt), "MMM d, yyyy")}</div>
        </div>
      )}
    </div>
  );
}
