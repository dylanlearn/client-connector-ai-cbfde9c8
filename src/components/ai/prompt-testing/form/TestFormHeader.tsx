
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TestFormHeaderProps {
  name: string;
  contentType: string;
  description: string;
  onNameChange: (value: string) => void;
  onContentTypeChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export const TestFormHeader = ({
  name,
  contentType,
  description,
  onNameChange,
  onContentTypeChange,
  onDescriptionChange
}: TestFormHeaderProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="test-name">Test Name</Label>
          <Input 
            id="test-name" 
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g., Tagline Generation Test"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content-type">Content Type</Label>
          <Select 
            value={contentType}
            onValueChange={onContentTypeChange}
          >
            <SelectTrigger id="content-type">
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="header">Header</SelectItem>
              <SelectItem value="tagline">Tagline</SelectItem>
              <SelectItem value="cta">Call to Action</SelectItem>
              <SelectItem value="description">Description</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="test-description">Description (Optional)</Label>
        <Textarea 
          id="test-description" 
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Describe the purpose of this test"
        />
      </div>
    </>
  );
};
