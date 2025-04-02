
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertMessage } from "@/components/ui/alert-message";

interface SubscriptionDetailsProps {
  status: string;
  expiresAt: string | null;
  inTrial: boolean;
  willCancel: boolean;
  isActive: boolean;
}

export function SubscriptionDetails({ 
  status, 
  expiresAt, 
  inTrial, 
  willCancel, 
  isActive 
}: SubscriptionDetailsProps) {
  // Format the status for display
  const getDisplayStatus = (status: string) => {
    switch(status) {
      case 'sync': return 'Sync';
      case 'sync-pro': return 'Sync Pro';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold mb-3">Subscription Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <div className="text-sm text-muted-foreground">Plan</div>
            <div className="font-medium capitalize">{getDisplayStatus(status)}</div>
          </div>
          {inTrial && (
            <AlertMessage type="warning" className="text-amber-800">
              You're currently in a trial period ending on {expiresAt && format(new Date(expiresAt), "MMM d, yyyy")}.
            </AlertMessage>
          )}
        </div>
        <div className="space-y-3">
          <div>
            <div className="text-sm text-muted-foreground">Status</div>
            <div className="font-medium">
              {willCancel 
                ? "Cancels at end of billing period" 
                : isActive 
                  ? "Active" 
                  : "Inactive"}
            </div>
          </div>
          {willCancel && (
            <AlertMessage type="info" className="text-blue-800">
              Your subscription will remain active until {expiresAt && format(new Date(expiresAt), "MMM d, yyyy")}.
            </AlertMessage>
          )}
        </div>
      </div>
    </div>
  );
}
