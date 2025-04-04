
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Section, AnalysisFormProps } from './types';
import FormHeader from './form/FormHeader';
import SectionsManager from './form/SectionsManager';

const FullWebsiteForm = ({ isAnalyzing, onSubmit }: AnalysisFormProps) => {
  const [websiteName, setWebsiteName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [sections, setSections] = useState<Section[]>([
    {
      type: 'hero',
      description: '',
      visualElements: {},
      contentStructure: {},
      imageUrl: ''
    }
  ]);

  const handleAddSection = () => {
    setSections([
      ...sections,
      {
        type: 'features',
        description: '',
        visualElements: {},
        contentStructure: {},
        imageUrl: ''
      }
    ]);
  };

  const handleRemoveSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSectionChange = (index: number, field: keyof Section, value: any) => {
    const updatedSections = [...sections];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    setSections(updatedSections);
  };

  const handleSectionNestedChange = (
    index: number, 
    parentField: 'visualElements' | 'contentStructure', 
    field: string, 
    value: string
  ) => {
    const updatedSections = [...sections];
    updatedSections[index] = { 
      ...updatedSections[index], 
      [parentField]: {
        ...updatedSections[index][parentField],
        [field]: value
      }
    };
    setSections(updatedSections);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(websiteName, websiteUrl, sections);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Analyze Complete Website</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormHeader
            websiteName={websiteName}
            websiteUrl={websiteUrl}
            isAnalyzing={isAnalyzing}
            onWebsiteNameChange={setWebsiteName}
            onWebsiteUrlChange={setWebsiteUrl}
          />

          <SectionsManager
            sections={sections}
            isAnalyzing={isAnalyzing}
            onAddSection={handleAddSection}
            onRemoveSection={handleRemoveSection}
            onSectionChange={handleSectionChange}
            onSectionNestedChange={handleSectionNestedChange}
          />

          <Button type="submit" className="w-full" disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Website'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FullWebsiteForm;
