
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Layout, Loader2 } from 'lucide-react';
import { WebsiteAnalysisResult } from '@/services/ai/design/website-analysis';
import { toast } from 'sonner';

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
  // Form state
  const [sectionType, setSectionType] = useState<string>('hero');
  const [description, setDescription] = useState<string>('');
  const [websiteSource, setWebsiteSource] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  // Content analysis state
  const [headline, setHeadline] = useState<string>('');
  const [subheadline, setSubheadline] = useState<string>('');
  const [callToAction, setCallToAction] = useState<string>('');
  const [valueProposition, setValueProposition] = useState<string>('');

  // Visual elements state
  const [layout, setLayout] = useState<string>('');
  const [colorScheme, setColorScheme] = useState<string>('');
  const [typography, setTypography] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !websiteSource) {
      toast.error('Please fill out the required fields');
      return;
    }
    
    await onSubmit(
      sectionType,
      description,
      { layout, colorScheme, typography },
      { headline, subheadline, callToAction, valueProposition },
      websiteSource,
      imageUrl
    );
    
    // Reset form
    setSectionType('hero');
    setDescription('');
    setWebsiteSource('');
    setImageUrl('');
    setHeadline('');
    setSubheadline('');
    setCallToAction('');
    setValueProposition('');
    setLayout('');
    setColorScheme('');
    setTypography('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyze Website Section</CardTitle>
        <CardDescription>
          Analyze a specific section of a website and store the design pattern in memory.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="section-type">Section Type</Label>
                <Select value={sectionType} onValueChange={setSectionType}>
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
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe what makes this section effective" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-24"
                  required
                />
              </div>

              <div>
                <Label htmlFor="website-source">Website Source</Label>
                <Input 
                  id="website-source" 
                  placeholder="e.g., pageflows.com" 
                  value={websiteSource} 
                  onChange={(e) => setWebsiteSource(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="image-url">Image URL (Optional)</Label>
                <Input 
                  id="image-url" 
                  placeholder="URL to screenshot or image of the section" 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium mb-2">Content Analysis</h3>
              <div>
                <Label htmlFor="headline">Headline</Label>
                <Input 
                  id="headline" 
                  placeholder="Main headline text" 
                  value={headline} 
                  onChange={(e) => setHeadline(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="subheadline">Subheadline</Label>
                <Input 
                  id="subheadline" 
                  placeholder="Supporting subheadline text" 
                  value={subheadline} 
                  onChange={(e) => setSubheadline(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="cta">Call to Action</Label>
                <Input 
                  id="cta" 
                  placeholder="Primary CTA text" 
                  value={callToAction} 
                  onChange={(e) => setCallToAction(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="value-prop">Value Proposition</Label>
                <Input 
                  id="value-prop" 
                  placeholder="Main value proposition" 
                  value={valueProposition} 
                  onChange={(e) => setValueProposition(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="layout">Layout Structure</Label>
              <Input 
                id="layout" 
                placeholder="e.g., Two-column with left alignment" 
                value={layout} 
                onChange={(e) => setLayout(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="color-scheme">Color Scheme</Label>
              <Input 
                id="color-scheme" 
                placeholder="e.g., Dark background with blue accents" 
                value={colorScheme} 
                onChange={(e) => setColorScheme(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="typography">Typography</Label>
              <Input 
                id="typography" 
                placeholder="e.g., Sans-serif headings with serif body" 
                value={typography} 
                onChange={(e) => setTypography(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6">
            <Button type="submit" disabled={isAnalyzing} className="w-full">
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Layout className="mr-2 h-4 w-4" />
                  Analyze Section
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SingleSectionForm;
