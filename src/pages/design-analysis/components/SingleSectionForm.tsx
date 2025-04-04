
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WebsiteAnalysisResult } from '@/services/ai/design/website-analysis/types';
import { Loader2 } from 'lucide-react';

interface SingleSectionFormProps {
  isAnalyzing: boolean;
  onSubmit: (
    sectionType: string,
    description: string,
    visualElements: Partial<WebsiteAnalysisResult['visualElements']>,
    contentStructure: Partial<WebsiteAnalysisResult['contentStructure']>,
    websiteSource: string,
    imageUrl: string
  ) => Promise<void>;
}

const SingleSectionForm = ({ isAnalyzing, onSubmit }: SingleSectionFormProps) => {
  const [section, setSection] = useState('hero');
  const [description, setDescription] = useState('');
  const [layout, setLayout] = useState('');
  const [colorScheme, setColorScheme] = useState('');
  const [typography, setTypography] = useState('');
  const [headline, setHeadline] = useState('');
  const [callToAction, setCallToAction] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit(
      section,
      description,
      {
        layout,
        colorScheme,
        typography,
        spacing: '',
        imagery: ''
      },
      {
        headline,
        callToAction,
        subheadline: '',
        valueProposition: '',
        testimonials: []
      },
      sourceUrl,
      imageUrl
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Analyze a Website Section</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="section-type">Section Type</Label>
            <Select
              value={section}
              onValueChange={setSection}
              disabled={isAnalyzing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a section type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hero">Hero Section</SelectItem>
                <SelectItem value="testimonials">Testimonials</SelectItem>
                <SelectItem value="features">Features</SelectItem>
                <SelectItem value="pricing">Pricing</SelectItem>
                <SelectItem value="footer">Footer</SelectItem>
                <SelectItem value="navigation">Navigation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the section's purpose and content"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
              disabled={isAnalyzing}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="layout">Layout</Label>
              <Input
                id="layout"
                placeholder="e.g., Grid, Two-column, Center-aligned"
                value={layout}
                onChange={(e) => setLayout(e.target.value)}
                disabled={isAnalyzing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color-scheme">Color Scheme</Label>
              <Input
                id="color-scheme"
                placeholder="e.g., Blue-dominant, High contrast"
                value={colorScheme}
                onChange={(e) => setColorScheme(e.target.value)}
                disabled={isAnalyzing}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="typography">Typography</Label>
              <Input
                id="typography"
                placeholder="e.g., Sans-serif, Large headings"
                value={typography}
                onChange={(e) => setTypography(e.target.value)}
                disabled={isAnalyzing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                placeholder="Main headline text or style"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                disabled={isAnalyzing}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="call-to-action">Call to Action</Label>
              <Input
                id="call-to-action"
                placeholder="e.g., 'Get Started', 'Learn More'"
                value={callToAction}
                onChange={(e) => setCallToAction(e.target.value)}
                disabled={isAnalyzing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source-url">Website Source</Label>
              <Input
                id="source-url"
                placeholder="URL or name of the website"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                required
                disabled={isAnalyzing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image-url">Screenshot URL (optional)</Label>
            <Input
              id="image-url"
              placeholder="URL to a screenshot of the section"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={isAnalyzing}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Section'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SingleSectionForm;
