
import { Section } from '@/pages/design-analysis/components/types';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SectionFormProps {
  section: Section;
  index: number;
  isAnalyzing: boolean;
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof Section, value: any) => void;
  onNestedChange: (
    index: number,
    parentField: 'visualElements' | 'contentStructure',
    field: string,
    value: string
  ) => void;
  canRemove: boolean;
}

const sectionTypes = [
  'hero', 'navigation', 'features', 'testimonials', 
  'pricing', 'footer', 'about', 'contact', 'faq', 'cta'
];

const SectionForm = ({
  section,
  index,
  isAnalyzing,
  onRemove,
  onChange,
  onNestedChange,
  canRemove
}: SectionFormProps) => {
  return (
    <div className="p-4 border rounded-md relative">
      {canRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          className="absolute top-2 right-2 h-7 w-7"
          disabled={isAnalyzing}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <Label>Section Type</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={section.type}
            onChange={(e) => onChange(index, 'type', e.target.value)}
            disabled={isAnalyzing}
          >
            {sectionTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>Screenshot URL (optional)</Label>
          <Input
            placeholder="URL to section screenshot"
            value={section.imageUrl || ''}
            onChange={(e) => onChange(index, 'imageUrl', e.target.value)}
            disabled={isAnalyzing}
          />
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <Label>Description</Label>
        <Textarea
          placeholder="Describe this section's purpose and content"
          value={section.description}
          onChange={(e) => onChange(index, 'description', e.target.value)}
          rows={2}
          required
          disabled={isAnalyzing}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        <div className="space-y-2">
          <Label>Layout</Label>
          <Input
            placeholder="e.g., Grid, Two-column"
            value={section.visualElements.layout || ''}
            onChange={(e) => onNestedChange(index, 'visualElements', 'layout', e.target.value)}
            disabled={isAnalyzing}
          />
        </div>
        <div className="space-y-2">
          <Label>Color Scheme</Label>
          <Input
            placeholder="e.g., Blue dominant, High contrast"
            value={section.visualElements.colorScheme || ''}
            onChange={(e) => onNestedChange(index, 'visualElements', 'colorScheme', e.target.value)}
            disabled={isAnalyzing}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Headline</Label>
          <Input
            placeholder="Main headline text or style"
            value={section.contentStructure.headline || ''}
            onChange={(e) => onNestedChange(index, 'contentStructure', 'headline', e.target.value)}
            disabled={isAnalyzing}
          />
        </div>
        <div className="space-y-2">
          <Label>Call to Action</Label>
          <Input
            placeholder="e.g., 'Get Started', 'Learn More'"
            value={section.contentStructure.callToAction || ''}
            onChange={(e) => onNestedChange(index, 'contentStructure', 'callToAction', e.target.value)}
            disabled={isAnalyzing}
          />
        </div>
      </div>
    </div>
  );
};

export default SectionForm;
