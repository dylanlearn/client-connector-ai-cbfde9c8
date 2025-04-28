
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Link, Table2, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface DataSourceConnectorProps {
  projectId: string;
  wireframeId: string;
}

interface DataSource {
  id: string;
  name: string;
  source_type: string;
  connection_details: any;
  schema_definition: any;
  is_active: boolean;
}

interface DataSourceMapping {
  id: string;
  data_source_id: string;
  wireframe_id: string;
  element_id: string;
  field_mappings: Record<string, string>;
  transformation_rules: Record<string, any>;
  is_active: boolean;
}

interface DataSourceState {
  id: string;
  state_name: string;
  state_data: any;
  is_default: boolean;
}

export function DataSourceConnector({ projectId, wireframeId }: DataSourceConnectorProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [mappings, setMappings] = useState<DataSourceMapping[]>([]);
  const [states, setStates] = useState<DataSourceState[]>([]);
  const [activeTab, setActiveTab] = useState('sources');
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource | null>(null);
  const { toast } = useToast();

  // Load data sources
  useEffect(() => {
    fetchDataSources();
    fetchMappings();
  }, [projectId, wireframeId]);

  const fetchDataSources = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('data_sources')
        .select('*')
        .eq('project_id', projectId);

      if (error) throw error;
      setDataSources(data || []);
    } catch (error) {
      console.error('Error fetching data sources:', error);
      toast({
        title: "Error",
        description: "Failed to load data sources",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMappings = async () => {
    try {
      const { data, error } = await supabase
        .from('data_source_mappings')
        .select('*')
        .eq('wireframe_id', wireframeId);

      if (error) throw error;
      setMappings(data || []);
    } catch (error) {
      console.error('Error fetching mappings:', error);
    }
  };

  const fetchStates = async (dataSourceId: string) => {
    try {
      const { data, error } = await supabase
        .from('data_source_states')
        .select('*')
        .eq('data_source_id', dataSourceId);

      if (error) throw error;
      setStates(data || []);
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const handleDataSourceSelect = (sourceId: string) => {
    const source = dataSources.find(s => s.id === sourceId);
    setSelectedDataSource(source || null);
    if (source) {
      fetchStates(source.id);
    }
  };

  const handleAddDataSource = async (newSource: Partial<DataSource>) => {
    try {
      const { data, error } = await supabase
        .from('data_sources')
        .insert([
          {
            name: newSource.name,
            source_type: newSource.source_type,
            connection_details: newSource.connection_details || {},
            schema_definition: newSource.schema_definition || {},
            project_id: projectId,
            is_active: true
          }
        ])
        .select();

      if (error) throw error;
      setDataSources([...dataSources, data[0]]);
      toast({
        title: "Success",
        description: "Data source added successfully"
      });
    } catch (error) {
      console.error('Error adding data source:', error);
      toast({
        title: "Error",
        description: "Failed to add data source",
        variant: "destructive"
      });
    }
  };

  const handleAddMapping = async (mapping: Partial<DataSourceMapping>) => {
    if (!selectedDataSource) return;

    try {
      const { data, error } = await supabase
        .from('data_source_mappings')
        .insert([
          {
            data_source_id: selectedDataSource.id,
            wireframe_id: wireframeId,
            element_id: mapping.element_id,
            field_mappings: mapping.field_mappings || {},
            transformation_rules: mapping.transformation_rules || {},
            is_active: true
          }
        ])
        .select();

      if (error) throw error;
      setMappings([...mappings, data[0]]);
      toast({
        title: "Success",
        description: "Mapping added successfully"
      });
    } catch (error) {
      console.error('Error adding mapping:', error);
      toast({
        title: "Error",
        description: "Failed to add mapping",
        variant: "destructive"
      });
    }
  };

  const handleAddState = async (state: Partial<DataSourceState>) => {
    if (!selectedDataSource) return;

    try {
      const { data, error } = await supabase
        .from('data_source_states')
        .insert([
          {
            data_source_id: selectedDataSource.id,
            state_name: state.state_name,
            state_data: state.state_data || {},
            is_default: state.is_default || false
          }
        ])
        .select();

      if (error) throw error;
      setStates([...states, data[0]]);
      toast({
        title: "Success",
        description: "State added successfully"
      });
    } catch (error) {
      console.error('Error adding state:', error);
      toast({
        title: "Error",
        description: "Failed to add state",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Data Source Connector
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sources">
              <Database className="h-4 w-4 mr-2" /> Data Sources
            </TabsTrigger>
            <TabsTrigger value="mappings">
              <Link className="h-4 w-4 mr-2" /> Mappings
            </TabsTrigger>
            <TabsTrigger value="states">
              <Table2 className="h-4 w-4 mr-2" /> Data States
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sources" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dataSources.map(source => (
                <Card 
                  key={source.id} 
                  className={`cursor-pointer ${selectedDataSource?.id === source.id ? 'border-primary' : ''}`}
                  onClick={() => handleDataSourceSelect(source.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{source.name}</h3>
                        <p className="text-sm text-muted-foreground">{source.source_type}</p>
                      </div>
                      {source.is_active ? (
                        <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</div>
                      ) : (
                        <div className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Inactive</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add New Data Source</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Enter source name" />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rest_api">REST API</SelectItem>
                          <SelectItem value="graphql">GraphQL</SelectItem>
                          <SelectItem value="database">Database</SelectItem>
                          <SelectItem value="mock">Mock Data</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="w-full">Add Data Source</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="mappings" className="space-y-4 mt-4">
            {mappings.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {mappings.map(mapping => (
                  <Card key={mapping.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Element ID: {mapping.element_id}</h3>
                        {mapping.is_active ? (
                          <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</div>
                        ) : (
                          <div className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Inactive</div>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Data Source: {
                          dataSources.find(s => s.id === mapping.data_source_id)?.name || 'Unknown'
                        }</p>
                        <p className="mt-1">Field Mappings: {Object.keys(mapping.field_mappings || {}).length}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Link className="h-16 w-16 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No Mappings</h3>
                <p className="text-muted-foreground mt-2">
                  Create mappings to connect wireframe elements with data sources.
                </p>
              </div>
            )}
            
            <div className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add New Mapping</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="data-source">Data Source</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select data source" />
                        </SelectTrigger>
                        <SelectContent>
                          {dataSources.map(source => (
                            <SelectItem key={source.id} value={source.id}>{source.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="element-id">Element ID</Label>
                      <Input id="element-id" placeholder="Enter wireframe element ID" />
                    </div>
                  </div>
                  <Button className="w-full">Add Mapping</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="states" className="space-y-4 mt-4">
            {selectedDataSource ? (
              <>
                {states.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {states.map(state => (
                      <Card key={state.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{state.state_name}</h3>
                            {state.is_default && (
                              <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Default</div>
                            )}
                          </div>
                          <div className="mt-2">
                            <Label className="text-xs text-muted-foreground">Data Preview</Label>
                            <div className="mt-1 bg-muted p-2 rounded-md overflow-x-auto">
                              <pre className="text-xs">
                                {JSON.stringify(state.state_data, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Table2 className="h-16 w-16 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No States</h3>
                    <p className="text-muted-foreground mt-2">
                      Create data states to visualize different data scenarios.
                    </p>
                  </div>
                )}
                
                <div className="pt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Add New State</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4">
                        <div>
                          <Label htmlFor="state-name">State Name</Label>
                          <Input id="state-name" placeholder="Enter state name" />
                        </div>
                        <div>
                          <Label htmlFor="state-data">State Data (JSON)</Label>
                          <textarea
                            id="state-data"
                            className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                            placeholder='{"example": "data"}'
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="is-default" className="rounded border-gray-300 text-primary focus:ring-primary" />
                          <Label htmlFor="is-default">Set as default state</Label>
                        </div>
                      </div>
                      <Button className="w-full">Add State</Button>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <Database className="h-16 w-16 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No Data Source Selected</h3>
                <p className="text-muted-foreground mt-2">
                  Select a data source to manage its states.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
