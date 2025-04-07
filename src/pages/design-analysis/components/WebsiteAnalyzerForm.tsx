
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Globe, Section, Zap } from 'lucide-react';
import { WebsiteAnalysisResult, SectionType } from '@/hooks/ai-design/website-analysis/types';

interface WebsiteAnalyzerFormProps {
  isAnalyzing: boolean;
  activeTab: 'full' | 'section';
  setActiveTab: (tab: 'full' | 'section') => void;
  onAnalyzeWebsite: (url: string) => Promise<WebsiteAnalysisResult | null>;
  onAnalyzeWebsiteSection: (section: SectionType, url: string) => Promise<WebsiteAnalysisResult | null>;
}

export default function WebsiteAnalyzerForm({
  isAnalyzing,
  activeTab,
  setActiveTab,
  onAnalyzeWebsite,
  onAnalyzeWebsiteSection
}: WebsiteAnalyzerFormProps) {
  const [url, setUrl] = useState('');
  const [section, setSection] = useState<SectionType>('hero');

  const handleAnalyze = async () => {
    if (!url) return;
    
    if (activeTab === 'full') {
      await onAnalyzeWebsite(url);
    } else {
      await onAnalyzeWebsiteSection(section, url);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyze Website Design</CardTitle>
        <CardDescription>
          Enter a URL to analyze design patterns and get implementation insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'full' | 'section')}>
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
                  onChange={(e) => setSection(e.target.value as SectionType)}
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
          onClick={handleAnalyze} 
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
  );
}
