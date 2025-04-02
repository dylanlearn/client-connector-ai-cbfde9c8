
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold mb-3">Subscription Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <div className="text-sm text-muted-foreground">Plan</div>
            <div className="font-medium capitalize">{status}</div>
          </div>
          {inTrial && (
            <Alert className="bg-amber-50 text-amber-800 border-amber-200">
              <AlertDescription>
                You're currently in a trial period ending on {expiresAt && format(new Date(expiresAt), "MMM d, yyyy")}.
              </AlertDescription>
            </Alert>
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
            <Alert className="bg-blue-50 text-blue-800 border-blue-200">
              <AlertDescription>
                Your subscription will remain active until {expiresAt && format(new Date(expiresAt), "MMM d, yyyy")}.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
