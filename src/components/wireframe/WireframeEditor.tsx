
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';

interface WireframeEditorProps {
  projectId?: string;
  wireframeData: any;
  onUpdate?: (updatedWireframe: any) => void;
}

const WireframeEditor: React.FC<WireframeEditorProps> = ({ 
  projectId, 
  wireframeData, 
  onUpdate 
}) => {
  const [title, setTitle] = useState(wireframeData?.title || 'Untitled Wireframe');
  const [description, setDescription] = useState(wireframeData?.description || '');
  
  if (!wireframeData) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-md">
        <p className="text-muted-foreground">No wireframe data to edit</p>
      </div>
    );
  }
  
  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...wireframeData,
        title,
        description
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Wireframe</CardTitle>
        <CardDescription>Modify wireframe details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Wireframe Title</Label>
          <Input 
            id="title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WireframeEditor;
