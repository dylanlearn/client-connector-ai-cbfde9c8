
import { Section } from '@/pages/design-analysis/components/types';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import SectionForm from './SectionForm';

interface SectionsManagerProps {
  sections: Section[];
  isAnalyzing: boolean;
  onAddSection: () => void;
  onRemoveSection: (index: number) => void;
  onSectionChange: (index: number, field: keyof Section, value: any) => void;
  onSectionNestedChange: (
    index: number,
    parentField: 'visualElements' | 'contentStructure',
    field: string,
    value: string
  ) => void;
}

const SectionsManager = ({
  sections,
  isAnalyzing,
  onAddSection,
  onRemoveSection,
  onSectionChange,
  onSectionNestedChange
}: SectionsManagerProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <Label>Sections to Analyze</Label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onAddSection}
          disabled={isAnalyzing || sections.length >= 10}
          className="h-8"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Section
        </Button>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <SectionForm
            key={index}
            section={section}
            index={index}
            isAnalyzing={isAnalyzing}
            onRemove={onRemoveSection}
            onChange={onSectionChange}
            onNestedChange={onSectionNestedChange}
            canRemove={sections.length > 1}
          />
        ))}
      </div>
    </div>
  );
};

export default SectionsManager;
