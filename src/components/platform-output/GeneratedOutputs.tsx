
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { RefreshCw, Download, FileCode, ExternalLink, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PlatformOutputService } from '@/services/platform-output/platform-output-service';
import type { WireframePlatformOutput, PlatformConfiguration } from '@/types/platform-output';

interface GeneratedOutputsProps {
  wireframeId?: string;
}

export function GeneratedOutputs({ 
  wireframeId
}: GeneratedOutputsProps) {
  const [outputs, setOutputs] = useState<WireframePlatformOutput[]>([]);
  const [platforms, setPlatforms] = useState<Record<string, PlatformConfiguration>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('code');
  const { toast } = useToast();

  useEffect(() => {
    if (wireframeId) {
      loadOutputs();
      loadPlatforms();
    }
  }, [wireframeId]);

  const loadOutputs = async () => {
    if (!wireframeId) return;

    setIsLoading(true);
    try {
      const data = await PlatformOutputService.getPlatformOutputs(wireframeId);
      setOutputs(data);
    } catch (error) {
      console.error("Error loading outputs:", error);
      toast({
        title: "Error loading outputs",
        description: "Failed to load generated outputs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadPlatforms = async () => {
    try {
      const platformsList = await PlatformOutputService.getPlatformConfigurations();
      const platformsMap: Record<string, PlatformConfiguration> = {};
      platformsList.forEach(platform => {
        platformsMap[platform.id] = platform;
      });
      setPlatforms(platformsMap);
    } catch (error) {
      console.error("Error loading platform configurations:", error);
    }
  };

  const downloadOutput = (output: WireframePlatformOutput) => {
    if (!output.output_data) return;

    // Create a JSON blob and download it
    const blob = new Blob([JSON.stringify(output.output_data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${platforms[output.platform_id]?.platform_name || 'platform'}-output.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Output downloaded",
      description: "Output file has been downloaded successfully.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Processing</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Failed</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Pending</Badge>;
    }
  };

  if (!wireframeId) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Select a wireframe to view its generated outputs.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Generated Platform Outputs</h3>
        <Button variant="outline" size="sm" onClick={loadOutputs} disabled={isLoading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : outputs.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No generated outputs found. Generate platform-specific code from your wireframe first.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <Accordion type="single" collapsible>
            {outputs.map(output => (
              <AccordionItem key={output.id} value={output.id}>
                <AccordionTrigger className="px-4 py-2 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-2">
                      <FileCode className="h-4 w-4" />
                      <span>
                        {platforms[output.platform_id]?.platform_name || 'Platform'} Output
                      </span>
                      {getStatusBadge(output.status)}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(output.created_at).toLocaleString()}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4">
                  <div className="pt-2 pb-4">
                    <div className="flex justify-between mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Platform: <strong>{platforms[output.platform_id]?.platform_name || output.platform_id}</strong>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Type: <strong>{platforms[output.platform_id]?.platform_type || 'Unknown'}</strong>
                        </p>
                      </div>
                      <div className="space-x-2">
                        {output.output_url && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={output.output_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View
                            </a>
                          </Button>
                        )}
                        {output.output_data && (
                          <Button size="sm" onClick={() => downloadOutput(output)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {output.output_data && (
                      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                        <TabsList className="mb-2">
                          <TabsTrigger value="code">Code</TabsTrigger>
                          <TabsTrigger value="preview">Preview</TabsTrigger>
                          <TabsTrigger value="raw">Raw Output</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="code" className="border rounded-md bg-gray-50">
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-medium">Generated Code</h4>
                              <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                                <Code className="h-3 w-3 mr-1" />
                                Copy
                              </Button>
                            </div>
                            <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-96 font-mono">
                              {JSON.stringify(output.output_data, null, 2)}
                            </pre>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="preview">
                          <div className="border rounded-md p-4 h-96 flex items-center justify-center bg-gray-50">
                            <p className="text-muted-foreground">
                              Preview not available for this output type.
                            </p>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="raw">
                          <pre className="border rounded-md p-4 overflow-auto bg-gray-50 max-h-96 text-xs font-mono">
                            {JSON.stringify(output.output_data, null, 2)}
                          </pre>
                        </TabsContent>
                      </Tabs>
                    )}
                    
                    {output.validation_result && Object.keys(output.validation_result).length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Validation Results</h4>
                        <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40 font-mono">
                          {JSON.stringify(output.validation_result, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}
