
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, PanelTop } from 'lucide-react';
import { WebsiteAnalysisResult } from '@/services/ai/design/website-analysis';
import { toast } from 'sonner';

interface FullWebsiteFormProps {
  isAnalyzing: boolean;
  onSubmit: (
    websiteName: string,
    websiteUrl: string,
    sections: {
      type: string;
      description: string;
      visualElements?: Partial<WebsiteAnalysisResult['visualElements']>;
      contentAnalysis?: Partial<WebsiteAnalysisResult['contentAnalysis']>;
      imageUrl?: string;
    }[]
  ) => Promise<void>;
}

const FullWebsiteForm = ({ isAnalyzing, onSubmit }: FullWebsiteFormProps) => {
  const [websiteName, setWebsiteName] = useState<string>('');
  const [websiteUrl, setWebsiteUrl] = useState<string>('');
  const [sections, setSections] = useState<
    {
      type: string;
      description: string;
      visualElements?: Partial<WebsiteAnalysisResult['visualElements']>;
      contentAnalysis?: Partial<WebsiteAnalysisResult['contentAnalysis']>;
      imageUrl?: string;
    }[]
  >([
    { type: 'hero', description: '' },
    { type: 'testimonials', description: '' }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!websiteName || !websiteUrl || sections.some(s => !s.description)) {
      toast.error('Please fill out all required fields for each section');
      return;
    }
    
    await onSubmit(websiteName, websiteUrl, sections);
    
    // Reset form
    setWebsiteName('');
    setWebsiteUrl('');
    setSections([
      { type: 'hero', description: '' },
      { type: 'testimonials', description: '' }
    ]);
  };

  const addSection = () => {
    setSections([...sections, { type: 'features', description: '' }]);
  };

  const removeSection = (index: number) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
  };

  const updateSection = (index: number, field: string, value: string) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setSections(newSections);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Full Website Analysis</CardTitle>
        <CardDescription>
          Analyze multiple sections of a website at once and store the design patterns.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="website-name">Website Name</Label>
              <Input 
                id="website-name" 
                placeholder="e.g., PageFlows" 
                value={websiteName} 
                onChange={(e) => setWebsiteName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="website-url">Website URL</Label>
              <Input 
                id="website-url" 
                placeholder="e.g., https://pageflows.com" 
                value={websiteUrl} 
                onChange={(e) => setWebsiteUrl(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-6">
            {sections.map((section, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Section {index + 1}</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => removeSection(index)}
                    disabled={sections.length <= 1}
                  >
                    Remove
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Section Type</Label>
                    <Select 
                      value={section.type} 
                      onValueChange={(value) => updateSection(index, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select section type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hero">Hero Section</SelectItem>
                        <SelectItem value="testimonials">Testimonials</SelectItem>
                        <SelectItem value="features">Features</SelectItem>
                        <SelectItem value="pricing">Pricing</SelectItem>
                        <SelectItem value="footer">Footer</SelectItem>
                        <SelectItem value="navigation">Navigation</SelectItem>
                        <SelectItem value="cta">Call to Action</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Image URL (Optional)</Label>
                    <Input 
                      placeholder="URL to screenshot" 
                      value={section.imageUrl || ''} 
                      onChange={(e) => updateSection(index, 'imageUrl', e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Label>Description</Label>
                  <Textarea 
                    placeholder="Describe what makes this section effective" 
                    value={section.description} 
                    onChange={(e) => updateSection(index, 'description', e.target.value)}
                    className="h-20"
                    required
                  />
                </div>
              </div>
            ))}

            <Button 
              type="button" 
              variant="outline" 
              onClick={addSection}
              className="w-full"
            >
              + Add Another Section
            </Button>
          </div>

          <div className="mt-6">
            <Button type="submit" disabled={isAnalyzing} className="w-full">
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Website...
                </>
              ) : (
                <>
                  <PanelTop className="mr-2 h-4 w-4" />
                  Analyze Full Website
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FullWebsiteForm;
