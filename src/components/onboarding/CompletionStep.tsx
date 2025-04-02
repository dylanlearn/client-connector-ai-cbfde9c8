
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface CompletionStepProps {
  onFinish: () => void;
}

export function CompletionStep({ onFinish }: CompletionStepProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl text-center">
          Set up complete!
        </CardTitle>
        <CardDescription className="text-center text-base md:text-lg">
          You're all set to start using DezignSync.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-indigo-600" />
          </div>
          <p className="text-lg mb-4">
            You've successfully set up your DezignSync account.
          </p>
          <p className="text-gray-600">
            Your 3-day free trial has started. You're now ready to create your first project and start collaborating with clients.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          onClick={onFinish}
          className="w-full md:w-auto px-8"
        >
          Go to Dashboard
        </Button>
      </CardFooter>
    </Card>
  );
}
