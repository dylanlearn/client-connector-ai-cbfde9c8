
import React from 'react';
import { LoadingSpinner } from './loading-spinner';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingStateWrapperProps {
  isLoading: boolean;
  error: Error | null;
  children: React.ReactNode;
  loadingMessage?: string;
  errorTitle?: string;
  emptyState?: React.ReactNode;
  isEmpty?: boolean;
  className?: string;
  loadingComponent?: React.ReactNode;
}

export const LoadingStateWrapper: React.FC<LoadingStateWrapperProps> = ({
  isLoading,
  error,
  children,
  loadingMessage = 'Loading...',
  errorTitle = 'Error',
  emptyState,
  isEmpty = false,
  className,
  loadingComponent
}) => {
  return (
    <div className={cn('relative w-full', className)}>
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          {loadingComponent || (
            <div className="flex flex-col items-center gap-2">
              <LoadingSpinner size="lg" />
              <p className="text-sm text-muted-foreground">{loadingMessage}</p>
            </div>
          )}
        </div>
      )}
      
      {!isLoading && error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{errorTitle}</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      
      {!isLoading && !error && isEmpty && emptyState}
      
      {!isLoading && !error && !isEmpty && children}
    </div>
  );
};

export default LoadingStateWrapper;
