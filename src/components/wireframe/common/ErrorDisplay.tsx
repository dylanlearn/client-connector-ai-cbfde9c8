
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  error: Error | null;
  title?: string;
  onRetry?: () => void;
  onClearError?: () => void;
  showRetry?: boolean;
  className?: string;
}

/**
 * Standardized error display component for consistent error UI
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  title = 'An error occurred',
  onRetry,
  onClearError,
  showRetry = false,
  className = '',
}) => {
  if (!error) return null;

  return (
    <Alert variant="destructive" className={`mb-4 ${className}`}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p className="mb-2">{error.message}</p>
        <div className="flex gap-2 mt-2">
          {showRetry && onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Retry
            </Button>
          )}
          
          {onClearError && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearError}
            >
              Dismiss
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ErrorDisplay;
