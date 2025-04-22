
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LinkIcon, Lock, Unlock, ArrowsMaximize, MoveHorizontal, MoveVertical, SaveIcon } from 'lucide-react';
import { useComponentConstraints } from '@/hooks/wireframe/use-component-constraints';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ComponentConstraintPanelProps {
  wireframe: WireframeData;
  onUpdateWireframe?: (updated: WireframeData) => void;
}

const ComponentConstraintPanel: React.FC<ComponentConstraintPanelProps> = ({
  wireframe,
  onUpdateWireframe
}) => {
  const {
    selectedElement,
    elements,
    constraints,
    addConstraint,
    removeConstraint,
    updateConstraint,
    applyConstraints,
    resetConstraints,
    selectElement,
  } = useComponentConstraints(wireframe, onUpdateWireframe);
  
  const [activeTab, setActiveTab] = useState('sizing');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Component Constraints</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={applyConstraints}
        >
          <SaveIcon className="w-4 h-4 mr-2" />
          Apply All
        </Button>
      </div>
      
      <Card>
        <CardContent className="pt-4 space-y-3">
          <Label>Select Component</Label>
          <Select onValueChange={selectElement} value={selectedElement || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Select a component" />
            </SelectTrigger>
            <SelectContent>
              {elements.map((element) => (
                <SelectItem key={element.id} value={element.id}>
                  {element.type} ({element.id.slice(-4)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedElement && (
        <Tabs defaultValue="sizing" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="sizing">Sizing</TabsTrigger>
            <TabsTrigger value="position">Position</TabsTrigger>
            <TabsTrigger value="relationships">Relationships</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sizing">
            <Card>
              <CardContent className="pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="aspect-lock">Lock Aspect Ratio</Label>
                  <Switch 
                    id="aspect-lock"
                    checked={constraints.maintainAspectRatio}
                    onCheckedChange={(checked) => updateConstraint('maintainAspectRatio', checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Resize Strategy</Label>
                  <Select 
                    value={constraints.resizeStrategy || 'fixed'} 
                    onValueChange={(value) => updateConstraint('resizeStrategy', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="auto-height">Auto Height</SelectItem>
                      <SelectItem value="stretch-children">Stretch Children</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Min Width</Label>
                    <Badge variant="outline">{constraints.minWidth || 0}px</Badge>
                  </div>
                  <Slider 
                    min={0} 
                    max={500} 
                    step={1}
                    value={[constraints.minWidth || 0]}
                    onValueChange={([value]) => updateConstraint('minWidth', value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Min Height</Label>
                    <Badge variant="outline">{constraints.minHeight || 0}px</Badge>
                  </div>
                  <Slider 
                    min={0} 
                    max={500} 
                    step={1}
                    value={[constraints.minHeight || 0]}
                    onValueChange={([value]) => updateConstraint('minHeight', value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="position">
            <Card>
              <CardContent className="pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="position-lock">Lock Position</Label>
                  <Switch 
                    id="position-lock"
                    checked={constraints.positionLocked}
                    onCheckedChange={(checked) => updateConstraint('positionLocked', checked)}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <Label htmlFor="center-in-parent">Center in Parent</Label>
                  <Switch 
                    id="center-in-parent"
                    checked={constraints.centerInParent}
                    onCheckedChange={(checked) => updateConstraint('centerInParent', checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Horizontal Alignment</Label>
                  <Select 
                    value={constraints.horizontalAlignment || 'left'} 
                    onValueChange={(value) => updateConstraint('horizontalAlignment', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                      <SelectItem value="stretch">Stretch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Vertical Alignment</Label>
                  <Select 
                    value={constraints.verticalAlignment || 'top'} 
                    onValueChange={(value) => updateConstraint('verticalAlignment', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="middle">Middle</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                      <SelectItem value="stretch">Stretch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="relationships">
            <Card>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-2">
                    <Label>Related Components</Label>
                    <Button variant="outline" size="sm" onClick={() => addConstraint('relationship')}>
                      <LinkIcon className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  
                  {constraints.relationships && constraints.relationships.length > 0 ? (
                    <ScrollArea className="h-[200px] rounded-md border p-2">
                      {constraints.relationships.map((relation, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border-b last:border-0">
                          <div className="flex flex-col">
                            <span className="text-sm">{relation.targetId}</span>
                            <span className="text-xs text-muted-foreground">
                              {relation.type} - {relation.behavior}
                            </span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeConstraint('relationship', index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No relationships defined
                    </div>
                  )}
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" className="w-full" onClick={resetConstraints}>
                    Reset All Constraints
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ComponentConstraintPanel;
