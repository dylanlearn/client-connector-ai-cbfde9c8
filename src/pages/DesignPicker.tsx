
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Paintbrush, Palette, Layout, RefreshCw } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import VisualPicker from "@/components/design/VisualPicker";
import { toast } from "sonner";
import { designOptions } from "@/data/design-options";
import { useDesignImageGeneration } from "@/hooks/use-design-image-generation";
import { useAuth } from "@/hooks/use-auth";
import DesignImageManager from "@/components/design/DesignImageManager";

const DesignPicker = () => {
  const [activeTab, setActiveTab] = useState("layouts");
  const [selectedDesigns, setSelectedDesigns] = useState<Record<string, any>>({});
  const [refreshingCategory, setRefreshingCategory] = useState<string | null>(null);
  const { isGenerating, generateImage } = useDesignImageGeneration();
  const { user } = useAuth();
  
  const handleDesignSelect = (option: any, liked: boolean) => {
    if (liked) {
      setSelectedDesigns(prev => ({
        ...prev,
        [option.category]: [...(prev[option.category] || []), option]
      }));
      
      toast.success(`${option.title} added to your selections!`);
    } else {
      toast.info(`${option.title} skipped.`);
    }
  };
  
  const handleRefreshImages = async (category: string) => {
    if (isGenerating || !user) return;
    
    setRefreshingCategory(category);
    try {
      const categoryOptions = designOptions.filter(option => option.category === category);
      
      toast.info(`Refreshing ${category} designs with AI-generated images. This may take a moment...`);
      
      // We'll only refresh the first design in each category for demo purposes
      // In a real application, you might want to update all designs or let users pick which to update
      const option = categoryOptions[0];
      
      if (option) {
        const imageUrl = await generateImage(
          option.category,
          option.description,
          option.title
        );
        
        if (imageUrl) {
          // In a real app, you would update the designOptions array or save to a database
          toast.success(`Generated new ${category} image! In a real app, this would update your design options.`);
        }
      }
    } finally {
      setRefreshingCategory(null);
    }
  };
  
  // New function specifically for generating navbar images
  const handleRefreshNavbarImages = async () => {
    if (isGenerating || !user) return;
    
    setRefreshingCategory("navbar");
    try {
      const navbarOptions = designOptions.filter(option => option.category === "navbar");
      
      toast.info(`Refreshing navbar designs with AI-generated images. This may take a moment...`);
      
      // Generate images for all navbar options
      for (const option of navbarOptions) {
        toast.info(`Generating image for ${option.title}...`);
        
        const imageUrl = await generateImage(
          "navbar",
          option.description,
          option.title
        );
        
        if (imageUrl) {
          toast.success(`Generated image for ${option.title}!`);
        }
      }
      
      toast.success("All navbar images have been refreshed!");
    } catch (error) {
      console.error("Error generating navbar images:", error);
      toast.error("Failed to generate all navbar images. Please try again.");
    } finally {
      setRefreshingCategory(null);
    }
  };

  // Filter design options by category
  const heroOptions = designOptions.filter(option => option.category === "hero");
  const navbarOptions = designOptions.filter(option => option.category === "navbar");
  const aboutOptions = designOptions.filter(option => option.category === "about");
  const footerOptions = designOptions.filter(option => option.category === "footer");
  const fontOptions = designOptions.filter(option => option.category === "font");
  const animationOptions = designOptions.filter(option => option.category === "animation");
  const interactionOptions = designOptions.filter(option => option.category === "interaction");

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Design Picker</h1>
          <p className="text-muted-foreground">
            Swipe through design options to customize your project
          </p>
        </div>
        
        <DesignImageManager />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="layouts">
              <Layout className="mr-2 h-4 w-4" />
              Layouts
            </TabsTrigger>
            <TabsTrigger value="components">
              <Paintbrush className="mr-2 h-4 w-4" />
              Components
            </TabsTrigger>
            <TabsTrigger value="styles">
              <Palette className="mr-2 h-4 w-4" />
              Styles
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="layouts" className="pt-4">
            <div className="grid gap-8">
              <Card className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Hero Sections</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleRefreshImages("hero")}
                    disabled={isGenerating || refreshingCategory === "hero" || !user}
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${refreshingCategory === "hero" ? "animate-spin" : ""}`} />
                    Refresh Images
                  </Button>
                </div>
                <CardContent className="p-0">
                  <VisualPicker 
                    options={heroOptions} 
                    onSelectOption={handleDesignSelect} 
                    category="hero"
                  />
                </CardContent>
              </Card>
              
              <Card className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Navigation Bars</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={handleRefreshNavbarImages}
                      disabled={isGenerating || refreshingCategory === "navbar" || !user}
                    >
                      <RefreshCw className={`h-4 w-4 mr-1 ${refreshingCategory === "navbar" ? "animate-spin" : ""}`} />
                      Generate All Navbar Images
                    </Button>
                  </div>
                </div>
                <CardContent className="p-0">
                  <VisualPicker 
                    options={navbarOptions} 
                    onSelectOption={handleDesignSelect} 
                    category="navbar"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="components" className="pt-4">
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">About Sections</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleRefreshImages("about")}
                    disabled={isGenerating || refreshingCategory === "about" || !user}
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${refreshingCategory === "about" ? "animate-spin" : ""}`} />
                    Refresh Images
                  </Button>
                </div>
                <CardContent className="p-0">
                  <VisualPicker 
                    options={aboutOptions}
                    onSelectOption={handleDesignSelect} 
                    category="about"
                  />
                </CardContent>
              </Card>
              
              <Card className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Footer Designs</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleRefreshImages("footer")}
                    disabled={isGenerating || refreshingCategory === "footer" || !user}
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${refreshingCategory === "footer" ? "animate-spin" : ""}`} />
                    Refresh Images
                  </Button>
                </div>
                <CardContent className="p-0">
                  <VisualPicker 
                    options={footerOptions}
                    onSelectOption={handleDesignSelect} 
                    category="footer"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="styles" className="pt-4">
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Typography</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleRefreshImages("font")}
                    disabled={isGenerating || refreshingCategory === "font" || !user}
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${refreshingCategory === "font" ? "animate-spin" : ""}`} />
                    Refresh Images
                  </Button>
                </div>
                <CardContent className="p-0">
                  <VisualPicker 
                    options={fontOptions}
                    onSelectOption={handleDesignSelect} 
                    category="font"
                  />
                </CardContent>
              </Card>
              
              <Card className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Animations</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleRefreshImages("animation")}
                    disabled={isGenerating || refreshingCategory === "animation" || !user}
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${refreshingCategory === "animation" ? "animate-spin" : ""}`} />
                    Refresh Images
                  </Button>
                </div>
                <CardContent className="p-0">
                  <VisualPicker 
                    options={animationOptions}
                    onSelectOption={handleDesignSelect} 
                    category="animation"
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-8 mt-8">
              <Card className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Interactions</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleRefreshImages("interaction")}
                    disabled={isGenerating || refreshingCategory === "interaction" || !user}
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${refreshingCategory === "interaction" ? "animate-spin" : ""}`} />
                    Refresh Images
                  </Button>
                </div>
                <CardContent className="p-0">
                  <VisualPicker 
                    options={interactionOptions}
                    onSelectOption={handleDesignSelect} 
                    category="interaction"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DesignPicker;
