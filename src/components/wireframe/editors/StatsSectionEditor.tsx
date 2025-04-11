
import React from 'react';
import { WireframeSection } from '@/services/ai/wireframe/wireframe-types';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface StatsSectionEditorProps {
  section: WireframeSection;
  onUpdate: (updates: Partial<WireframeSection>) => void;
}

const StatsSectionEditor: React.FC<StatsSectionEditorProps> = ({ section, onUpdate }) => {
  const stats = section.stats || [];

  // Handle title update
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      copySuggestions: {
        ...section.copySuggestions,
        heading: e.target.value
      }
    });
  };

  // Handle description update
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      copySuggestions: {
        ...section.copySuggestions,
        subheading: e.target.value
      }
    });
  };

  // Handle stat value update
  const handleStatValueChange = (index: number, value: string) => {
    const updatedStats = [...stats];
    updatedStats[index] = {
      ...updatedStats[index],
      value: value
    };
    onUpdate({ stats: updatedStats });
  };

  // Handle stat label update
  const handleStatLabelChange = (index: number, label: string) => {
    const updatedStats = [...stats];
    updatedStats[index] = {
      ...updatedStats[index],
      label: label
    };
    onUpdate({ stats: updatedStats });
  };

  // Add a new stat
  const handleAddStat = () => {
    const newStat = {
      id: uuidv4(),
      value: "100+",
      label: "New Statistic"
    };
    onUpdate({ stats: [...stats, newStat] });
  };

  // Remove a stat
  const handleRemoveStat = (index: number) => {
    const updatedStats = [...stats];
    updatedStats.splice(index, 1);
    onUpdate({ stats: updatedStats });
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="section-title">Section Title</Label>
          <Input 
            id="section-title"
            value={section.copySuggestions?.heading || ""}
            onChange={handleTitleChange}
            placeholder="Enter section title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="section-description">Section Description</Label>
          <Textarea
            id="section-description"
            value={section.copySuggestions?.subheading || ""}
            onChange={handleDescriptionChange}
            placeholder="Enter section description"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center mb-2">
            <Label>Statistics</Label>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddStat}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Stat
            </Button>
          </div>

          <Table>
            <TableCaption>Manage your statistics</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Value</TableHead>
                <TableHead>Label</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.map((stat, index) => (
                <TableRow key={stat.id || index}>
                  <TableCell>
                    <Input
                      value={stat.value || ""}
                      onChange={(e) => handleStatValueChange(index, e.target.value)}
                      placeholder="Stat value"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={stat.label || ""}
                      onChange={(e) => handleStatLabelChange(index, e.target.value)}
                      placeholder="Stat description"
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveStat(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {stats.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                    No statistics added. Click "Add Stat" to add one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsSectionEditor;
