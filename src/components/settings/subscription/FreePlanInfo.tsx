
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export function FreePlanInfo() {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Free plan limitations</AlertTitle>
      <AlertDescription>
        The free plan is limited to 3 projects and does not include advanced features.
      </AlertDescription>
    </Alert>
  );
}
