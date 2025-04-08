
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useWireframeGeneration } from "@/hooks/use-wireframe-generation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Loader2, ArrowRight, Download, Copy, Code, 
  Layout, RefreshCw, Share2, Layers, Monitor, 
  Smartphone, PanelLeft, Eye, Wand2
} from "lucide-react";
import { WireframeVisualizer, WireframeDataVisualizer } from "@/components/wireframe";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { v4 as uuidv4 } from 'uuid';

const WireframeGenerator = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [style, setStyle] = useState<string>("modern");
  const [viewMode, setViewMode] = useState<"flowchart" | "preview">("flowchart");
  const [multiPage, setMultiPage] = useState<boolean>(false);
  const [pagesCount, setPagesCount] = useState<number>(3);
  const [showComponentDrawer, setShowComponentDrawer] = useState<boolean>(false);
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
      pages: pagesCount,
      complexity: 'moderate'
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

  const toggleViewMode = () => {
    setViewMode(viewMode === "flowchart" ? "preview" : "flowchart");
  };

  const adaptWireframeForVisualizer = (data: any) => ({
    id: data.id || uuidv4(),
    title: data.title || "Wireframe Preview", // Ensure title is always provided
    description: data.description || "Generated wireframe",
    imageUrl: data.imageUrl || "/wireframes/default.jpg",
    sections: data.sections?.map((section: any, index: number) => ({
      id: section.id || `section-${index}`,
      name: section.name || section.type || `Section ${index + 1}`,
      description: section.description || section.content || "",
      imageUrl: section.imageUrl || ""
    })) || [],
    version: "1.0",
    lastUpdated: new Date().toLocaleDateString()
  });

  const sampleComponents = [
    { name: "Hero Section", type: "hero", preview: "/lovable-uploads/0507e956-3bf5-43ba-924e-9d353066ebad.png" },
    { name: "Feature Grid", type: "features", preview: "/placeholder.svg" },
    { name: "Testimonials", type: "testimonials", preview: "/placeholder.svg" },
    { name: "Pricing Cards", type: "pricing", preview: "/placeholder.svg" },
    { name: "Contact Form", type: "contact", preview: "/placeholder.svg" },
    { name: "Footer", type: "footer", preview: "/placeholder.svg" },
  ];

  const websiteReferences = [
    { name: "Linear.app", category: "SaaS", url: "https://linear.app" },
    { name: "Stripe", category: "Payments", url: "https://stripe.com" },
    { name: "Notion", category: "Productivity", url: "https://www.notion.so" },
    { name: "Arc Browser", category: "Software", url: "https://arc.net" },
  ];

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
          <Card className="lg:col-span-4">
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
                      <Switch 
                        id="multiPage" 
                        checked={multiPage}
                        onCheckedChange={setMultiPage}
                      />
                      <Label htmlFor="multiPage" className="ml-2">
                        Multi-page
                      </Label>
                      
                      {multiPage && (
                        <select 
                          value={pagesCount}
                          onChange={(e) => setPagesCount(Number(e.target.value))}
                          className="ml-2 p-1 text-sm border rounded"
                        >
                          {[2, 3, 4, 5].map(num => (
                            <option key={num} value={num}>{num} pages</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  <RadioGroup 
                    defaultValue="modern" 
                    value={style}
                    onValueChange={setStyle}
                    className="grid grid-cols-3 gap-2 mb-4"
                  >
                    <div>
                      <RadioGroupItem value="modern" id="modern" className="peer sr-only" />
                      <Label
                        htmlFor="modern"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span>Modern</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="minimal" id="minimal" className="peer sr-only" />
                      <Label
                        htmlFor="minimal"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span>Minimal</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="bold" id="bold" className="peer sr-only" />
                      <Label
                        htmlFor="bold"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span>Bold</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="classic" id="classic" className="peer sr-only" />
                      <Label
                        htmlFor="classic"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span>Classic</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="tech" id="tech" className="peer sr-only" />
                      <Label
                        htmlFor="tech"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span>Tech</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="creative" id="creative" className="peer sr-only" />
                      <Label
                        htmlFor="creative"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span>Creative</span>
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Wireframe Description
                    </label>
                    <Textarea
                      value={prompt}
                      onChange={handlePromptChange}
                      rows={8}
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
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="lg:col-span-8">
            <CardHeader className="flex flex-row justify-between items-start space-y-0">
              <div>
                <CardTitle>Generated Wireframe</CardTitle>
                <CardDescription>
                  {currentWireframe?.wireframe.title || "Your wireframe will appear here after generation."}
                </CardDescription>
              </div>
              {currentWireframe && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={toggleViewMode}
                    className="flex gap-1 items-center"
                  >
                    {viewMode === "flowchart" ? (
                      <>
                        <Eye className="h-4 w-4" />
                        Preview
                      </>
                    ) : (
                      <>
                        <Layers className="h-4 w-4" />
                        Flowchart
                      </>
                    )}
                  </Button>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex gap-1 items-center"
                      >
                        <PanelLeft className="h-4 w-4" />
                        Components
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[350px] sm:w-[450px]">
                      <SheetHeader>
                        <SheetTitle>Component Picker</SheetTitle>
                        <SheetDescription>
                          Browse and select components to add to your wireframe
                        </SheetDescription>
                      </SheetHeader>
                      <div className="grid grid-cols-2 gap-4 py-4">
                        {sampleComponents.map((component, index) => (
                          <Card key={index} className="overflow-hidden">
                            <CardContent className="p-0">
                              <div className="relative aspect-video bg-muted">
                                <img
                                  src={component.preview}
                                  alt={component.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </CardContent>
                            <CardFooter className="p-2 text-xs">
                              {component.name}
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                      <div className="mt-6">
                        <h3 className="font-medium mb-2">Top Designs</h3>
                        <div className="space-y-2">
                          {websiteReferences.map((site, index) => (
                            <div key={index} className="flex justify-between items-center p-2 border rounded">
                              <span>{site.name}</span>
                              <Badge variant="outline">{site.category}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              )}
            </CardHeader>
            <div className="px-6 pb-6">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-64 bg-muted/30 rounded-lg">
                  <Loader2 className="h-8 w-8 animate-spin mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Generating wireframe...</p>
                </div>
              ) : currentWireframe ? (
                <div className="relative">
                  <div className="absolute right-2 top-2 flex gap-1 z-10">
                    <Button size="icon" variant="outline" className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm" onClick={handleCopyJSON}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm" onClick={handleCopyImage}>
                      <Layout className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm" onClick={handleDownload}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm" onClick={handleGenerateVariation}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {viewMode === "flowchart" ? (
                    <div className="bg-muted/30 border rounded-xl overflow-hidden">
                      <WireframeVisualizer
                        wireframe={adaptWireframeForVisualizer(currentWireframe.wireframe)}
                        viewMode="flowchart"
                      />
                    </div>
                  ) : (
                    <Tabs defaultValue="desktop">
                      <TabsList className="mb-4">
                        <TabsTrigger value="desktop" className="flex items-center gap-1">
                          <Monitor className="h-4 w-4" />
                          Desktop
                        </TabsTrigger>
                        <TabsTrigger value="mobile" className="flex items-center gap-1">
                          <Smartphone className="h-4 w-4" />
                          Mobile
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="desktop">
                        <div className="bg-muted/30 border rounded-xl overflow-hidden">
                          <WireframeVisualizer
                            wireframe={adaptWireframeForVisualizer(currentWireframe.wireframe)}
                            viewMode="preview"
                            deviceType="desktop"
                          />
                        </div>
                      </TabsContent>
                      <TabsContent value="mobile">
                        <div className="max-w-[375px] mx-auto bg-muted/30 border rounded-xl overflow-hidden">
                          <WireframeVisualizer
                            wireframe={adaptWireframeForVisualizer(currentWireframe.wireframe)}
                            viewMode="preview"
                            deviceType="mobile"
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 border border-dashed rounded-lg text-center">
                  <Layout className="h-8 w-8 mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-2">No wireframe generated yet</p>
                  <p className="text-xs text-muted-foreground max-w-md">
                    Enter a detailed description and click "Generate Wireframe" to create your first wireframe
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WireframeGenerator;
