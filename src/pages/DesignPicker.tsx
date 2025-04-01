
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Layout, 
  LayoutGrid,
  Heading1, 
  Navigation 
} from "lucide-react";
import { cn } from "@/lib/utils";
import VisualPicker, { DesignOption } from "@/components/design/VisualPicker";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample design options
const designOptions: DesignOption[] = [
  {
    id: "hero-1",
    title: "Modern Hero",
    description: "A modern hero section with a large image and centered text",
    imageUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&q=80&w=1000",
    category: "hero"
  },
  {
    id: "hero-2",
    title: "Split Hero",
    description: "A split layout hero with text on one side and image on the other",
    imageUrl: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=1000",
    category: "hero"
  },
  {
    id: "hero-3",
    title: "Minimal Hero",
    description: "A minimal hero with a small headline and subtle background",
    imageUrl: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=1000",
    category: "hero"
  },
  {
    id: "navbar-1",
    title: "Standard Navbar",
    description: "A standard horizontal navbar with logo and links",
    imageUrl: "https://images.unsplash.com/photo-1481487196290-c152efe083f5?auto=format&fit=crop&q=80&w=1000",
    category: "navbar"
  },
  {
    id: "navbar-2",
    title: "Centered Navbar",
    description: "A centered navbar with logo in the middle and links on sides",
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000",
    category: "navbar"
  },
  {
    id: "about-1",
    title: "Team About Section",
    description: "An about section highlighting your team with photos",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000",
    category: "about"
  },
  {
    id: "about-2",
    title: "Story About Section",
    description: "An about section focused on telling your brand story",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1000",
    category: "about"
  },
  {
    id: "footer-1",
    title: "Simple Footer",
    description: "A simple footer with essential links and social media",
    imageUrl: "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?auto=format&fit=crop&q=80&w=1000",
    category: "footer"
  },
  {
    id: "footer-2",
    title: "Detailed Footer",
    description: "A comprehensive footer with multiple sections and newsletter",
    imageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=1000",
    category: "footer"
  },
  {
    id: "font-1",
    title: "Modern Sans",
    description: "A modern sans-serif font pairing for contemporary designs",
    imageUrl: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=1000",
    category: "font"
  },
  {
    id: "font-2",
    title: "Classic Serif",
    description: "A classic serif font pairing for traditional and elegant designs",
    imageUrl: "https://images.unsplash.com/photo-1467733037475-7c4435e7c543?auto=format&fit=crop&q=80&w=1000",
    category: "font"
  }
];

const DesignPicker = () => {
  const [selectedDesigns, setSelectedDesigns] = useState<Record<string, DesignOption>>({});
  const [activeCategory, setActiveCategory] = useState<DesignOption["category"]>("hero");
  const navigate = useNavigate();

  const handleSelectDesign = (option: DesignOption) => {
    setSelectedDesigns(prev => ({
      ...prev,
      [option.category]: option
    }));
  };

  const handleComplete = () => {
    console.log("Selected designs:", selectedDesigns);
    // Here you would typically save the selections and redirect
    navigate("/dashboard");
  };

  // Calculate progress
  const totalCategories = Array.from(new Set(designOptions.map(option => option.category))).length;
  const completedCategories = Object.keys(selectedDesigns).length;
  const progress = (completedCategories / totalCategories) * 100;

  const categoryIcons = {
    hero: <Layout className="h-5 w-5" />,
    navbar: <Navigation className="h-5 w-5" />,
    about: <Heading1 className="h-5 w-5" />,
    footer: <LayoutGrid className="h-5 w-5" />,
    font: <span className="text-xl font-bold">Aa</span>
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Design Your Website</h1>
        <p className="text-muted-foreground mb-4">
          Swipe to select your preferred design elements
        </p>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-muted-foreground">
          {completedCategories} of {totalCategories} selections completed
        </p>
      </div>

      <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as DesignOption["category"])}>
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="hero" className="flex flex-col items-center gap-1 py-3">
            {categoryIcons.hero}
            <span className="text-xs">Hero</span>
          </TabsTrigger>
          <TabsTrigger value="navbar" className="flex flex-col items-center gap-1 py-3">
            {categoryIcons.navbar}
            <span className="text-xs">Navbar</span>
          </TabsTrigger>
          <TabsTrigger value="about" className="flex flex-col items-center gap-1 py-3">
            {categoryIcons.about}
            <span className="text-xs">About</span>
          </TabsTrigger>
          <TabsTrigger value="footer" className="flex flex-col items-center gap-1 py-3">
            {categoryIcons.footer}
            <span className="text-xs">Footer</span>
          </TabsTrigger>
          <TabsTrigger value="font" className="flex flex-col items-center gap-1 py-3">
            {categoryIcons.font}
            <span className="text-xs">Fonts</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <VisualPicker 
            options={designOptions} 
            category="hero" 
            onSelect={handleSelectDesign} 
          />
        </TabsContent>
        <TabsContent value="navbar">
          <VisualPicker 
            options={designOptions} 
            category="navbar" 
            onSelect={handleSelectDesign} 
          />
        </TabsContent>
        <TabsContent value="about">
          <VisualPicker 
            options={designOptions} 
            category="about" 
            onSelect={handleSelectDesign} 
          />
        </TabsContent>
        <TabsContent value="footer">
          <VisualPicker 
            options={designOptions} 
            category="footer" 
            onSelect={handleSelectDesign} 
          />
        </TabsContent>
        <TabsContent value="font">
          <VisualPicker 
            options={designOptions} 
            category="font" 
            onSelect={handleSelectDesign} 
          />
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-end">
        <Button 
          onClick={handleComplete}
          disabled={completedCategories < totalCategories}
          className="px-6"
        >
          {completedCategories < totalCategories ? 
            `Select ${totalCategories - completedCategories} more elements` : 
            "Complete Selection"}
        </Button>
      </div>

      {/* Selected designs summary */}
      {completedCategories > 0 && (
        <div className="mt-8 p-4 border rounded-lg bg-muted/50">
          <h3 className="font-medium mb-2">Your selections:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(selectedDesigns).map(([category, design]) => (
              <div key={design.id} className="flex items-center gap-3 p-2 bg-background rounded border">
                <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded">
                  {categoryIcons[category as keyof typeof categoryIcons]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{design.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignPicker;
