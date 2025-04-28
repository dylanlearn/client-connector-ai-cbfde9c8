
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { PlusCircle, CheckCircle, ExternalLink, Code2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ComponentLibraryMapperProps {
  wireframeId: string;
  specificationId?: string;
}

export const ComponentLibraryMapper: React.FC<ComponentLibraryMapperProps> = ({ 
  wireframeId, 
  specificationId 
}) => {
  const { toast } = useToast();
  const [selectedLibrary, setSelectedLibrary] = useState<string>('');
  const [isMapping, setIsMapping] = useState(false);

  const { data: libraries } = useQuery({
    queryKey: ['componentLibraries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('component_libraries')
        .select('*');

      if (error) throw error;
      return data || [];
    }
  });

  const { data: mappings, refetch: refetchMappings } = useQuery({
    queryKey: ['componentMappings', wireframeId, selectedLibrary],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('component_mappings')
        .select('*, wireframe_component_id, library_component_id')
        .eq('wireframe_id', wireframeId)
        .eq('library_id', selectedLibrary);

      if (error) throw error;
      return data || [];
    },
    enabled: !!wireframeId && !!selectedLibrary
  });

  const { data: wireframeComponents } = useQuery({
    queryKey: ['wireframeComponents', wireframeId],
    queryFn: async () => {
      const { data: wireframe, error: wireframeError } = await supabase
        .from('wireframes')
        .select('data')
        .eq('id', wireframeId)
        .single();

      if (wireframeError) throw wireframeError;
      
      // Extract unique component types from wireframe sections
      const componentTypes = new Set<string>();
      if (wireframe?.data?.sections) {
        wireframe.data.sections.forEach((section: any) => {
          if (section.components) {
            section.components.forEach((component: any) => {
              if (component.type) {
                componentTypes.add(component.type);
              }
            });
          }
        });
      }
      
      return Array.from(componentTypes).map(type => ({ type }));
    },
    enabled: !!wireframeId
  });

  const { data: libraryComponents } = useQuery({
    queryKey: ['libraryComponents', selectedLibrary],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('library_components')
        .select('*')
        .eq('library_id', selectedLibrary);

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedLibrary
  });

  const handleGenerateMapping = async () => {
    if (!selectedLibrary) {
      toast({
        title: "Library required",
        description: "Please select a component library first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsMapping(true);
    try {
      const { data, error } = await supabase.rpc('generate_component_mappings', {
        p_wireframe_id: wireframeId,
        p_library_id: selectedLibrary,
        p_specification_id: specificationId || null
      });

      if (error) throw error;

      toast({
        title: "Mapping complete",
        description: "Component library mapping has been generated successfully."
      });
      
      refetchMappings();
    } catch (error) {
      console.error('Error generating component mappings:', error);
      toast({
        title: "Mapping failed",
        description: "There was a problem generating the component mappings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsMapping(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Code2 className="h-5 w-5 mr-2" />
          Component Library Mapper
        </CardTitle>
        <CardDescription>
          Map wireframe components to actual development component libraries
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <Select 
            value={selectedLibrary} 
            onValueChange={setSelectedLibrary}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select component library" />
            </SelectTrigger>
            <SelectContent>
              {libraries?.map((library) => (
                <SelectItem key={library.id} value={library.id}>
                  {library.name} ({library.version})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handleGenerateMapping}
            disabled={!selectedLibrary || isMapping}
          >
            {isMapping ? 'Generating Mappings...' : 'Generate Mappings'}
          </Button>
        </div>
        
        {selectedLibrary && mappings && wireframeComponents && (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Wireframe Component</TableHead>
                  <TableHead>Library Component</TableHead>
                  <TableHead>Mapping Status</TableHead>
                  <TableHead>Properties</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wireframeComponents.map((component) => {
                  const mapping = mappings.find(m => 
                    m.wireframe_component_type === component.type
                  );
                  
                  const libraryComponent = mapping ? 
                    libraryComponents?.find(lc => lc.id === mapping.library_component_id) : 
                    null;
                  
                  return (
                    <TableRow key={component.type}>
                      <TableCell className="font-medium">{component.type}</TableCell>
                      <TableCell>
                        {libraryComponent ? (
                          <div className="flex items-center">
                            {libraryComponent.name}
                            <Badge variant="outline" className="ml-2">
                              {libraryComponent.category}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-gray-400">Not mapped</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {mapping ? (
                          <Badge className={
                            mapping.confidence > 0.8 ? 
                              "bg-green-100 text-green-800" : 
                              mapping.confidence > 0.5 ? 
                                "bg-amber-100 text-amber-800" : 
                                "bg-red-100 text-red-800"
                          }>
                            {mapping.confidence > 0.8 ? 'High Match' : 
                             mapping.confidence > 0.5 ? 'Moderate Match' : 'Low Match'} 
                            ({Math.round(mapping.confidence * 100)}%)
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-400">No mapping</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {mapping?.property_mappings && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                View Properties
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
                              <DialogHeader>
                                <DialogTitle>Property Mappings</DialogTitle>
                              </DialogHeader>
                              <div className="mt-4">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Wireframe Property</TableHead>
                                      <TableHead>Library Property</TableHead>
                                      <TableHead>Transformation</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {Object.entries(mapping.property_mappings).map(([wireProp, libMap]: [string, any]) => (
                                      <TableRow key={wireProp}>
                                        <TableCell className="font-medium">{wireProp}</TableCell>
                                        <TableCell>{libMap.target}</TableCell>
                                        <TableCell>
                                          {libMap.transform ? (
                                            <code className="bg-gray-100 p-1 rounded text-sm">
                                              {libMap.transform}
                                            </code>
                                          ) : (
                                            <span className="text-gray-400">Direct mapping</span>
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
        
        {selectedLibrary && (!mappings || mappings.length === 0) && (
          <div className="text-center p-8 border border-dashed rounded-md">
            <Code2 className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-600">No Mappings Available</h3>
            <p className="text-gray-500 mb-6">Generate mappings to connect wireframe components to your library</p>
          </div>
        )}
        
        {!selectedLibrary && (
          <div className="text-center p-8 border border-dashed rounded-md">
            <PlusCircle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-600">Select a Component Library</h3>
            <p className="text-gray-500">Choose a component library to generate mappings</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
