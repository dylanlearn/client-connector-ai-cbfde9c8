
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { useComponentComposition } from '@/hooks/wireframe/use-component-composition';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Boxes, Plus, Tag, Trash } from 'lucide-react';

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
    toggleComponentSelection
  } = useComponentComposition(wireframe, onUpdateWireframe);
  
  const [newComposition, setNewComposition] = useState({
    name: '',
    description: '',
    tags: ''
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('library');

  const handleCreateComposition = () => {
    if (newComposition.name) {
      const tags = newComposition.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);
        
      createComposition(newComposition.name, newComposition.description, tags);
      setNewComposition({ name: '', description: '', tags: '' });
      setDialogOpen(false);
    }
  };

  return (
    <div className="component-composition-panel space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h3 className="text-xl font-medium">Component Composition</h3>
          <p className="text-sm text-muted-foreground">
            Create reusable component compositions with nesting and inheritance
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Composition
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Composition</DialogTitle>
              <DialogDescription>
                Save a reusable group of components as a composition.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="comp-name">Name</Label>
                <Input 
                  id="comp-name" 
                  value={newComposition.name}
                  onChange={e => setNewComposition({...newComposition, name: e.target.value})}
                  placeholder="Hero Section with CTA"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="comp-description">Description</Label>
                <Textarea 
                  id="comp-description" 
                  value={newComposition.description}
                  onChange={e => setNewComposition({...newComposition, description: e.target.value})}
                  placeholder="A hero section with a headline, subheading, and call to action button"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="comp-tags">Tags (comma separated)</Label>
                <Input 
                  id="comp-tags" 
                  value={newComposition.tags}
                  onChange={e => setNewComposition({...newComposition, tags: e.target.value})}
                  placeholder="hero, cta, landing-page"
                />
              </div>
              
              <div className="border rounded-md p-3 mt-4">
                <p className="text-sm font-medium mb-2">Selected Components</p>
                {selectedComponents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No components selected</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedComponents.map(id => {
                      const section = wireframe.sections.find(s => s.id === id);
                      return (
                        <Badge key={id} variant="outline">
                          {section?.sectionType || section?.name || id}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateComposition}
                  disabled={!newComposition.name || selectedComponents.length === 0}
                >
                  Create Composition
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="library" onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="library">Composition Library</TabsTrigger>
          <TabsTrigger value="selection">Component Selection</TabsTrigger>
        </TabsList>
        
        <TabsContent value="library" className="space-y-4">
          {compositions.length === 0 ? (
            <div className="text-center py-12">
              <Boxes className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
              <h3 className="mt-4 text-lg font-medium">No Compositions Yet</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Create your first component composition to start building reusable elements.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {compositions.map(composition => (
                <Card key={composition.id} className="h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{composition.name}</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => deleteComposition(composition.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {composition.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {composition.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="border rounded-md bg-muted/20 h-24 flex items-center justify-center">
                      <p className="text-xs text-muted-foreground">
                        {composition.components.length} component(s)
                      </p>
                    </div>
                    
                    <div className="mt-4">
                      <Button 
                        size="sm" 
                        className="w-full" 
                        onClick={() => applyComposition(composition.id)}
                      >
                        Apply to Wireframe
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="selection" className="space-y-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">
                Select Components ({selectedComponents.length} selected)
              </h3>
              <Button 
                size="sm" 
                variant="outline" 
                disabled={selectedComponents.length === 0}
                onClick={() => setSelectedComponents([])}
              >
                Clear Selection
              </Button>
            </div>
            
            <div className="border rounded-md divide-y">
              {wireframe.sections.map((section, index) => (
                <div 
                  key={section.id || index} 
                  className={`flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 
                    ${selectedComponents.includes(section.id) ? 'bg-muted/30' : ''}`}
                  onClick={() => toggleComponentSelection(section.id)}
                >
                  <div>
                    <p className="font-medium">
                      {section.sectionType || section.name || `Section ${index + 1}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ID: {section.id.substring(0, 8)}...
                    </p>
                  </div>
                  <div className="flex items-center">
                    {selectedComponents.includes(section.id) && (
                      <Badge>Selected</Badge>
                    )}
                  </div>
                </div>
              ))}
              
              {wireframe.sections.length === 0 && (
                <p className="p-4 text-center text-muted-foreground">
                  No sections available in this wireframe
                </p>
              )}
            </div>
            
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  if (selectedComponents.length > 0) {
                    setActiveTab('library');
                    setDialogOpen(true);
                  }
                }}
                disabled={selectedComponents.length === 0}
              >
                Create Composition from Selection
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComponentCompositionPanel;
