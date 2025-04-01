
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Layout, 
  LayoutGrid,
  Heading1, 
  Navigation,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import VisualPicker, { DesignOption } from "@/components/design/VisualPicker";
import RankedSelections from "@/components/design/RankedSelections";
import SelectionLimitDialog from "@/components/design/SelectionLimitDialog";
import SelectionProgress from "@/components/design/SelectionProgress";
import { useDesignSelection, RankedDesignOption } from "@/hooks/use-design-selection";
import { designOptions } from "@/data/design-options";

const DesignPicker = () => {
  const [activeCategory, setActiveCategory] = useState<DesignOption["category"]>("hero");
  const navigate = useNavigate();
  
  // Define selection limits by category
  const selectionLimits = {
    hero: 4,
    navbar: 4,
    about: 4,
    footer: 4,
    font: 2
  };

  const {
    selectedDesigns,
    setSelectedDesigns,
    selectionLimitReached,
    showLimitDialog,
    setShowLimitDialog,
    attemptedSelection,
    completedCategories,
    maxSelections,
    getSelectionsByCategory,
    handleSelectDesign,
    confirmReplaceSelection,
    handleRemoveDesign
  } = useDesignSelection(selectionLimits);

  const handleComplete = () => {
    const unrankedSelections = Object.values(selectedDesigns).filter(design => !design.rank);
    
    if (unrankedSelections.length > 0) {
      toast.error("Please rank all your selections before continuing");
      return;
    }
    
    console.log("Selected designs with ranks and notes:", selectedDesigns);
    toast.success("Your design selections have been saved!");
    navigate("/dashboard");
  };

  const categoryIcons = {
    hero: <Layout className="h-5 w-5" />,
    navbar: <Navigation className="h-5 w-5" />,
    about: <Heading1 className="h-5 w-5" />,
    footer: <LayoutGrid className="h-5 w-5" />,
    font: <span className="text-xl font-bold">Aa</span>
  };

  // Get counts by category to display in the tabs
  const selectionsByCategory = getSelectionsByCategory();

  // Group selected designs by category
  const getDesignsByCategory = () => {
    const designsByCategory: Record<string, RankedDesignOption[]> = {};
    
    Object.entries(selectedDesigns).forEach(([id, design]) => {
      if (!designsByCategory[design.category]) {
        designsByCategory[design.category] = [];
      }
      designsByCategory[design.category].push({...design, id});
    });
    
    return designsByCategory;
  };

  const designsByCategory = getDesignsByCategory();
  const categories = Object.keys(selectionLimits) as DesignOption["category"][];

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <SelectionProgress 
        completedCategories={completedCategories} 
        maxSelections={maxSelections}
        selectionLimitReached={selectionLimitReached}
      />

      <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as DesignOption["category"])}>
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="hero" className="flex flex-col items-center gap-1 py-3">
            {categoryIcons.hero}
            <span className="text-xs">Hero {selectionsByCategory.hero || 0}/{selectionLimits.hero}</span>
          </TabsTrigger>
          <TabsTrigger value="navbar" className="flex flex-col items-center gap-1 py-3">
            {categoryIcons.navbar}
            <span className="text-xs">Navbar {selectionsByCategory.navbar || 0}/{selectionLimits.navbar}</span>
          </TabsTrigger>
          <TabsTrigger value="about" className="flex flex-col items-center gap-1 py-3">
            {categoryIcons.about}
            <span className="text-xs">About {selectionsByCategory.about || 0}/{selectionLimits.about}</span>
          </TabsTrigger>
          <TabsTrigger value="footer" className="flex flex-col items-center gap-1 py-3">
            {categoryIcons.footer}
            <span className="text-xs">Footer {selectionsByCategory.footer || 0}/{selectionLimits.footer}</span>
          </TabsTrigger>
          <TabsTrigger value="font" className="flex flex-col items-center gap-1 py-3">
            {categoryIcons.font}
            <span className="text-xs">Fonts {selectionsByCategory.font || 0}/{selectionLimits.font}</span>
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
            "Complete Selection"}
        </Button>
      </div>

      {/* Collapsible Sections for Selected Designs */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Your Selections</h2>
        
        <Accordion type="multiple" className="w-full">
          {categories.map(category => {
            const designs = designsByCategory[category] || [];
            if (designs.length === 0) return null;
            
            return (
              <AccordionItem key={category} value={category}>
                <AccordionTrigger className="py-4">
                  <div className="flex items-center gap-2">
                    <span className="mr-2">{categoryIcons[category]}</span>
                    <span className="font-medium capitalize">{category} Selections</span>
                    <span className="text-muted-foreground ml-2">({designs.length}/{selectionLimits[category]})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-4 pt-2">
                    {designs.map((design) => (
                      <div key={design.id} className="border rounded-lg p-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-muted w-16 h-12 rounded-md overflow-hidden">
                            <img 
                              src={design.imageUrl} 
                              alt={design.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">{design.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-1">{design.description}</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRemoveDesign(design.id as string)}
                          className="text-destructive border-destructive hover:bg-destructive/10"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      <SelectionLimitDialog 
        open={showLimitDialog} 
        onOpenChange={setShowLimitDialog}
        onConfirm={confirmReplaceSelection}
        attemptedSelection={attemptedSelection}
        maxSelectionsByCategory={selectionLimits}
      />
    </div>
  );
};

export default DesignPicker;
