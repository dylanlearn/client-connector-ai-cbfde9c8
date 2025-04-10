
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WireframeSectionEditorProps {
  section: any;
  onUpdate: (updatedSection: any) => void;
}

const WireframeSectionEditor: React.FC<WireframeSectionEditorProps> = ({
  section,
  onUpdate
}) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...section,
      name: e.target.value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="section-name">Name</Label>
          <Input
            id="section-name"
            value={section?.name || ''}
            onChange={handleNameChange}
            placeholder="Section name"
          />
        </div>
        <div className="flex justify-end">
          <Button type="button" size="sm">Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WireframeSectionEditor;
