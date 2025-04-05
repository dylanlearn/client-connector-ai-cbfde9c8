
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Paintbrush, Palette, Layout } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import VisualPicker from "@/components/design/VisualPicker";
import { toast } from "sonner";
import { designOptions } from "@/data/design-options";

const DesignPicker = () => {
  const [activeTab, setActiveTab] = useState("layouts");
  const [selectedDesigns, setSelectedDesigns] = useState<Record<string, any>>({});

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
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="p-4">
                <CardContent className="p-0">
                  <h3 className="text-lg font-medium mb-4">Hero Sections</h3>
                  <VisualPicker 
                    options={heroOptions} 
                    onSelectOption={handleDesignSelect} 
                    category="hero"
                  />
                </CardContent>
              </Card>
              
              <Card className="p-4">
                <CardContent className="p-0">
                  <h3 className="text-lg font-medium mb-4">Navigation Bars</h3>
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
                <CardContent className="p-0">
                  <h3 className="text-lg font-medium mb-4">About Sections</h3>
                  <VisualPicker 
                    options={aboutOptions}
                    onSelectOption={handleDesignSelect} 
                    category="about"
                  />
                </CardContent>
              </Card>
              
              <Card className="p-4">
                <CardContent className="p-0">
                  <h3 className="text-lg font-medium mb-4">Footer Designs</h3>
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
                <CardContent className="p-0">
                  <h3 className="text-lg font-medium mb-4">Typography</h3>
                  <VisualPicker 
                    options={fontOptions}
                    onSelectOption={handleDesignSelect} 
                    category="font"
                  />
                </CardContent>
              </Card>
              
              <Card className="p-4">
                <CardContent className="p-0">
                  <h3 className="text-lg font-medium mb-4">Animations</h3>
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
                <CardContent className="p-0">
                  <h3 className="text-lg font-medium mb-4">Interactions</h3>
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
