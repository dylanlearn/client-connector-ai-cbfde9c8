
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";
import { ClientError } from "@/utils/monitoring/types";

interface ErrorCardProps {
  error: ClientError;
  onResolveClick: (error: ClientError) => void;
}

export function ErrorCard({ error, onResolveClick }: ErrorCardProps) {
  return (
    <div 
      key={error.id} 
      className="p-4 border rounded-md hover:bg-accent transition-colors"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {error.resolved ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-500" />
            )}
            <span className="font-medium text-sm">
              {error.error_message}
            </span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {new Date(error.timestamp!).toLocaleString()}
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {error.component_name && (
              <Badge variant="outline">{error.component_name}</Badge>
            )}
            <Badge variant="outline">{error.url?.split('?')[0]}</Badge>
            {error.resolved && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Resolved
              </Badge>
            )}
          </div>
          
          {error.resolution_notes && (
            <div className="mt-2 text-sm italic border-l-2 pl-2 border-primary-200">
              {error.resolution_notes}
            </div>
          )}
        </div>
        
        {!error.resolved && (
          <Button
            size="sm"
            onClick={() => onResolveClick(error)}
          >
            Resolve
          </Button>
        )}
      </div>
      
      {error.error_stack && (
        <details className="mt-3">
          <summary className="cursor-pointer text-xs text-muted-foreground">
            Error Stack
          </summary>
          <pre className="mt-2 text-xs p-2 bg-slate-50 rounded-md overflow-auto max-h-32">
            {error.error_stack}
          </pre>
        </details>
      )}
    </div>
  );
}
