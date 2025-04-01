
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Layout, 
  LayoutGrid,
  Heading1, 
  Navigation,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import VisualPicker, { DesignOption } from "@/components/design/VisualPicker";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Expanded design options with 8 for each category
const designOptions: DesignOption[] = [
  // Hero section options
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
    id: "hero-4",
    title: "Video Background Hero",
    description: "Dynamic hero with video background and overlay text",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1000",
    category: "hero"
  },
  {
    id: "hero-5",
    title: "Animated Text Hero",
    description: "Hero section with animated typing text and gradient background",
    imageUrl: "https://images.unsplash.com/photo-1579547944212-52d51cd2eed2?auto=format&fit=crop&q=80&w=1000",
    category: "hero"
  },
  {
    id: "hero-6",
    title: "3D Elements Hero",
    description: "Modern hero with interactive 3D elements and bold typography",
    imageUrl: "https://images.unsplash.com/photo-1554795808-3231c32487e4?auto=format&fit=crop&q=80&w=1000",
    category: "hero"
  },
  {
    id: "hero-7",
    title: "Parallax Hero",
    description: "Engaging hero section with parallax scrolling effects",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000",
    category: "hero"
  },
  {
    id: "hero-8",
    title: "Product Showcase Hero",
    description: "Hero focused on showcasing product features with call-to-action",
    imageUrl: "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&q=80&w=1000",
    category: "hero"
  },
  
  // Navbar options
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
    id: "navbar-3",
    title: "Transparent Navbar",
    description: "A transparent navbar that changes on scroll",
    imageUrl: "https://images.unsplash.com/photo-1581472723648-909f4851d4ae?auto=format&fit=crop&q=80&w=1000",
    category: "navbar"
  },
  {
    id: "navbar-4",
    title: "Sidebar Navigation",
    description: "A vertical sidebar navigation that stays fixed while scrolling",
    imageUrl: "https://images.unsplash.com/photo-1600267204091-5c1ab8b10c02?auto=format&fit=crop&q=80&w=1000",
    category: "navbar"
  },
  {
    id: "navbar-5",
    title: "Floating Navbar",
    description: "A floating navbar with glass morphism effect and rounded corners",
    imageUrl: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?auto=format&fit=crop&q=80&w=1000",
    category: "navbar"
  },
  {
    id: "navbar-6",
    title: "Hamburger Menu Navbar",
    description: "Clean navbar with hamburger menu for mobile and desktop",
    imageUrl: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80&w=1000",
    category: "navbar"
  },
  {
    id: "navbar-7",
    title: "Double-Decker Navbar",
    description: "Two-level navbar with contact info top and navigation below",
    imageUrl: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=1000",
    category: "navbar"
  },
  {
    id: "navbar-8",
    title: "Mega Menu Navbar",
    description: "Navbar with expandable mega menu dropdowns for complex sites",
    imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1000",
    category: "navbar"
  },
  
  // About section options
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
    id: "about-3",
    title: "Timeline About Section",
    description: "An about section showing company history in a timeline",
    imageUrl: "https://images.unsplash.com/photo-1569098644584-210bcd375b59?auto=format&fit=crop&q=80&w=1000",
    category: "about"
  },
  {
    id: "about-4",
    title: "Video About Section",
    description: "An about section with a featured video and key points",
    imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1000",
    category: "about"
  },
  {
    id: "about-5",
    title: "Stats About Section",
    description: "About section highlighting key company statistics and achievements",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
    category: "about"
  },
  {
    id: "about-6",
    title: "Mission About Section",
    description: "Section focusing on company mission, vision and values",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1000",
    category: "about"
  },
  {
    id: "about-7",
    title: "Image Grid About",
    description: "About section with image grid showcasing company culture",
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1000",
    category: "about"
  },
  {
    id: "about-8",
    title: "Testimonial About",
    description: "About section combining company info with customer testimonials",
    imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1000",
    category: "about"
  },
  
  // Footer options
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
    id: "footer-3",
    title: "Minimal Footer",
    description: "A minimalist footer with copyright and essential links",
    imageUrl: "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&q=80&w=1000",
    category: "footer"
  },
  {
    id: "footer-4",
    title: "CTA Footer",
    description: "A footer with a prominent call-to-action section",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1000",
    category: "footer"
  },
  {
    id: "footer-5",
    title: "Dark Mode Footer",
    description: "Modern dark-themed footer with light text and bold accents",
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1000",
    category: "footer"
  },
  {
    id: "footer-6",
    title: "Contact-Focused Footer",
    description: "Footer prioritizing contact information and support channels",
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000",
    category: "footer"
  },
  {
    id: "footer-7",
    title: "Map Footer",
    description: "Footer featuring an interactive location map alongside links",
    imageUrl: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?auto=format&fit=crop&q=80&w=1000",
    category: "footer"
  },
  {
    id: "footer-8",
    title: "Animated Footer",
    description: "Footer with subtle animations and interactive elements",
    imageUrl: "https://images.unsplash.com/photo-1585314062604-1a357de8b000?auto=format&fit=crop&q=80&w=1000",
    category: "footer"
  },
  
  // Font options
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
  },
  {
    id: "font-3",
    title: "Minimalist Mono",
    description: "A minimalist monospace font pairing for technical and modern designs",
    imageUrl: "https://images.unsplash.com/photo-1555421689-3f034debb7a6?auto=format&fit=crop&q=80&w=1000",
    category: "font"
  },
  {
    id: "font-4",
    title: "Creative Display",
    description: "A creative display font pairing for unique and standout designs",
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1000",
    category: "font"
  },
  {
    id: "font-5",
    title: "Elegant Script",
    description: "Sophisticated script font pairing with supporting sans-serif",
    imageUrl: "https://images.unsplash.com/photo-1574650351183-4e4e36821077?auto=format&fit=crop&q=80&w=1000",
    category: "font"
  },
  {
    id: "font-6",
    title: "Bold Geometric",
    description: "Strong geometric sans-serif fonts for impactful modern designs",
    imageUrl: "https://images.unsplash.com/photo-1561826748-2d2b8f3696a7?auto=format&fit=crop&q=80&w=1000",
    category: "font"
  },
  {
    id: "font-7",
    title: "Friendly Rounded",
    description: "Approachable rounded sans-serif fonts for friendly interfaces",
    imageUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=1000",
    category: "font"
  },
  {
    id: "font-8",
    title: "Tech Sans",
    description: "Clean, functional sans-serif fonts optimized for digital interfaces",
    imageUrl: "https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?auto=format&fit=crop&q=80&w=1000",
    category: "font"
  }
];

const DesignPicker = () => {
  const [selectedDesigns, setSelectedDesigns] = useState<Record<string, DesignOption>>({});
  const [activeCategory, setActiveCategory] = useState<DesignOption["category"]>("hero");
  const [selectionLimitReached, setSelectionLimitReached] = useState(false);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [attemptedSelection, setAttemptedSelection] = useState<DesignOption | null>(null);
  const navigate = useNavigate();

  // Maximum number of selections allowed
  const MAX_SELECTIONS = 4;

  const handleSelectDesign = (option: DesignOption) => {
    // Check if we're already at the limit and this is a new category
    if (
      Object.keys(selectedDesigns).length >= MAX_SELECTIONS && 
      !selectedDesigns[option.category]
    ) {
      setAttemptedSelection(option);
      setShowLimitDialog(true);
      return;
    }
    
    // If replacing an existing selection in the same category, allow it
    setSelectedDesigns(prev => ({
      ...prev,
      [option.category]: option
    }));
  };

  const confirmReplaceSelection = () => {
    if (attemptedSelection) {
      // Remove a random selection to make room for the new one
      const categories = Object.keys(selectedDesigns);
      if (categories.length > 0) {
        const randomCategory = categories[0];
        const newSelections = { ...selectedDesigns };
        delete newSelections[randomCategory];
        
        setSelectedDesigns({
          ...newSelections,
          [attemptedSelection.category]: attemptedSelection
        });
        
        toast.success(`Replaced ${randomCategory} design with ${attemptedSelection.category} design`);
      }
    }
    setShowLimitDialog(false);
    setAttemptedSelection(null);
  };

  const handleComplete = () => {
    console.log("Selected designs:", selectedDesigns);
    // Here you would typically save the selections and redirect
    toast.success("Your design selections have been saved!");
    navigate("/dashboard");
  };

  // Calculate progress
  const totalCategories = Array.from(new Set(designOptions.map(option => option.category))).length;
  const completedCategories = Object.keys(selectedDesigns).length;
  const progress = (completedCategories / MAX_SELECTIONS) * 100;

  // Check if we've reached the selection limit
  useEffect(() => {
    setSelectionLimitReached(Object.keys(selectedDesigns).length >= MAX_SELECTIONS);
  }, [selectedDesigns]);

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
          Swipe to select your preferred design elements (max 4 selections)
        </p>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-muted-foreground">
          {completedCategories} of {MAX_SELECTIONS} selections completed
        </p>
        
        {selectionLimitReached && (
          <div className="mt-2 p-2 bg-amber-100 text-amber-800 rounded-md flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>Selection limit reached. Replace existing choices or continue.</span>
          </div>
        )}
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
          disabled={completedCategories === 0}
          className="px-6"
        >
          {completedCategories === 0 ? 
            "Select at least one element" : 
            completedCategories < MAX_SELECTIONS ? 
              `Complete with ${completedCategories} selections` : 
              "Complete Selection"}
        </Button>
      </div>

      {/* Selected designs summary */}
      {completedCategories > 0 && (
        <div className="mt-8 p-4 border rounded-lg bg-muted/50">
          <h3 className="font-medium mb-2">Your selections ({completedCategories}/{MAX_SELECTIONS}):</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Alert dialog for selection limit */}
      <AlertDialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Selection Limit Reached</AlertDialogTitle>
            <AlertDialogDescription>
              You've already selected the maximum of {MAX_SELECTIONS} design elements. 
              Would you like to replace one of your existing selections?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReplaceSelection}>
              Replace a Selection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DesignPicker;
