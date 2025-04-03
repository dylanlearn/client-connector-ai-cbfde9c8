
import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertMessage } from "@/components/ui/alert-message";
import { Button } from "@/components/ui/button";
import { recordClientError } from "@/utils/monitoring/api-usage";
import { toast } from "sonner";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to our monitoring service
    recordClientError(
      error.message,
      error.stack,
      errorInfo.componentStack.split('\n')[1]?.trim() || 'Unknown'
    ).catch(console.error);
    
    console.error("Uncaught error:", error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-4 max-w-xl mx-auto my-8">
          <AlertMessage type="error" title="Something went wrong">
            <p className="mb-4">
              An unexpected error occurred. Our team has been notified, but you can try reloading the page.
            </p>
            {this.state.error && (
              <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded text-sm">
                <p className="font-mono text-red-800">{this.state.error.toString()}</p>
                {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-red-600">Component Stack</summary>
                    <pre className="mt-2 whitespace-pre-wrap text-red-600 text-xs overflow-auto max-h-40">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}
            <div className="mt-6 flex gap-3">
              <Button 
                onClick={() => window.location.reload()}
                variant="default"
              >
                Reload Page
              </Button>
              <Button 
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </AlertMessage>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };

// Custom hook to help with error handling in function components
export function useErrorHandler(componentName?: string) {
  return (error: Error) => {
    console.error(`Error in ${componentName || 'component'}:`, error);
    recordClientError(
      error.message,
      error.stack,
      componentName
    ).catch(console.error);
    
    toast.error("An error occurred", {
      description: error.message,
      action: {
        label: "Reload",
        onClick: () => window.location.reload(),
      },
    });
  };
}
