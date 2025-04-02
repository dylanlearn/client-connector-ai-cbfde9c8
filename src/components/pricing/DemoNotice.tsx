
import { AlertMessage } from "@/components/ui/alert-message";

export const DemoNotice = () => {
  return (
    <div className="mb-8">
      <AlertMessage type="info" title="Demo Mode">
        <p>
          Stripe integration requires API keys to be configured in the Supabase Edge Function.
          The subscription buttons will show an error message in this demo environment.
        </p>
      </AlertMessage>
    </div>
  );
};
