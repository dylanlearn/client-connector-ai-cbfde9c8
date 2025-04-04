
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { WebsiteAnalysisResult } from '@/services/ai/design/website-analysis/types';
import { Loader2, Plus, X } from 'lucide-react';

interface Section {
  type: string;
  description: string;
  visualElements: Partial<WebsiteAnalysisResult['visualElements']>;
  contentStructure: Partial<WebsiteAnalysisResult['contentStructure']>;
  imageUrl?: string;
}

interface FullWebsiteFormProps {
  isAnalyzing: boolean;
  onSubmit: (
    websiteName: string,
    websiteUrl: string,
    sections: Section[]
  ) => Promise<void>;
}

const FullWebsiteForm = ({ isAnalyzing, onSubmit }: FullWebsiteFormProps) => {
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

  const sectionTypes = [
    'hero', 'navigation', 'features', 'testimonials', 
    'pricing', 'footer', 'about', 'contact', 'faq', 'cta'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Analyze Complete Website</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website-name">Website Name</Label>
              <Input
                id="website-name"
                placeholder="e.g., Company Website"
                value={websiteName}
                onChange={(e) => setWebsiteName(e.target.value)}
                required
                disabled={isAnalyzing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website-url">Website URL</Label>
              <Input
                id="website-url"
                placeholder="e.g., https://example.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                required
                disabled={isAnalyzing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
              <Label>Sections to Analyze</Label>
              <Button 
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAddSection}
                disabled={isAnalyzing || sections.length >= 10}
                className="h-8"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Section
              </Button>
            </div>

            <div className="space-y-6">
              {sections.map((section, index) => (
                <div key={index} className="p-4 border rounded-md relative">
                  {sections.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSection(index)}
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
                        onChange={(e) => handleSectionChange(index, 'type', e.target.value)}
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
                        onChange={(e) => handleSectionChange(index, 'imageUrl', e.target.value)}
                        disabled={isAnalyzing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Describe this section's purpose and content"
                      value={section.description}
                      onChange={(e) => handleSectionChange(index, 'description', e.target.value)}
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
                        onChange={(e) => handleSectionNestedChange(index, 'visualElements', 'layout', e.target.value)}
                        disabled={isAnalyzing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Color Scheme</Label>
                      <Input
                        placeholder="e.g., Blue dominant, High contrast"
                        value={section.visualElements.colorScheme || ''}
                        onChange={(e) => handleSectionNestedChange(index, 'visualElements', 'colorScheme', e.target.value)}
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
                        onChange={(e) => handleSectionNestedChange(index, 'contentStructure', 'headline', e.target.value)}
                        disabled={isAnalyzing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Call to Action</Label>
                      <Input
                        placeholder="e.g., 'Get Started', 'Learn More'"
                        value={section.contentStructure.callToAction || ''}
                        onChange={(e) => handleSectionNestedChange(index, 'contentStructure', 'callToAction', e.target.value)}
                        disabled={isAnalyzing}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
