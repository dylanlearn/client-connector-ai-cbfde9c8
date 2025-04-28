
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  Loader2, Database, Globe, Webhook, Server, Check, 
  Plus, RefreshCw, Play, FileJson, Code
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DataSourceConnectorProps {
  wireframeId: string;
}

export const DataSourceConnector: React.FC<DataSourceConnectorProps> = ({ wireframeId }) => {
  const queryClient = useQueryClient();
  const [sourceName, setSourceName] = useState('');
  const [sourceType, setSourceType] = useState<string>('api');
  const [connectionDetails, setConnectionDetails] = useState('');
  const [showMappingPanel, setShowMappingPanel] = useState(false);
  const [selectedDataSource, setSelectedDataSource] = useState<string | null>(null);

  // Fetch data sources
  const { data: dataSources, isLoading } = useQuery({
    queryKey: ['data-sources', wireframeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('data_sources')
        .select('*')
        .eq('project_id', 'project-1') // Placeholder
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Add new data source
  const { mutate: addDataSource, isPending: isAdding } = useMutation({
    mutationFn: async () => {
      let parsedConnectionDetails;
      try {
        parsedConnectionDetails = JSON.parse(connectionDetails);
      } catch (e) {
        throw new Error("Invalid JSON in connection details");
      }

      const { data, error } = await supabase
        .from('data_sources')
        .insert({
          project_id: 'project-1', // Placeholder
          name: sourceName,
          source_type: sourceType,
          connection_details: parsedConnectionDetails,
          schema_definition: {}
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data-sources', wireframeId] });
      toast.success("Data source created");
      setSourceName('');
      setConnectionDetails('');
    },
    onError: (error) => {
      toast.error("Failed to create data source", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  });

  const getSourceTypeIcon = (type: string) => {
    switch (type) {
      case 'api':
        return <Globe className="h-4 w-4" />;
      case 'database':
        return <Database className="h-4 w-4" />;
      case 'graphql':
        return <Webhook className="h-4 w-4" />;
      case 'file':
        return <FileJson className="h-4 w-4" />;
      default:
        return <Server className="h-4 w-4" />;
    }
  };

  // Format JSON for display
  const formatJson = (jsonString: string) => {
    try {
      return JSON.stringify(JSON.parse(jsonString), null, 2);
    } catch (e) {
      return jsonString;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Source Connection</CardTitle>
        <CardDescription>
          Connect wireframe elements to real data sources
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sources">
          <TabsList className="mb-4">
            <TabsTrigger value="sources">Data Sources</TabsTrigger>
            <TabsTrigger value="add">Add Source</TabsTrigger>
            <TabsTrigger value="mappings">Element Mappings</TabsTrigger>
            <TabsTrigger value="states">States</TabsTrigger>
          </TabsList>

          <TabsContent value="sources">
            {isLoading ? (
              <div className="flex items-center justify-center p-6">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Available Data Sources</div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      queryClient.invalidateQueries({ queryKey: ['data-sources', wireframeId] });
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Refresh
                  </Button>
                </div>

                {dataSources && dataSources.length > 0 ? (
                  <div className="space-y-2">
                    {dataSources.map((source: any) => (
                      <div 
                        key={source.id} 
                        className="border rounded p-3 hover:bg-muted/50 cursor-pointer"
                        onClick={() => {
                          setSelectedDataSource(source.id);
                          setShowMappingPanel(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getSourceTypeIcon(source.source_type)}
                            <div>
                              <div className="font-medium">{source.name}</div>
                              <div className="text-xs text-gray-500 capitalize">{source.source_type}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <div className={`h-2 w-2 rounded-full ${source.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              <span className="text-xs ml-1">{source.is_active ? 'Active' : 'Inactive'}</span>
                            </div>
                            <Button size="sm" variant="outline">
                              <Play className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 text-gray-500">
                    <Database className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                    <p>No data sources configured</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => {
                        const tabs = document.querySelectorAll('[role="tab"]');
                        const addTab = Array.from(tabs).find(tab => 
                          tab.textContent === 'Add Source'
                        ) as HTMLElement;
                        if (addTab) addTab.click();
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Source
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="add">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source-name">Source Name</Label>
                  <Input 
                    id="source-name"
                    placeholder="e.g. Product API"
                    value={sourceName}
                    onChange={(e) => setSourceName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source-type">Source Type</Label>
                  <Select value={sourceType} onValueChange={setSourceType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="api">REST API</SelectItem>
                      <SelectItem value="database">Database</SelectItem>
                      <SelectItem value="graphql">GraphQL</SelectItem>
                      <SelectItem value="mock">Mock Data</SelectItem>
                      <SelectItem value="file">File/JSON</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="connection-details">Connection Details (JSON)</Label>
                <Textarea 
                  id="connection-details"
                  placeholder={`{\n  "url": "https://api.example.com/v1",\n  "headers": {\n    "Content-Type": "application/json"\n  }\n}`}
                  className="min-h-[200px] font-mono text-sm"
                  value={connectionDetails}
                  onChange={(e) => setConnectionDetails(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Enter connection details in JSON format. Structure depends on the source type.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="active" defaultChecked={true} />
                <Label htmlFor="active">Activate data source immediately</Label>
              </div>

              <Button 
                onClick={() => addDataSource()} 
                disabled={isAdding || !sourceName || !connectionDetails}
                className="w-full"
              >
                {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isAdding ? "Creating..." : "Create Data Source"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="mappings">
            {showMappingPanel && selectedDataSource ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Map Data to Elements</div>
                  <Button variant="outline" size="sm" onClick={() => setShowMappingPanel(false)}>
                    Back to List
                  </Button>
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2 border rounded p-3 space-y-2">
                    <div className="text-sm font-medium">Data Structure</div>
                    <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-64">
                      {`{
  "products": [
    {
      "id": 1,
      "name": "Product One",
      "price": 29.99,
      "image": "product1.jpg"
    },
    {
      "id": 2,
      "name": "Product Two",
      "price": 39.99,
      "image": "product2.jpg"
    }
  ]
}`}
                    </pre>
                  </div>
                  <div className="w-1/2 border rounded p-3 space-y-2">
                    <div className="text-sm font-medium">Wireframe Elements</div>
                    <div className="text-center text-gray-500 p-4">
                      <Code className="h-8 w-8 mx-auto mb-2" />
                      <p>Select an element to map data</p>
                    </div>
                  </div>
                </div>
                <Button disabled>Save Mapping</Button>
              </div>
            ) : (
              <div className="text-center p-6 text-gray-500">
                <p>Select a data source to map to wireframe elements</p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => {
                    const tabs = document.querySelectorAll('[role="tab"]');
                    const sourcesTab = Array.from(tabs).find(tab => 
                      tab.textContent === 'Data Sources'
                    ) as HTMLElement;
                    if (sourcesTab) sourcesTab.click();
                  }}
                >
                  View Data Sources
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="states">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Data States</div>
                <Button variant="outline" size="sm" disabled>
                  <Plus className="h-4 w-4 mr-1" />
                  Add State
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="border rounded p-3 hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <div className="font-medium">Success - Data Loaded</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Default success state with sample data
                  </div>
                </div>
                <div className="border rounded p-3 hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4" />
                    <div className="font-medium">Loading</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Loading state with skeleton content
                  </div>
                </div>
                <div className="border rounded p-3 hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-red-500" />
                    <div className="font-medium">Error</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Error state when data fetch fails
                  </div>
                </div>
                <div className="border rounded p-3 hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-gray-400" />
                    <div className="font-medium">Empty</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Empty state when no data available
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
