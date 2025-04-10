
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface WireframeErrorStateProps {
  error: string | Error;
  onRetry?: () => void;
}

const WireframeErrorState: React.FC<WireframeErrorStateProps> = ({ error, onRetry }) => {
  const errorMessage = error instanceof Error ? error.message : error;
  
  return (
    <Card className="border-destructive/50">
      <CardHeader className="bg-destructive/10">
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          Wireframe Generation Failed
        </CardTitle>
        <CardDescription>
          There was an error generating your wireframe
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="rounded-md bg-destructive/10 p-4 text-destructive">
          <p className="font-mono text-sm">{errorMessage}</p>
        </div>
      </CardContent>
      {onRetry && (
        <CardFooter>
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default WireframeErrorState;
