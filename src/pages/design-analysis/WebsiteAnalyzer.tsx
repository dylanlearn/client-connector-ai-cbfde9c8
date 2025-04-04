
import { useState } from 'react';
import { useWebsiteAnalysis } from '@/hooks/ai-design/useWebsiteAnalysis';
import { WebsiteAnalysisResult } from '@/services/ai/design/website-analysis-service';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Layout, Eye, Check, Loader2, Copy, Tags, Users, PanelTop, MessageSquare, Award, AlertTriangle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Page for analyzing website design patterns and storing them in memory
 */
const WebsiteAnalyzer = () => {
  const { analyzeWebsiteSection, analyzeWebsite, isAnalyzing, analysisResults } = useWebsiteAnalysis();
  const [activeTab, setActiveTab] = useState<string>('single-section');
  const [currentResult, setCurrentResult] = useState<WebsiteAnalysisResult | null>(null);

  // Try to get auth context, but don't throw if it doesn't exist
  let user;
  try {
    const auth = useAuth();
    user = auth?.user;
  } catch (e) {
    // Auth context not available, user remains undefined
  }

  // Form state for analyzing a single section
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

  // Form state for full website analysis
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

  const handleSingleSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !websiteSource) {
      toast.error('Please fill out the required fields');
      return;
    }
    
    const result = await analyzeWebsiteSection(
      sectionType,
      description,
      { layout, colorScheme, typography },
      { headline, subheadline, callToAction, valueProposition },
      websiteSource,
      imageUrl
    );
    
    if (result) {
      setCurrentResult(result);
      resetForm();
    }
  };

  const handleFullWebsiteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!websiteName || !websiteUrl || sections.some(s => !s.description)) {
      toast.error('Please fill out all required fields for each section');
      return;
    }
    
    const results = await analyzeWebsite(websiteName, websiteUrl, sections);
    
    if (results.length > 0) {
      setCurrentResult(results[0]);
      // Reset form
      setWebsiteName('');
      setWebsiteUrl('');
      setSections([
        { type: 'hero', description: '' },
        { type: 'testimonials', description: '' }
      ]);
    }
  };

  const resetForm = () => {
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
    <div className="container max-w-6xl py-8">
      <h1 className="text-3xl font-bold mb-6">Website Design Analysis</h1>
      <p className="text-muted-foreground mb-8">
        Analyze website design patterns and store them in the design memory database to enhance AI design recommendations.
      </p>

      {!user && (
        <Alert className="mb-6 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700 dark:text-yellow-400">
            You are not logged in. Please sign in to save your analyses to the database.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="single-section" className="text-sm">
                Single Section Analysis
              </TabsTrigger>
              <TabsTrigger value="full-website" className="text-sm">
                Full Website Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="single-section">
              <Card>
                <CardHeader>
                  <CardTitle>Analyze Website Section</CardTitle>
                  <CardDescription>
                    Analyze a specific section of a website and store the design pattern in memory.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSingleSectionSubmit}>
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
            </TabsContent>

            <TabsContent value="full-website">
              <Card>
                <CardHeader>
                  <CardTitle>Full Website Analysis</CardTitle>
                  <CardDescription>
                    Analyze multiple sections of a website at once and store the design patterns.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleFullWebsiteSubmit}>
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
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Analysis Results</span>
                {analysisResults.length > 0 && (
                  <Badge variant="outline">{analysisResults.length}</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Recent analysis results stored in memory
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentResult ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{currentResult.title}</h3>
                    <Badge>{currentResult.category}</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{currentResult.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-xs">
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{currentResult.source}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Tags className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{currentResult.tags.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Key Elements</h4>
                    <div className="text-xs space-y-1">
                      {currentResult.visualElements.layout && (
                        <div className="flex items-start gap-2">
                          <Layout className="h-3.5 w-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>{currentResult.visualElements.layout}</span>
                        </div>
                      )}
                      {currentResult.contentAnalysis.valueProposition && (
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{currentResult.contentAnalysis.valueProposition}</span>
                        </div>
                      )}
                      {currentResult.contentAnalysis.callToAction && (
                        <div className="flex items-start gap-2">
                          <Award className="h-3.5 w-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span>{currentResult.contentAnalysis.callToAction}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {currentResult.targetAudience.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-medium">Target Audience</h4>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {currentResult.targetAudience.map((audience, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              <Users className="mr-1 h-3 w-3" />
                              {audience}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : analysisResults.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {analysisResults.map((result, index) => (
                      <div 
                        key={index} 
                        className="border rounded-lg p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => setCurrentResult(result)}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-sm">{result.title}</h3>
                          <Badge variant="outline" className="text-xs">{result.category}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{result.description}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="h-[400px] flex items-center justify-center flex-col">
                  <div className="bg-muted rounded-full p-4 mb-4">
                    <Layout className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    No analysis results yet. Analyze a website section to see results here.
                  </p>
                </div>
              )}
            </CardContent>
            {currentResult && (
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentResult(null)}
                >
                  Back to List
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => {
                    toast.success("Analysis details copied to clipboard");
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Details
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WebsiteAnalyzer;
