
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database, RefreshCw, PlayCircle, Plus, Code } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DataSourceConnectorProps {
  projectId: string;
  wireframeId: string;
}

export function DataSourceConnector({ projectId, wireframeId }: DataSourceConnectorProps) {
  const [dataSources, setDataSources] = useState<any[]>([]);
  const [mappings, setMappings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('sources');
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  useEffect(() => {
    if (projectId && wireframeId) {
      loadDataSources();
      loadMappings();
    }
  }, [projectId, wireframeId]);
  
  const loadDataSources = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('data_sources')
        .select('*')
        .eq('project_id', projectId);
        
      if (error) throw error;
      setDataSources(data || []);
    } catch (error) {
      console.error('Error loading data sources:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadMappings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('data_source_mappings')
        .select(`
          *,
          data_source:data_source_id(*)
        `)
        .eq('wireframe_id', wireframeId);
        
      if (error) throw error;
      setMappings(data || []);
    } catch (error) {
      console.error('Error loading data mappings:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePreviewMapping = async (mappingId: string) => {
    setIsLoading(true);
    setShowPreview(false);
    try {
      const { data, error } = await supabase
        .rpc('transform_data_through_mapping', {
          p_mapping_id: mappingId
        });
        
      if (error) throw error;
      
      setPreviewData({
        mappingId,
        data
      });
      setShowPreview(true);
    } catch (error) {
      console.error('Error previewing data mapping:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderDataSourceDetails = (source: any) => {
    const connectionDetails: Record<string, React.ReactNode> = {};
    
    if (typeof source.connection_details === 'object') {
      Object.entries(source.connection_details).forEach(([key, value]) => {
        // Mask sensitive information
        if (key.toLowerCase().includes('password') || 
            key.toLowerCase().includes('key') || 
            key.toLowerCase().includes('token')) {
          connectionDetails[key] = '••••••••';
        } else {
          connectionDetails[key] = String(value);
        }
      });
    }
    
    return (
      <div className="text-sm">
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(connectionDetails).map(([key, value]) => (
            <div key={key}>
              <span className="font-medium mr-2">{key}:</span>
              <span className="text-gray-600">{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Data Source Connection Framework
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                loadDataSources();
                loadMappings();
              }}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Connect your wireframes to data sources and visualize dynamic content
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sources">Data Sources</TabsTrigger>
            <TabsTrigger value="mappings">Data Mappings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sources" className="pt-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : dataSources.length > 0 ? (
              <Table>
                <TableCaption>Available data sources for this project</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Connection Details</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataSources.map(source => (
                    <TableRow key={source.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Database className="h-4 w-4 mr-2" />
                          {source.name}
                        </div>
                      </TableCell>
                      <TableCell>{source.source_type}</TableCell>
                      <TableCell>
                        {renderDataSourceDetails(source)}
                      </TableCell>
                      <TableCell>
                        {new Date(source.updated_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-4">No data sources available</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Data Source
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="mappings" className="pt-4">
            {showPreview && previewData && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Data Preview</CardTitle>
                  <CardDescription>
                    Transformed data from mapping
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-64">
                    <pre className="text-xs">{JSON.stringify(previewData.data, null, 2)}</pre>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : mappings.length > 0 ? (
              <Table>
                <TableCaption>Data mappings for this wireframe</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Target Component</TableHead>
                    <TableHead>Data Source</TableHead>
                    <TableHead>Fields</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mappings.map(mapping => (
                    <TableRow key={mapping.id}>
                      <TableCell className="font-medium">
                        {mapping.target_component || 'Entire wireframe'}
                      </TableCell>
                      <TableCell>
                        {mapping.data_source?.name || 'Unknown source'}
                      </TableCell>
                      <TableCell>
                        {mapping.field_mappings && typeof mapping.field_mappings === 'object' && (
                          <div className="text-xs">
                            {Object.keys(mapping.field_mappings).length} field mappings
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handlePreviewMapping(mapping.id)}
                            disabled={isLoading}
                          >
                            <PlayCircle className="h-4 w-4" />
                            <span className="sr-only">Preview</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Code className="h-4 w-4" />
                            <span className="sr-only">Edit Mapping</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-4">No data mappings configured for this wireframe</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Data Mapping
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
