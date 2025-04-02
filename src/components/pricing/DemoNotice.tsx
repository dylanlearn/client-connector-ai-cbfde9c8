
import { AlertMessage } from "@/components/ui/alert-message";

export const DemoNotice = () => {
  return (
    <div className="mb-8">
      <AlertMessage type="success" title="Live Mode Active">
        <p>
          Stripe integration is now configured with live API keys. Subscriptions and payments will be processed in real-time.
        </p>
      </AlertMessage>
    </div>
  );
};
