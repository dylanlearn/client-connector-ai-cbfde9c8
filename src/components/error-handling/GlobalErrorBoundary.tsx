
import React, { Component, ErrorInfo, ReactNode } from "react";
import { ErrorHandler } from "@/utils/error-handler";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";

interface GlobalErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
  userId?: string;
}

interface GlobalErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * A global error boundary component that catches unhandled errors
 * and prevents the entire application from crashing
 */
export class GlobalErrorBoundary extends Component<GlobalErrorBoundaryProps, GlobalErrorBoundaryState> {
  constructor(props: GlobalErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<GlobalErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    
    // Use the ErrorHandler to standardize error handling
    ErrorHandler.handleError(
      error,
      this.props.componentName || 'GlobalErrorBoundary',
      this.props.userId
    );
    
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  handleReload = (): void => {
    window.location.reload();
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Render custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-6 max-w-2xl mx-auto my-8 border border-red-200 rounded-lg bg-red-50">
          <Alert variant="destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg">Something went wrong</AlertTitle>
            <AlertDescription>
              <div className="mt-2">
                <p className="mb-4">
                  An unexpected error occurred. Our team has been notified, but you can try reloading the page.
                </p>
                {this.state.error && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded">
                    <p className="font-mono text-sm text-red-800">{this.state.error.toString()}</p>
                  </div>
                )}
                
                {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-red-600 mb-2">Component Stack</summary>
                    <pre className="p-3 bg-red-100 border border-red-300 rounded overflow-auto text-xs">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
                
                <div className="mt-6 flex space-x-4">
                  <Button onClick={this.handleReload} className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Reload Page
                  </Button>
                  <Button onClick={this.handleReset} variant="outline">
                    Try Again
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}
