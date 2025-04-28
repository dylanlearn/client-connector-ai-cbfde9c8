
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { PlatformOutputService } from '@/services/platform-output/platform-output-service';
import type { WireframePlatformOutput } from '@/types/platform-output';
import { FileCode, RefreshCw, ExternalLink, AlertTriangle } from 'lucide-react';

interface GeneratedOutputsProps {
  wireframeId?: string;
}

export function GeneratedOutputs({ wireframeId }: GeneratedOutputsProps) {
  const [outputs, setOutputs] = useState<WireframePlatformOutput[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (wireframeId) {
      loadOutputs(wireframeId);
    }
  }, [wireframeId]);
  
  const loadOutputs = async (wireframeId: string) => {
    setIsLoading(true);
    try {
      const data = await PlatformOutputService.getPlatformOutputs(wireframeId);
      setOutputs(data);
    } catch (error) {
      console.error("Error loading platform outputs:", error);
      toast({
        title: "Error loading outputs",
        description: "Failed to load platform outputs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!wireframeId) {
    return (
      <div className="text-gray-500 italic">
        Please select a wireframe to view generated outputs.
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Generated Outputs</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => wireframeId && loadOutputs(wireframeId)}
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-6">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : outputs.length === 0 ? (
        <div className="text-center p-6 border rounded-md bg-muted/50">
          <FileCode className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
          <p className="text-muted-foreground mt-2">No outputs generated yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Generate platform-specific outputs from the Platforms tab.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {outputs.map((output) => (
            <Card key={output.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium">{output.platform_id}</h4>
                      <OutputStatusBadge status={output.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Generated: {new Date(output.created_at).toLocaleString()}
                    </p>
                  </div>
                  
                  {output.output_url && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={output.output_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" /> View Output
                      </a>
                    </Button>
                  )}
                </div>
                
                {output.status === 'completed' && output.output_data && (
                  <div className="mt-4 border-t pt-4">
                    <h5 className="font-medium text-sm mb-2">Output Preview:</h5>
                    <div className="max-h-96 overflow-auto bg-muted rounded">
                      <pre className="text-xs p-2 overflow-x-auto">
                        {JSON.stringify(output.output_data, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
                
                {output.status === 'failed' && output.validation_result && (
                  <div className="mt-4 border-t pt-4">
                    <h5 className="font-medium text-sm mb-2 text-destructive flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" /> Error Details:
                    </h5>
                    <div className="bg-destructive/10 text-destructive rounded p-2">
                      <pre className="text-xs overflow-x-auto">
                        {JSON.stringify(output.validation_result, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function OutputStatusBadge({ status }: { status: string }) {
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
