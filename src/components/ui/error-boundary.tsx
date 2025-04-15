import React, { Component, ErrorInfo, ReactNode, useCallback } from "react";
import { AlertMessage } from "@/components/ui/alert-message";
import { Button } from "@/components/ui/button";
import { recordClientError } from "@/utils/monitoring/api-usage";
import { toast } from "sonner";
import { logError } from "@/utils/monitoring/client-error-logger";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  component?: string;
  showReset?: boolean;
  resetLabel?: string;
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
    const componentName = this.props.component || 
      this.extractComponentName(errorInfo.componentStack) || 
      'Unknown';
    
    console.group(`Error Boundary Caught Error in ${componentName}`);
    console.error('Error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('Additional Info:', {
      timestamp: new Date().toISOString(),
      location: window.location.href,
      userAgent: navigator.userAgent
    });
    console.groupEnd();
    
    recordClientError(
      error.message,
      error.stack,
      componentName,
      undefined,
      { 
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        location: window.location.href,
        debug: true
      }
    ).catch(console.error);
    
    this.setState({
      error,
      errorInfo
    });
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  extractComponentName(componentStack: string): string | null {
    const lines = componentStack.split('\n');
    if (lines.length > 1) {
      const match = lines[1].trim().match(/in ([A-Za-z0-9_]+)/);
      return match ? match[1] : null;
    }
    return null;
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
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
              {this.props.showReset !== false && (
                <Button 
                  onClick={this.handleReset}
                  variant="outline"
                >
                  {this.props.resetLabel || 'Try Again'}
                </Button>
              )}
            </div>
          </AlertMessage>
        </div>
      );
    }

    return this.props.children;
  }
}

function useErrorHandler(componentName?: string) {
  return useCallback((error: Error, context?: string) => {
    console.error(`Error in ${componentName || 'component'}:`, error);
    
    logError(error, componentName || 'UnknownComponent');
    
    toast.error("An error occurred", {
      description: error.message,
      action: {
        label: "Reload",
        onClick: () => window.location.reload(),
      },
    });
    
    return error;
  }, [componentName]);
}

export { ErrorBoundary, useErrorHandler };
