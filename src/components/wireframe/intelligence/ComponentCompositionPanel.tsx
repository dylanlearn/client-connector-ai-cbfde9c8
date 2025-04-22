
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash, LibraryBig, Copy, Box } from 'lucide-react';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { useComponentComposition } from '@/hooks/wireframe/use-component-composition';
import { Textarea } from '@/components/ui/textarea';

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
    selectedComponents,
    createComposition,
    applyComposition,
    deleteComposition,
    toggleComponentSelection,
    loadExampleCompositions
  } = useComponentComposition(wireframe, onUpdateWireframe);

  const [newComposition, setNewComposition] = useState({
    name: '',
    description: '',
    tags: ''
  });

  const handleCreateComposition = () => {
    if (!newComposition.name) return;
    
    createComposition(
      newComposition.name, 
      newComposition.description,
      newComposition.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    );
    
    setNewComposition({
      name: '',
      description: '',
      tags: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Component Compositions</h3>
          <p className="text-sm text-muted-foreground">
            Create and manage reusable component compositions
          </p>
        </div>
        <Button variant="outline" onClick={loadExampleCompositions}>
          <LibraryBig className="mr-2 h-4 w-4" />
          Load Examples
        </Button>
      </div>
      
      {/* Composition Creation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-md">Create Composition</CardTitle>
          <CardDescription>
            Save selected components as a reusable composition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="composition-name">Composition Name</Label>
              <Input
                id="composition-name"
                placeholder="e.g., Product Card with CTA"
                value={newComposition.name}
                onChange={(e) => setNewComposition({ ...newComposition, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="composition-description">Description</Label>
              <Textarea
                id="composition-description"
                placeholder="Describe this composition and its purpose..."
                value={newComposition.description}
                onChange={(e) => setNewComposition({ ...newComposition, description: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="composition-tags">Tags (comma separated)</Label>
              <Input
                id="composition-tags"
                placeholder="e.g., card, product, ecommerce"
                value={newComposition.tags}
                onChange={(e) => setNewComposition({ ...newComposition, tags: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Selected Components ({selectedComponents.length})</Label>
              {wireframe.sections.length > 0 ? (
                <div className="max-h-36 overflow-y-auto space-y-1 border rounded-md p-2">
                  {wireframe.sections.map((section) => (
                    <div key={section.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`component-${section.id}`}
                        checked={selectedComponents.includes(section.id)}
                        onCheckedChange={() => toggleComponentSelection(section.id)}
                      />
                      <Label 
                        htmlFor={`component-${section.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {section.name || section.sectionType || section.id}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No components available in wireframe</p>
              )}
            </div>
            
            <Button 
              onClick={handleCreateComposition} 
              disabled={isCreating || selectedComponents.length === 0 || !newComposition.name}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Composition
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Compositions Library */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Composition Library ({compositions.length})</h4>
        
        {compositions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Box className="mx-auto h-8 w-8 mb-2" />
            <p>No compositions available</p>
            <p className="text-sm">Create compositions or load examples</p>
          </div>
        ) : (
          <div className="space-y-3">
            {compositions.map((composition) => (
              <Card key={composition.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{composition.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {composition.description || 'No description provided'}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteComposition(composition.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {composition.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {composition.components && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {composition.components.length} component{composition.components.length !== 1 ? 's' : ''}
                    </p>
                  )}
                  
                  <Button 
                    variant="secondary"
                    className="w-full mt-3"
                    onClick={() => applyComposition(composition.id)}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Apply to Wireframe
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentCompositionPanel;
