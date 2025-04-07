import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWebsiteAnalysis } from '@/hooks/ai-design/useWebsiteAnalysis';
import { AlertMessage } from '@/components/ui/alert-message';
import { Loader2, Globe, Section, Zap } from 'lucide-react';

export default function WebsiteAnalyzerComponent() {
  const [url, setUrl] = useState('');
  const [section, setSection] = useState<string>('hero');
  const [activeTab, setActiveTab] = useState<'full' | 'section'>('full');
  
  const { 
    isAnalyzing, 
    analyzeWebsite, 
    analyzeWebsiteSection, 
    analysisResults, 
    error 
  } = useWebsiteAnalysis();

  const handleAnalyzeWebsite = async () => {
    if (!url) return;
    
    if (activeTab === 'full') {
      await analyzeWebsite(url);
    } else {
      await analyzeWebsiteSection(section as any, url);
    }
  };

  const renderResults = () => {
    if (isAnalyzing) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Analyzing website...</p>
          <p className="text-sm text-muted-foreground mt-2">
            This may take a minute or two
          </p>
        </div>
      );
    }
    
    if (error) {
      return (
        <AlertMessage type="error" title="Analysis Error">
          {error}
        </AlertMessage>
      );
    }
    
    if (!analysisResults || analysisResults.length === 0) {
      return (
        <div className="text-center py-16">
          <Globe className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-lg font-medium">No analysis data yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Enter a website URL to get started
          </p>
        </div>
      );
    }
    
    const latestResult = analysisResults[analysisResults.length - 1];
    
    return (
      <div className="mt-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{latestResult.title}</CardTitle>
            <CardDescription>
              {latestResult.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Visual Elements</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Layout:</span> {latestResult.visualElements.layout}</p>
                  <p><span className="font-medium">Color Scheme:</span> {latestResult.visualElements.colorScheme}</p>
                  <p><span className="font-medium">Typography:</span> {latestResult.visualElements.typography}</p>
                  <p><span className="font-medium">Imagery:</span> {latestResult.visualElements.imagery || 'Not specified'}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">User Experience</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Navigation:</span> {latestResult.userExperience.navigation}</p>
                  <p><span className="font-medium">Interactivity:</span> {latestResult.userExperience.interactivity}</p>
                  <p><span className="font-medium">Responsiveness:</span> {latestResult.userExperience.responsiveness}</p>
                  <p><span className="font-medium">Accessibility:</span> {latestResult.userExperience.accessibility}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Content Analysis</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Tone:</span> {latestResult.contentAnalysis.tone}</p>
                <p><span className="font-medium">Messaging:</span> {latestResult.contentAnalysis.messaging}</p>
                <p><span className="font-medium">Call to Action:</span> {latestResult.contentAnalysis.callToAction}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Implementation Notes</h3>
              <div className="text-sm space-y-2">
                <p>{latestResult.implementationNotes}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {latestResult.tags.map((tag, index) => (
                  <span key={index} className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Website Design Analyzer</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Analyze Website Design</CardTitle>
          <CardDescription>
            Enter a URL to analyze design patterns and get implementation insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="full" value={activeTab} onValueChange={(value) => setActiveTab(value as 'full' | 'section')}>
            <TabsList className="mb-4">
              <TabsTrigger value="full" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Full Website
              </TabsTrigger>
              <TabsTrigger value="section" className="flex items-center gap-2">
                <Section className="h-4 w-4" />
                Specific Section
              </TabsTrigger>
            </TabsList>
            <TabsContent value="full">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Analyze the entire website design pattern and structure
                </p>
                <Input
                  placeholder="Enter website URL (e.g., https://example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="section">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Section Type</label>
                  <select
                    className="w-full border rounded-md px-3 py-2 mt-1"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                  >
                    <option value="hero">Hero Section</option>
                    <option value="features">Features Section</option>
                    <option value="testimonial">Testimonial Section</option>
                    <option value="pricing">Pricing Section</option>
                    <option value="contact">Contact Section</option>
                    <option value="footer">Footer Section</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Website URL</label>
                  <Input
                    placeholder="Enter website URL (e.g., https://example.com)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleAnalyzeWebsite} 
            disabled={isAnalyzing || !url}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Analyze {activeTab === 'full' ? 'Website' : 'Section'}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {renderResults()}
    </div>
  );
}
