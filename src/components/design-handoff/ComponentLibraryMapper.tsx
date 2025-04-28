
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PlusCircle, X } from 'lucide-react';

interface ComponentLibraryMapperProps {
  wireframeId: string;
  specificationId?: string;
}

export const ComponentLibraryMapper: React.FC<ComponentLibraryMapperProps> = ({
  wireframeId,
  specificationId
}) => {
  const { toast } = useToast();
  const [selectedComponent, setSelectedComponent] = useState<string>('');
  const [libraryComponent, setLibraryComponent] = useState<string>('');
  const [mappingNote, setMappingNote] = useState<string>('');

  // Get wireframe components
  const { data: wireframeComponents } = useQuery({
    queryKey: ['wireframeComponents', wireframeId],
    queryFn: async () => {
      // In a real implementation, this would fetch the wireframe data and extract components
      // For now, let's return some mock data
      return [
        { id: 'header-1', name: 'Header' },
        { id: 'nav-1', name: 'Navigation' },
        { id: 'hero-1', name: 'Hero Banner' },
        { id: 'card-1', name: 'Feature Card' }
      ];
    }
  });

  // Get library component options
  const { data: libraryComponents } = useQuery({
    queryKey: ['libraryComponents'],
    queryFn: async () => {
      // In a real implementation, this would fetch from a component library table
      return [
        { id: 'header', name: 'Header Component' },
        { id: 'navigation', name: 'Navigation Bar' },
        { id: 'banner', name: 'Banner' },
        { id: 'card', name: 'Card' },
        { id: 'button', name: 'Button' }
      ];
    }
  });

  // Get existing mappings
  const { data: mappings, refetch } = useQuery({
    queryKey: ['componentMappings', wireframeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('component_library_mappings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const handleCreateMapping = async () => {
    if (!selectedComponent || !libraryComponent) {
      toast({
        title: "Missing Information",
        description: "Please select both wireframe component and library component",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.from('component_library_mappings').insert({
        wireframe_component_id: selectedComponent,
        library_component_name: libraryComponent,
        notes: mappingNote || null,
        property_mappings: {} // Empty mapping to start
      });

      if (error) throw error;

      toast({
        title: "Mapping Created",
        description: "Component mapping has been created successfully"
      });

      setSelectedComponent('');
      setLibraryComponent('');
      setMappingNote('');
      refetch();
    } catch (error) {
      console.error('Error creating component mapping:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create component mapping",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMapping = async (id: string) => {
    try {
      const { error } = await supabase
        .from('component_library_mappings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Mapping Deleted",
        description: "Component mapping has been removed"
      });

      refetch();
    } catch (error) {
      console.error('Error deleting mapping:', error);
      toast({
        title: "Deletion Failed",
        description: "Failed to delete component mapping",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Component Library Mapper</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Wireframe Component</label>
            <Select value={selectedComponent} onValueChange={setSelectedComponent}>
              <SelectTrigger>
                <SelectValue placeholder="Select component" />
              </SelectTrigger>
              <SelectContent>
                {wireframeComponents?.map((component) => (
                  <SelectItem key={component.id} value={component.id}>
                    {component.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Library Component</label>
            <Select value={libraryComponent} onValueChange={setLibraryComponent}>
              <SelectTrigger>
                <SelectValue placeholder="Select library component" />
              </SelectTrigger>
              <SelectContent>
                {libraryComponents?.map((component) => (
                  <SelectItem key={component.id} value={component.id}>
                    {component.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Notes</label>
          <Input
            value={mappingNote}
            onChange={(e) => setMappingNote(e.target.value)}
            placeholder="Add mapping notes (optional)"
          />
        </div>

        <Button onClick={handleCreateMapping} className="flex items-center">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Mapping
        </Button>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Existing Mappings</h3>
          {mappings && mappings.length > 0 ? (
            <div className="space-y-3">
              {mappings.map((mapping) => (
                <div 
                  key={mapping.id} 
                  className="p-3 bg-slate-50 rounded-md flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">
                      {mapping.wireframe_component_id} → {mapping.library_component_name}
                    </div>
                    {mapping.notes && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {mapping.notes}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteMapping(mapping.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 text-muted-foreground">
              No component mappings created yet.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
