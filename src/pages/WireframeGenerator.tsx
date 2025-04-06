
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useWireframeGeneration } from "@/hooks/use-wireframe-generation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowRight, Download, Copy, Code, Layout, RefreshCw, Share2 } from "lucide-react";
import WireframeVisualizer from "@/components/wireframe/WireframeVisualizer";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const WireframeGenerator = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [style, setStyle] = useState<string>("modern");
  const [multiPage, setMultiPage] = useState<boolean>(false);
  const [pagesCount, setPagesCount] = useState<number>(1);
  const { toast } = useToast();
  
  const {
    isGenerating,
    currentWireframe,
    generateWireframe,
  } = useWireframeGeneration();

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStyle(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    await generateWireframe({
      description: prompt,
      style,
      enhancedCreativity: true,
      multiPageLayout: multiPage,
      pages: pagesCount
    });
  };

  const handleGenerateVariation = async () => {
    if (!currentWireframe?.wireframe) return;
    
    toast({
      title: "Generating variation",
      description: "Creating a new variation based on your wireframe...",
    });
    
    await generateWireframe({
      description: `Create a variation of: ${prompt}`,
      style,
      enhancedCreativity: true,
      baseWireframe: currentWireframe.wireframe,
      multiPageLayout: multiPage,
      pages: pagesCount
    });
  };

  const examplePrompt = `Generate a clean, responsive wireframe for a SaaS landing page targeting small businesses. The page should include:

A sticky top navigation bar with logo placeholder, 4 navigation links, and a call-to-action button.

A hero section with a bold headline, supporting text, a main CTA button, and an illustration placeholder.

A features section with 3–4 columns/icons and short descriptions.

A testimonial section with 2 customer quotes and avatar placeholders.

A pricing section with 3 plan cards and a "most popular" badge on the middle one.

A FAQ accordion section with 4 sample questions.

A footer with 4 columns: product links, resources, company info, and social icons.

Keep the layout grid-based and modular, and include notes for spacing, padding, and visual hierarchy.`;

  const handleUseExample = () => {
    setPrompt(examplePrompt);
  };

  const handleCopyJSON = () => {
    if (currentWireframe) {
      navigator.clipboard.writeText(JSON.stringify(currentWireframe.wireframe, null, 2));
      toast({
        title: "Copied to clipboard",
        description: "Wireframe JSON has been copied to your clipboard."
      });
    }
  };
  
  const handleCopyImage = () => {
    toast({
      title: "Feature coming soon",
      description: "Image export functionality will be available soon."
    });
  };
  
  const handleDownload = () => {
    if (!currentWireframe) return;
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify(currentWireframe.wireframe, null, 2)
    );
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `wireframe-${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "Download started",
      description: "Your wireframe JSON file is being downloaded."
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Wireframe Generator</h1>
          <p className="text-muted-foreground">
            Describe your wireframe and our AI will generate a structured
            wireframe layout for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-5">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layout className="mr-2 h-5 w-5" />
                Generate Wireframe
              </CardTitle>
              <CardDescription>
                Provide a detailed description of the wireframe you need.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">
                      Style
                    </label>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="multiPage"
                        checked={multiPage}
                        onChange={(e) => setMultiPage(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="multiPage" className="text-sm">Multi-page</label>
                      
                      {multiPage && (
                        <select 
                          value={pagesCount}
                          onChange={(e) => setPagesCount(Number(e.target.value))}
                          className="ml-2 p-1 text-sm border rounded"
                        >
                          {[1, 2, 3, 4, 5].map(num => (
                            <option key={num} value={num}>{num} page{num > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                  <select
                    value={style}
                    onChange={handleStyleChange}
                    className="w-full p-2 border rounded-md bg-background"
                  >
                    <option value="modern">Modern</option>
                    <option value="minimal">Minimal</option>
                    <option value="bold">Bold</option>
                    <option value="classic">Classic</option>
                    <option value="tech">Tech</option>
                    <option value="creative">Creative</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Wireframe Description
                  </label>
                  <Textarea
                    value={prompt}
                    onChange={handlePromptChange}
                    rows={10}
                    placeholder="Describe your wireframe in detail..."
                    className="w-full resize-none"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleUseExample}
                  >
                    Use Example
                  </Button>
                  <Button
                    type="submit"
                    disabled={isGenerating || !prompt.trim()}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate Wireframe
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="lg:col-span-7">
            <CardHeader className="flex-row justify-between items-start space-y-0">
              <div>
                <CardTitle>Generated Wireframe</CardTitle>
                <CardDescription>
                  Your wireframe will appear here after generation.
                </CardDescription>
              </div>
              {currentWireframe && (
                <Badge variant="outline" className="ml-auto">
                  {currentWireframe.wireframe.pages?.length 
                    ? `${currentWireframe.wireframe.pages.length} pages` 
                    : `${currentWireframe.wireframe.sections?.length || 0} sections`}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="min-h-[300px]">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <div className="text-center">
                    <p className="font-medium">Generating Wireframe</p>
                    <p className="text-sm text-muted-foreground mt-1">This may take a moment...</p>
                  </div>
                </div>
              ) : currentWireframe ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {currentWireframe.wireframe.title || "Wireframe"}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {currentWireframe.wireframe.description || ""}
                    </p>
                  </div>

                  {/* Visual Wireframe Representation */}
                  <WireframeVisualizer wireframeData={currentWireframe.wireframe} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                  <Layout className="h-12 w-12 mb-4 text-muted-foreground/50" />
                  <p>No wireframe generated yet</p>
                  <p className="text-sm mt-1">
                    Fill out the form and click Generate
                  </p>
                </div>
              )}
            </CardContent>
            {currentWireframe && (
              <CardFooter className="flex flex-wrap justify-between gap-2">
                <Button variant="outline" size="sm" onClick={handleGenerateVariation}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate Variation
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleCopyJSON}>
                    <Code className="mr-2 h-4 w-4" />
                    Copy JSON
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCopyImage}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Image
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WireframeGenerator;
