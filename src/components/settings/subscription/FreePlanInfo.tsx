
import { AlertMessage } from "@/components/ui/alert-message";

export function FreePlanInfo() {
  return (
    <AlertMessage type="info" title="Free plan limitations">
      The free plan is limited to 3 projects and does not include advanced features.
    </AlertMessage>
  );
}
