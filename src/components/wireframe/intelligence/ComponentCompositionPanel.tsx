
import React, { useState, useCallback } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Settings, Save, Layers, Plus, Trash2 } from 'lucide-react';
import { useComponentComposition } from '@/hooks/wireframe/use-component-composition';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { WireframeComponent } from '@/types/wireframe-component';

interface ComponentCompositionPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe?: (updated: WireframeData) => void;
}

const ComponentCompositionPanel: React.FC<ComponentCompositionPanelProps> = ({
  wireframe,
  onUpdateWireframe
}) => {
  const {
    compositions,
    isCreating,
    selectedComponent,
    createComposition,
    saveAsComposition,
    applyComposition,
    selectComponent,
    deleteComposition,
    componentHierarchy
  } = useComponentComposition(wireframe, onUpdateWireframe);
  
  const [newCompositionName, setNewCompositionName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleSaveAsComposition = () => {
    if (selectedComponent) {
      saveAsComposition(selectedComponent, newCompositionName);
      setNewCompositionName('');
      setShowCreateForm(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Component Compositions</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New
        </Button>
      </div>
      
      {showCreateForm && (
        <Card className="mb-4">
          <CardContent className="pt-4 space-y-3">
            <Label htmlFor="composition-name">Composition Name</Label>
            <Input 
              id="composition-name"
              placeholder="Enter name for new composition"
              value={newCompositionName}
              onChange={(e) => setNewCompositionName(e.target.value)}
            />
            <div className="flex justify-between items-center mt-2">
              <Select onValueChange={(value) => selectComponent(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select component" />
                </SelectTrigger>
                <SelectContent>
                  {componentHierarchy.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.type} ({item.id.slice(-4)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                size="sm" 
                onClick={handleSaveAsComposition}
                disabled={!selectedComponent || !newCompositionName}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <ScrollArea className="h-[400px] rounded-md border p-4">
        {compositions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No component compositions saved yet
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {compositions.map((composition) => (
              <AccordionItem key={composition.id} value={composition.id}>
                <AccordionTrigger className="hover:bg-muted/50 px-2 rounded-md">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>{composition.name}</span>
                    <Badge variant="outline" className="ml-2">
                      {composition.type}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-2 space-y-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">Properties:</span>
                      <div className="text-xs rounded bg-muted p-2 font-mono">
                        {Object.keys(composition.properties || {}).map(key => (
                          <div key={key}>{key}: {JSON.stringify(composition.properties[key])}</div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => applyComposition(composition.id)}
                      >
                        Apply
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteComposition(composition.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </ScrollArea>
    </div>
  );
};

export default ComponentCompositionPanel;
