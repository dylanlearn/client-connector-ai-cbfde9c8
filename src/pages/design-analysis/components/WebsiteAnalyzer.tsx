
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Search, LineChart, LayoutGrid, AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "sonner";

const WebsiteAnalyzer = () => {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedUrl, setAnalyzedUrl] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast.error("Please enter a URL to analyze");
      return;
    }
    
    // Validate URL format
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch (error) {
      toast.error("Please enter a valid URL");
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzedUrl(url);
      toast.success("Website analysis complete");
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Website Analyzer</h1>
          <p className="text-muted-foreground">
            Analyze any website for design patterns, performance, and accessibility issues
          </p>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              Enter Website URL
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative w-full">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="https://example.com"
                    className="pl-10"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={isAnalyzing}>
                  {isAnalyzing ? "Analyzing..." : "Analyze"}
                  {isAnalyzing ? (
                    <div className="ml-2 animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  ) : (
                    <Search className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
        
        {analyzedUrl && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Analysis Results</h2>
              <p className="text-muted-foreground">Website: {analyzedUrl}</p>
            </div>
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="design">Design Patterns</TabsTrigger>
                <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Website Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      <div className="space-y-2">
                        <div className="text-lg font-medium">Performance Score</div>
                        <div className="text-3xl font-bold">87/100</div>
                        <p className="text-sm text-muted-foreground">Excellent performance overall</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-lg font-medium">Design Score</div>
                        <div className="text-3xl font-bold">72/100</div>
                        <p className="text-sm text-muted-foreground">Good design with room for improvement</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-lg font-medium">Accessibility Score</div>
                        <div className="text-3xl font-bold">81/100</div>
                        <p className="text-sm text-muted-foreground">Very good accessibility rating</p>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Key Findings</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">Contrast issues in footer links</p>
                            <p className="text-sm text-muted-foreground">Some links have insufficient contrast ratio</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">Excellent page load speed</p>
                            <p className="text-sm text-muted-foreground">First contentful paint under 1.2s</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">Missing alt text on 3 images</p>
                            <p className="text-sm text-muted-foreground">Affects screen reader users' experience</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="performance">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <div className="text-sm font-medium">First Contentful Paint</div>
                          <div className="text-sm text-green-600 font-medium">1.2s</div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-green-500 rounded-full" style={{ width: "85%" }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <div className="text-sm font-medium">Largest Contentful Paint</div>
                          <div className="text-sm text-amber-600 font-medium">2.8s</div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-amber-500 rounded-full" style={{ width: "65%" }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <div className="text-sm font-medium">Cumulative Layout Shift</div>
                          <div className="text-sm text-green-600 font-medium">0.02</div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-green-500 rounded-full" style={{ width: "95%" }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <div className="text-sm font-medium">Time to Interactive</div>
                          <div className="text-sm text-amber-600 font-medium">3.4s</div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-amber-500 rounded-full" style={{ width: "70%" }}></div>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <h3 className="text-lg font-medium mb-2">Performance Recommendations</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            <span>Consider lazy loading below-the-fold images</span>
                          </li>
                          <li className="flex gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            <span>Minimize JavaScript bundle size by removing unused code</span>
                          </li>
                          <li className="flex gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            <span>Optimize third-party scripts loading</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="design">
                <Card>
                  <CardHeader>
                    <CardTitle>Design Pattern Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Detected Design Patterns</h3>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          <div className="border rounded-lg p-4">
                            <LayoutGrid className="h-6 w-6 text-primary mb-2" />
                            <h4 className="font-medium">Hero Section</h4>
                            <p className="text-sm text-muted-foreground">Large hero image with CTA button</p>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <LayoutGrid className="h-6 w-6 text-primary mb-2" />
                            <h4 className="font-medium">Feature Cards</h4>
                            <p className="text-sm text-muted-foreground">3-column feature card layout</p>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <LayoutGrid className="h-6 w-6 text-primary mb-2" />
                            <h4 className="font-medium">Testimonial Section</h4>
                            <p className="text-sm text-muted-foreground">Quote-style testimonials with avatars</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Color Palette</h3>
                        <div className="flex gap-2 flex-wrap">
                          <div className="flex flex-col items-center">
                            <div className="h-12 w-12 rounded-md bg-blue-600"></div>
                            <span className="text-xs mt-1">#2563eb</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-12 w-12 rounded-md bg-gray-800"></div>
                            <span className="text-xs mt-1">#1f2937</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-12 w-12 rounded-md bg-gray-100"></div>
                            <span className="text-xs mt-1">#f3f4f6</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-12 w-12 rounded-md bg-amber-500"></div>
                            <span className="text-xs mt-1">#f59e0b</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="h-12 w-12 rounded-md bg-white border"></div>
                            <span className="text-xs mt-1">#ffffff</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Typography Analysis</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <div>
                              <span className="text-sm font-medium">Headings</span>
                              <p className="text-xs text-muted-foreground">Inter, sans-serif</p>
                            </div>
                            <span className="text-sm">Font Size: 16px-48px</span>
                          </div>
                          <div className="flex justify-between">
                            <div>
                              <span className="text-sm font-medium">Body Text</span>
                              <p className="text-xs text-muted-foreground">Inter, sans-serif</p>
                            </div>
                            <span className="text-sm">Font Size: 14px-16px</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="accessibility">
                <Card>
                  <CardHeader>
                    <CardTitle>Accessibility Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-medium">Overall Score: 81/100</h3>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Good</span>
                        </div>
                        <p className="text-muted-foreground">The site has good accessibility practices with some areas for improvement.</p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Issues Found</h3>
                        <div className="space-y-3">
                          <div className="border-l-4 border-amber-500 pl-3">
                            <h4 className="font-medium">Missing Alternative Text</h4>
                            <p className="text-sm text-muted-foreground">3 images are missing alt text descriptions</p>
                          </div>
                          <div className="border-l-4 border-amber-500 pl-3">
                            <h4 className="font-medium">Contrast Issues</h4>
                            <p className="text-sm text-muted-foreground">Footer links have insufficient contrast ratio (2.8:1)</p>
                          </div>
                          <div className="border-l-4 border-amber-500 pl-3">
                            <h4 className="font-medium">Missing ARIA Labels</h4>
                            <p className="text-sm text-muted-foreground">2 form elements missing proper labels</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Recommendations</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                            <span>Add alt text to all images, describing their content and purpose</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                            <span>Increase contrast on footer links to at least 4.5:1 ratio</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                            <span>Add proper ARIA labels to all interactive elements</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                            <span>Ensure keyboard navigation works for all interactive elements</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-md">
                        <h3 className="text-md font-medium text-blue-800 mb-2">WCAG Compliance</h3>
                        <p className="text-sm text-blue-700">
                          This site meets most WCAG 2.1 AA guidelines but requires fixes to fully comply.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default WebsiteAnalyzer;
