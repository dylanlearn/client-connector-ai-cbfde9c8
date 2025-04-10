
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WireframeComponentEditorProps {
  component: any;
  onUpdate: (updatedComponent: any) => void;
}

const WireframeComponentEditor: React.FC<WireframeComponentEditorProps> = ({
  component,
  onUpdate
}) => {
  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...component,
      content: e.target.value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Component</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="component-content">Content</Label>
          <Input
            id="component-content"
            value={typeof component?.content === 'string' ? component.content : ''}
            onChange={handleContentChange}
            placeholder="Component content"
          />
        </div>
        <div className="flex justify-end">
          <Button type="button" size="sm">Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WireframeComponentEditor;
