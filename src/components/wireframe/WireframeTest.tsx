
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

const WireframeTest: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('preview');

  const [wireframe, setWireframe] = useState({
    id: uuidv4(),
    title: 'Test Wireframe',
    description: 'A test wireframe for development purposes',
    sections: [
      {
        id: uuidv4(),
        name: 'Hero Section',
        sectionType: 'hero',
        components: []
      },
      {
        id: uuidv4(),
        name: 'Features Section',
        sectionType: 'features',
        components: []
      }
    ]
  });

  const handleAddSection = () => {
    setWireframe(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: uuidv4(),
          name: 'New Section',
          sectionType: 'generic',
          components: []
        }
      ]
    }));

    toast({
      title: 'Section Added',
      description: 'A new section has been added to the wireframe'
    });
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Wireframe Test Component</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="p-4 border rounded-md mt-4">
            <div className="wireframe-preview">
              <h2 className="text-2xl font-bold">{wireframe.title}</h2>
              <p className="text-muted-foreground">{wireframe.description}</p>
              
              <div className="sections-list mt-4 space-y-4">
                {wireframe.sections.map(section => (
                  <div key={section.id} className="p-4 border rounded-md">
                    <h3 className="text-xl font-medium">{section.name}</h3>
                    <div className="text-sm text-muted-foreground">Type: {section.sectionType}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="editor" className="p-4 border rounded-md mt-4">
            <div className="wireframe-editor space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={wireframe.title}
                  onChange={(e) => setWireframe(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={wireframe.description}
                  onChange={(e) => setWireframe(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              
              <div className="sections-header flex items-center justify-between">
                <h3 className="text-lg font-medium">Sections</h3>
                <Button size="sm" onClick={handleAddSection}>Add Section</Button>
              </div>
              
              <div className="sections-editor space-y-2">
                {wireframe.sections.map(section => (
                  <Card key={section.id}>
                    <CardContent className="p-4">
                      <div className="grid gap-2">
                        <Label htmlFor={`section-${section.id}-name`}>Name</Label>
                        <Input
                          id={`section-${section.id}-name`}
                          value={section.name}
                          onChange={(e) => {
                            setWireframe(prev => ({
                              ...prev,
                              sections: prev.sections.map(s => 
                                s.id === section.id ? { ...s, name: e.target.value } : s
                              )
                            }));
                          }}
                        />
                      </div>
                      
                      <div className="grid gap-2 mt-2">
                        <Label htmlFor={`section-${section.id}-type`}>Type</Label>
                        <Select
                          value={section.sectionType}
                          onValueChange={(value) => {
                            setWireframe(prev => ({
                              ...prev,
                              sections: prev.sections.map(s => 
                                s.id === section.id ? { ...s, sectionType: value } : s
                              )
                            }));
                          }}
                        >
                          <SelectTrigger id={`section-${section.id}-type`}>
                            <SelectValue placeholder="Select a section type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hero">Hero</SelectItem>
                            <SelectItem value="features">Features</SelectItem>
                            <SelectItem value="testimonials">Testimonials</SelectItem>
                            <SelectItem value="pricing">Pricing</SelectItem>
                            <SelectItem value="faq">FAQ</SelectItem>
                            <SelectItem value="contact">Contact</SelectItem>
                            <SelectItem value="footer">Footer</SelectItem>
                            <SelectItem value="header">Header</SelectItem>
                            <SelectItem value="generic">Generic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="code" className="p-4 border rounded-md mt-4">
            <pre className="p-4 bg-muted rounded-md overflow-auto max-h-96">
              {JSON.stringify(wireframe, null, 2)}
            </pre>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WireframeTest;
