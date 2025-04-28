import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Database, Globe, Server, FileJson, FileText, Plus, Trash2, ListPlus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DesignSystemService, DataSource, DataMapping } from '@/services/design-system/design-system-service';

interface DataSourceConnectorProps {
  projectId: string;
  wireframeId?: string;
}

export function DataSourceConnector({ projectId, wireframeId }: DataSourceConnectorProps) {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource | null>(null);
  const [transformedData, setTransformedData] = useState<Record<string, any> | null>(null);
  
  const [newDataSource, setNewDataSource] = useState({
    name: '',
    source_type: 'mock' as const,
    connection_details: {},
    schema_definition: {}
  });
  
  const [newMapping, setNewMapping] = useState({
    data_source_id: '',
    wireframe_id: wireframeId || '',
    element_id: '',
    field_mappings: {}
  });
  
  useEffect(() => {
    if (projectId) {
      loadDataSources();
    }
  }, [projectId]);
  
  useEffect(() => {
    if (wireframeId) {
      setNewMapping(prev => ({...prev, wireframe_id}));
    }
  }, [wireframeId]);
  
  const loadDataSources = async () => {
    setIsLoading(true);
    try {
      const data = await DesignSystemService.getDataSources(projectId);
      setDataSources(data);
    } catch (error) {
      toast.error("Failed to load data sources");
      console.error("Error loading data sources:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateDataSource = async () => {
    if (!newDataSource.name) {
      toast.error("Data source name is required");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Parse JSON strings if they're provided
      let connectionDetails = newDataSource.connection_details;
      let schemaDefinition = newDataSource.schema_definition;
      
      await DesignSystemService.createDataSource({
        project_id: projectId,
        name: newDataSource.name,
        source_type: newDataSource.source_type,
        connection_details: connectionDetails,
        schema_definition: schemaDefinition,
        is_active: true
      });
      
      toast.success("Data source created successfully");
      setNewDataSource({
        name: '',
        source_type: 'mock',
        connection_details: {},
        schema_definition: {}
      });
      loadDataSources();
    } catch (error) {
      toast.error("Failed to create data source");
      console.error("Error creating data source:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateMapping = async () => {
    if (!newMapping.data_source_id || !newMapping.element_id || !wireframeId) {
      toast.error("Data source, element ID, and wireframe ID are required");
      return;
    }
    
    try {
      setIsLoading(true);
      
      await DesignSystemService.createDataMapping({
        data_source_id: newMapping.data_source_id,
        wireframe_id: wireframeId,
        element_id: newMapping.element_id,
        field_mappings: newMapping.field_mappings,
        is_active: true
      });
      
      toast.success("Data mapping created successfully");
      setNewMapping({
        data_source_id: '',
        wireframe_id: wireframeId,
        element_id: '',
        field_mappings: {}
      });
    } catch (error) {
      toast.error("Failed to create data mapping");
      console.error("Error creating data mapping:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTransformData = async (mappingId: string) => {
    try {
      setIsLoading(true);
      const data = await DesignSystemService.transformData(mappingId);
      setTransformedData(data);
      toast.success("Data transformed successfully");
    } catch (error) {
      toast.error("Failed to transform data");
      console.error("Error transforming data:", error);
      setTransformedData(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getDataSourceIcon = (type: string) => {
    switch (type) {
      case 'api':
        return <Globe className="h-4 w-4" />;
      case 'database':
        return <Database className="h-4 w-4" />;
      case 'graphql':
        return <Server className="h-4 w-4" />;
      case 'mock':
        return <FileJson className="h-4 w-4" />;
      case 'file':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  const addFieldMapping = () => {
    const elementField = prompt("Enter element field name:");
    if (!elementField) return;
    
    const sourcePath = prompt("Enter source data path (e.g., 'user.name'):");
    if (!sourcePath) return;
    
    setNewMapping({
      ...newMapping,
      field_mappings: {
        ...newMapping.field_mappings,
        [elementField]: sourcePath
      }
    });
  };
  
  const removeFieldMapping = (field: string) => {
    const { [field]: removed, ...rest } = newMapping.field_mappings;
    setNewMapping({
      ...newMapping,
      field_mappings: rest
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Data Source Connector</CardTitle>
        <CardDescription>
          Connect wireframes to real data sources and visualize dynamic content
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="sources" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sources">Data Sources</TabsTrigger>
            <TabsTrigger value="mappings">Mappings</TabsTrigger>
            <TabsTrigger value="preview">Preview Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sources" className="space-y-4 py-2">
            <div className="space-y-6">
              <div className="rounded-md border">
                <div className="p-4 border-b">
                  <h3 className="font-medium">Available Data Sources</h3>
                </div>
                
                {isLoading ? (
                  <div className="p-8 text-center">Loading data sources...</div>
                ) : (
                  <div className="divide-y">
                    {dataSources.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">
                        No data sources available. Create one below.
                      </div>
                    ) : (
                      dataSources.map((source) => (
                        <div key={source.id} className="p-4 hover:bg-muted/40">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center">
                                <h4 className="font-medium">{source.name}</h4>
                                <Badge variant="outline" className="ml-2">
                                  {getDataSourceIcon(source.source_type)}
                                  <span className="ml-1">{source.source_type}</span>
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {source.is_active ? 'Active' : 'Inactive'}
                              </p>
                            </div>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setSelectedDataSource(source)}
                            >
                              Select
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="create">
                  <AccordionTrigger>Create New Data Source</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 p-2">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Data Source Name</Label>
                          <Input 
                            id="name" 
                            value={newDataSource.name}
                            onChange={(e) => setNewDataSource({...newDataSource, name: e.target.value})}
                            placeholder="e.g., User API"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="source_type">Source Type</Label>
                          <Select 
                            value={newDataSource.source_type} 
                            onValueChange={(value: any) => setNewDataSource({...newDataSource, source_type: value})}
                          >
                            <SelectTrigger id="source_type">
                              <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="api">REST API</SelectItem>
                              <SelectItem value="database">Database</SelectItem>
                              <SelectItem value="graphql">GraphQL</SelectItem>
                              <SelectItem value="mock">Mock Data</SelectItem>
                              <SelectItem value="file">File</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="connection_details">Connection Details</Label>
                          <Textarea 
                            id="connection_details" 
                            value={typeof newDataSource.connection_details === 'string' 
                              ? newDataSource.connection_details 
                              : JSON.stringify(newDataSource.connection_details, null, 2)}
                            onChange={(e) => {
                              try {
                                // Try to parse as JSON if it's valid
                                const parsed = JSON.parse(e.target.value);
                                setNewDataSource({...newDataSource, connection_details: parsed});
                              } catch {
                                // Otherwise store as string
                                setNewDataSource({...newDataSource, connection_details: e.target.value});
                              }
                            }}
                            placeholder={`{
  "url": "https://api.example.com",
  "method": "GET",
  "headers": {
    "Content-Type": "application/json"
  }
}`}
                            className="font-mono text-xs h-32"
                          />
                        </div>
                      </div>
                      
                      <Button 
                        onClick={handleCreateDataSource} 
                        disabled={isLoading || !newDataSource.name}
                      >
                        {isLoading ? 'Creating...' : 'Create Data Source'}
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>
          
          <TabsContent value="mappings" className="space-y-6 py-4">
            {!wireframeId ? (
              <div className="text-center py-8 text-muted-foreground">
                Select a wireframe to create data mappings
              </div>
            ) : (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Create Data Mapping</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="data_source">Data Source</Label>
                          <Select 
                            value={newMapping.data_source_id} 
                            onValueChange={(value) => setNewMapping({...newMapping, data_source_id: value})}
                          >
                            <SelectTrigger id="data_source">
                              <SelectValue placeholder="Select data source" />
                            </SelectTrigger>
                            <SelectContent>
                              {dataSources.map((source) => (
                                <SelectItem key={source.id} value={source.id}>
                                  {source.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="element_id">Element ID</Label>
                          <Input 
                            id="element_id" 
                            value={newMapping.element_id}
                            onChange={(e) => setNewMapping({...newMapping, element_id: e.target.value})}
                            placeholder="e.g., user-profile"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Field Mappings</Label>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={addFieldMapping}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Field
                          </Button>
                        </div>
                        
                        <div className="rounded-md border">
                          {Object.keys(newMapping.field_mappings).length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">
                              No field mappings defined. Click "Add Field" to create one.
                            </div>
                          ) : (
                            <div className="divide-y">
                              {Object.entries(newMapping.field_mappings).map(([field, path]) => (
                                <div key={field} className="p-3 flex items-center justify-between">
                                  <div>
                                    <span className="font-medium">{field}</span>
                                    <span className="text-muted-foreground mx-2">←</span>
                                    <code className="text-xs bg-muted p-1 rounded">{path}</code>
                                  </div>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => removeFieldMapping(field)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button 
                        onClick={handleCreateMapping}
                        disabled={
                          isLoading || 
                          !newMapping.data_source_id || 
                          !newMapping.element_id || 
                          Object.keys(newMapping.field_mappings).length === 0
                        }
                      >
                        {isLoading ? 'Creating...' : 'Create Mapping'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="preview" className="space-y-4 py-2">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Data Preview</CardTitle>
                  <CardDescription>
                    Preview transformed data from your data sources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDataSource ? (
                    <div>
                      <div className="mb-4">
                        <h3 className="font-medium">{selectedDataSource.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Type: {selectedDataSource.source_type}
                        </p>
                      </div>
                      
                      {transformedData ? (
                        <div className="rounded-md bg-muted p-4">
                          <pre className="text-xs overflow-auto whitespace-pre-wrap">
                            {JSON.stringify(transformedData, null, 2)}
                          </pre>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          Select a mapping to preview transformed data
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Select a data source to preview
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
