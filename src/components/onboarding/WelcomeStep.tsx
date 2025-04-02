
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WelcomeStepProps {
  onContinue: () => void;
}

export function WelcomeStep({ onContinue }: WelcomeStepProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl text-center">
          Welcome to DezignSync
        </CardTitle>
        <CardDescription className="text-center text-base md:text-lg">
          Let's get your account set up to make the most of our platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Empty content for welcome step */}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          onClick={onContinue}
          className="w-full md:w-auto px-8"
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}
