
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types';

interface SettingsEditorProps {
  wireframe: WireframeData;
  onWireframeUpdate: (wireframe: WireframeData) => void;
}

const SettingsEditor: React.FC<SettingsEditorProps> = ({
  wireframe,
  onWireframeUpdate
}) => {
  const handleTitleChange = (title: string) => {
    onWireframeUpdate({
      ...wireframe,
      title
    });
  };
  
  const handleDescriptionChange = (description: string) => {
    onWireframeUpdate({
      ...wireframe,
      description
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-base">Wireframe Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wireframe-title">Title</Label>
            <Input
              id="wireframe-title"
              value={wireframe.title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="wireframe-description">Description</Label>
            <Textarea
              id="wireframe-description"
              value={wireframe.description || ''}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Wireframe ID</Label>
            <div className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
              {wireframe.id}
            </div>
          </div>
          
          {wireframe.projectId && (
            <div className="space-y-2">
              <Label>Project ID</Label>
              <div className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
                {wireframe.projectId}
              </div>
            </div>
          )}
          
          {wireframe.lastUpdated && (
            <div className="space-y-2">
              <Label>Last Updated</Label>
              <div className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
                {new Date(wireframe.lastUpdated).toLocaleString()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsEditor;
