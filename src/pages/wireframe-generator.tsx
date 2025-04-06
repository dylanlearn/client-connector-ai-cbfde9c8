import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useWireframeGeneration } from "@/hooks/use-wireframe-generation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Loader2, ArrowRight, Download, Copy, Code, 
  Layout, RefreshCw, Share2, Layers, Monitor, 
  Smartphone, PanelLeft, Eye, Grid, LayoutGrid,
  Tablet, Palette, SlidersHorizontal, ScissorsSquare,
  Wand2
} from "lucide-react";
import WireframeVisualizer from "@/components/wireframe/WireframeVisualizer";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import StylePreviewCard from "@/components/wireframe/StylePreviewCard";
import ColorSchemeSelector from "@/components/wireframe/ColorSchemeSelector";
import { ScrollArea } from "@/components/ui/scroll-area";

const availableStyles = [
  { id: "modern", name: "Modern", description: "Clean and contemporary design with balanced proportions" },
  { id: "minimalist", name: "Minimalist", description: "Simple and elegant with lots of whitespace" },
  { id: "brutalist", name: "Brutalist", description: "Raw, bold, and unconventional design" },
  { id: "corporate", name: "Corporate", description: "Professional and business-oriented layout" },
  { id: "playful", name: "Playful", description: "Fun and engaging with vibrant elements" },
  { id: "glassy", name: "Glassy", description: "Modern, transparent elements with subtle blur effects" },
  { id: "editorial", name: "Editorial", description: "Clean typography and layout inspired by print media" },
  { id: "tech-forward", name: "Tech Forward", description: "Modern tech aesthetic with sleek UI elements" },
  { id: "bold", name: "Bold", description: "Strong visual impact with prominent typography" }
];

const WireframeGenerator = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [style, setStyle] = useState<string>("modern");
  const [viewMode, setViewMode] = useState<"flowchart" | "preview">("preview");
  const [multiPage, setMultiPage] = useState<boolean>(false);
  const [pagesCount, setPagesCount] = useState<number>(3);
  const [deviceType, setDeviceType] = useState<"desktop" | "mobile" | "tablet">("desktop");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [highlightSections, setHighlightSections] = useState<boolean>(false);
  const [colorScheme, setColorScheme] = useState({
    primary: "#4F46E5",
    secondary: "#A855F7",
    accent: "#F59E0B",
    background: "#FFFFFF"
  });
  const { toast } = useToast();
  
  const {
    isGenerating,
    currentWireframe,
    generateWireframe,
  } = useWireframeGeneration();

  useEffect(() => {
    setColorScheme(prev => ({
      ...prev,
      background: darkMode ? "#111827" : "#FFFFFF"
    }));
  }, [darkMode]);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    console.log("Generating wireframe with options:", { 
      prompt, style, multiPage, pagesCount, colorScheme 
    });

    await generateWireframe({
      description: prompt,
      style,
      enhancedCreativity: true,
      multiPageLayout: multiPage,
      pages: pagesCount,
      colorTheme: `${colorScheme.primary},${colorScheme.secondary},${colorScheme.accent},${colorScheme.background}`,
      designTokens: {
        colors: colorScheme,
        typography: {
          headings: "Raleway, sans-serif",
          body: "Inter, sans-serif"
        }
      }
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
      pages: pagesCount,
      colorTheme: `${colorScheme.primary},${colorScheme.secondary},${colorScheme.accent},${colorScheme.background}`
    });
  };

  const handleStyleSelect = (styleId: string) => {
    setStyle(styleId);
  };

  const examplePrompt = `Generate a financial dashboard wireframe with:

A sidebar navigation with links to Dashboard, Transactions, Reports, and Settings.

A top header bar with user profile and notifications.

Four KPI metric cards showing Total Revenue, Active Users, Conversion Rate, and Average Transaction.

Two main charts - a line chart for Revenue Trends and a pie chart for Sales Distribution.

A recent transactions table at the bottom with pagination controls.

Use a clean, professional design suitable for finance applications.`;

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

  useEffect(() => {
    if (currentWireframe) {
      console.log("Current wireframe data:", currentWireframe);
      console.log("Wireframe sections:", currentWireframe.wireframe?.sections);
      console.log("Wireframe pages:", currentWireframe.wireframe?.pages);
    }
  }, [currentWireframe]);

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
            <Tabs defaultValue="prompt">
              <TabsList className="grid grid-cols-3 mx-6">
                <TabsTrigger value="prompt">Prompt</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="color">Colors</TabsTrigger>
              </TabsList>
              <CardContent>
                <TabsContent value="prompt">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <div className="mb-6">
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
                      
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="multiPage" 
                            checked={multiPage}
                            onCheckedChange={setMultiPage}
                          />
                          <Label htmlFor="multiPage" className="text-sm">
                            Multi-page
                          </Label>
                        </div>
                        
                        {multiPage && (
                          <div className="flex items-center space-x-2">
                            <Label htmlFor="pagesCount" className="text-sm">Pages:</Label>
                            <select 
                              id="pagesCount"
                              value={pagesCount}
                              onChange={(e) => setPagesCount(Number(e.target.value))}
                              className="p-1 text-sm border rounded"
                            >
                              {[2, 3, 4, 5].map(num => (
                                <option key={num} value={num}>{num}</option>
                              ))}
                            </select>
                          </div>
                        )}
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
                </TabsContent>
                
                <TabsContent value="style">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Design Style</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Choose a design style for your wireframe. This will influence the layout, typography, and overall aesthetic.
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableStyles.map((styleOption) => (
                        <StylePreviewCard
                          key={styleOption.id}
                          styleName={styleOption.name}
                          description={styleOption.description}
                          selected={style === styleOption.id}
                          onClick={() => handleStyleSelect(styleOption.id)}
                          darkMode={darkMode}
                        />
                      ))}
                    </div>
                    
                    <div className="pt-4 flex items-center space-x-2">
                      <Switch 
                        id="darkMode" 
                        checked={darkMode}
                        onCheckedChange={setDarkMode}
                      />
                      <Label htmlFor="darkMode" className="text-sm">
                        Dark Mode
                      </Label>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="color">
                  <h3 className="text-sm font-medium mb-2">Color Scheme</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose colors for your wireframe. These will be used for buttons, accents, and other elements.
                  </p>
                  
                  <ColorSchemeSelector 
                    colorScheme={colorScheme}
                    onChange={setColorScheme}
                  />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>

          <Card className="lg:col-span-8">
            <CardHeader className="flex flex-row justify-between items-start space-y-0">
              <div>
                <CardTitle>
                  {currentWireframe?.wireframe?.title || "Generated Wireframe"}
                </CardTitle>
                <CardDescription>
                  {currentWireframe?.wireframe?.description || "Your wireframe will appear here after generation."}
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
                  
                  <div className="flex border rounded-md">
                    <Button 
                      variant={deviceType === "desktop" ? "secondary" : "ghost"}
                      size="sm" 
                      onClick={() => setDeviceType("desktop")}
                      className="rounded-r-none px-2"
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={deviceType === "tablet" ? "secondary" : "ghost"}
                      size="sm" 
                      onClick={() => setDeviceType("tablet")}
                      className="rounded-none px-2 border-x"
                    >
                      <Tablet className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={deviceType === "mobile" ? "secondary" : "ghost"}
                      size="sm" 
                      onClick={() => setDeviceType("mobile")}
                      className="rounded-l-none px-2"
                    >
                      <Smartphone className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex border rounded-md overflow-hidden">
                    <Button 
                      variant={showGrid ? "secondary" : "ghost"}
                      size="sm" 
                      onClick={() => setShowGrid(!showGrid)}
                      className="rounded-r-none px-2"
                      title="Show Grid"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={highlightSections ? "secondary" : "ghost"}
                      size="sm" 
                      onClick={() => setHighlightSections(!highlightSections)}
                      className="rounded-l-none px-2 border-l"
                      title="Highlight Sections"
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                  </div>
                  
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
                        <SheetTitle>Component Library</SheetTitle>
                        <SheetDescription>
                          Drag and drop components to customize your wireframe
                        </SheetDescription>
                      </SheetHeader>
                      <ScrollArea className="h-[calc(100vh-120px)] pr-4">
                        <Tabs defaultValue="sections">
                          <TabsList className="grid grid-cols-2 mb-4">
                            <TabsTrigger value="sections">
                              <Layout className="h-4 w-4 mr-2" />
                              Sections
                            </TabsTrigger>
                            <TabsTrigger value="reference">
                              <Palette className="h-4 w-4 mr-2" />
                              References
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="sections">
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
                                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 hover:bg-black/20 transition-opacity">
                                        <Button variant="secondary" size="sm">
                                          <ScissorsSquare className="h-4 w-4 mr-2" />
                                          Add
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                  <div className="p-2 text-xs font-medium">
                                    {component.name}
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </TabsContent>
                          <TabsContent value="reference">
                            <div className="mt-6">
                              <h3 className="font-medium mb-2">Design Inspiration</h3>
                              <div className="space-y-2">
                                {websiteReferences.map((site, index) => (
                                  <div key={index} className="flex justify-between items-center p-3 border rounded hover:bg-accent/10 transition-colors">
                                    <div>
                                      <p className="font-medium">{site.name}</p>
                                      <p className="text-xs text-muted-foreground">{site.url}</p>
                                    </div>
                                    <Badge variant="outline">{site.category}</Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </ScrollArea>
                    </SheetContent>
                  </Sheet>
                </div>
              )}
            </CardHeader>
            <CardContent className="relative">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-80 space-y-4">
                  <div className="relative">
                    <div className="h-32 w-32 rounded-full border-4 border-t-blue-500 border-b-blue-700 border-l-blue-600 border-r-blue-400 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Wand2 className="h-12 w-12 text-blue-500 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-1">Generating Wireframe</h3>
                    <p className="text-muted-foreground">
                      Creating your design based on your description...
                    </p>
                  </div>
                </div>
              ) : currentWireframe && currentWireframe.wireframe ? (
                <div className="border rounded-lg p-4 relative min-h-80">
                  <WireframeVisualizer 
                    wireframeData={currentWireframe.wireframe} 
                    viewMode={viewMode}
                    deviceType={deviceType}
                    darkMode={darkMode}
                    showGrid={showGrid}
                    highlightSections={highlightSections}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-80 text-center space-y-4">
                  <Layout className="h-16 w-16 text-gray-300" />
                  <div>
                    <h3 className="text-lg font-medium mb-1">No Wireframe Generated Yet</h3>
                    <p className="text-muted-foreground max-w-md">
                      Provide a description and click "Generate Wireframe" to create your design.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            {currentWireframe && currentWireframe.wireframe && (
              <CardFooter className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleGenerateVariation}
                  disabled={isGenerating}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate Variation
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopyJSON}
                >
                  <Code className="mr-2 h-4 w-4" />
                  Copy JSON
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDownload}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopyImage}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy as Image
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={true}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WireframeGenerator;
