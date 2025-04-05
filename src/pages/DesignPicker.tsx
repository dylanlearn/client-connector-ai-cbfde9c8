
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Paintbrush, Palette, Layout } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import VisualPicker from "@/components/design/VisualPicker";
import { toast } from "sonner";

// Sample design options for demonstration
const sampleDesignOptions = [
  {
    id: "hero-1",
    title: "Split Hero Layout",
    description: "Modern split layout with image on the right and CTA on the left",
    imageUrl: "https://placehold.co/600x400/e2e8f0/475569?text=Split+Hero",
    category: "hero"
  },
  {
    id: "hero-2",
    title: "Centered Hero",
    description: "Clean centered layout with clear call-to-action button",
    imageUrl: "https://placehold.co/600x400/e2e8f0/475569?text=Centered+Hero",
    category: "hero"
  },
  {
    id: "hero-3",
    title: "Full-width Hero",
    description: "Bold full-width layout with background image and overlay text",
    imageUrl: "https://placehold.co/600x400/e2e8f0/475569?text=Full+Width+Hero",
    category: "hero"
  },
  {
    id: "navbar-1",
    title: "Minimal Navigation",
    description: "Clean and minimal navigation bar with essential links",
    imageUrl: "https://placehold.co/600x400/e2e8f0/475569?text=Minimal+Nav",
    category: "navbar"
  },
  {
    id: "navbar-2",
    title: "Full-featured Navbar",
    description: "Navigation with dropdown menus and search functionality",
    imageUrl: "https://placehold.co/600x400/e2e8f0/475569?text=Full+Nav",
    category: "navbar"
  },
  {
    id: "footer-1",
    title: "Simple Footer",
    description: "Clean footer with minimal information and links",
    imageUrl: "https://placehold.co/600x400/e2e8f0/475569?text=Simple+Footer",
    category: "footer"
  },
  {
    id: "font-1",
    title: "Modern Sans-serif",
    description: "Clean and modern typography using Open Sans and Montserrat",
    imageUrl: "https://placehold.co/600x400/e2e8f0/475569?text=Modern+Sans",
    category: "font"
  }
];

const DesignPicker = () => {
  const [activeTab, setActiveTab] = useState("layouts");
  const [selectedDesigns, setSelectedDesigns] = useState<Record<string, any>>({});

  const handleDesignSelect = (option: any) => {
    setSelectedDesigns(prev => ({
      ...prev,
      [option.category]: [...(prev[option.category] || []), option]
    }));
    
    toast.success(`${option.title} added to your selections!`);
  };

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
                    options={sampleDesignOptions} 
                    onSelect={handleDesignSelect} 
                    category="hero"
                  />
                </CardContent>
              </Card>
              
              <Card className="p-4">
                <CardContent className="p-0">
                  <h3 className="text-lg font-medium mb-4">Navigation Bars</h3>
                  <VisualPicker 
                    options={sampleDesignOptions} 
                    onSelect={handleDesignSelect} 
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
                  <h3 className="text-lg font-medium mb-4">Footer Designs</h3>
                  <VisualPicker 
                    options={sampleDesignOptions} 
                    onSelect={handleDesignSelect} 
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
                    options={sampleDesignOptions} 
                    onSelect={handleDesignSelect} 
                    category="font"
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
