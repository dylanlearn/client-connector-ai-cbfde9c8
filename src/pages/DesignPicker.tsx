
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Layout, 
  LayoutGrid,
  Heading1, 
  Navigation,
  Sparkles,
  Palette,
  ChevronDown,
  FlaskConical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import AnimatedVisualPicker from "@/components/design/AnimatedVisualPicker";
import RankedSelections from "@/components/design/RankedSelections";
import SelectionLimitDialog from "@/components/design/SelectionLimitDialog";
import SelectionProgress from "@/components/design/SelectionProgress";
import DesignPreview from "@/components/design/DesignPreview";
import AIDesignAssistant from "@/components/design/AIDesignAssistant";
import { useDesignSelection, RankedDesignOption } from "@/hooks/use-design-selection";
import { designOptions } from "@/data/design-options";
import { motion } from "framer-motion";

const DesignPicker = () => {
  const [activeCategory, setActiveCategory] = useState<"hero" | "navbar" | "about" | "footer" | "font" | "animation" | "interaction">("hero");
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  
  // Define selection limits by category
  const selectionLimits = {
    hero: 4,
    navbar: 4,
    about: 4,
    footer: 4,
    font: 2,
    animation: 3,
    interaction: 3
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
    font: <span className="text-xl font-bold">Aa</span>,
    animation: <Sparkles className="h-5 w-5" />,
    interaction: <FlaskConical className="h-5 w-5" />
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
  const categories = Object.keys(selectionLimits) as Array<keyof typeof selectionLimits>;

  // Toggle preview mode
  const togglePreview = () => {
    setShowPreview(prev => !prev);
  };

  return (
    <motion.div 
      className="container max-w-6xl mx-auto py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <SelectionProgress 
        completedCategories={completedCategories} 
        maxSelections={maxSelections}
        selectionLimitReached={selectionLimitReached}
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Design Your Website</h1>
        <Button
          variant={showPreview ? "default" : "outline"}
          size="sm"
          onClick={togglePreview}
          className="flex items-center gap-2"
        >
          <Palette className="h-4 w-4" />
          {showPreview ? "Hide Preview" : "Show Preview"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={showPreview ? "lg:col-span-6" : "lg:col-span-8"}>
          <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as typeof activeCategory)}>
            <TabsList className="grid grid-cols-7 mb-8 overflow-x-auto">
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
              <TabsTrigger value="animation" className="flex flex-col items-center gap-1 py-3">
                {categoryIcons.animation}
                <span className="text-xs">Anim {selectionsByCategory.animation || 0}/{selectionLimits.animation}</span>
              </TabsTrigger>
              <TabsTrigger value="interaction" className="flex flex-col items-center gap-1 py-3">
                {categoryIcons.interaction}
                <span className="text-xs">Inter {selectionsByCategory.interaction || 0}/{selectionLimits.interaction}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="hero">
              <AnimatedVisualPicker 
                options={designOptions} 
                category="hero" 
                onSelect={handleSelectDesign} 
              />
            </TabsContent>
            <TabsContent value="navbar">
              <AnimatedVisualPicker 
                options={designOptions} 
                category="navbar" 
                onSelect={handleSelectDesign} 
              />
            </TabsContent>
            <TabsContent value="about">
              <AnimatedVisualPicker 
                options={designOptions} 
                category="about" 
                onSelect={handleSelectDesign} 
              />
            </TabsContent>
            <TabsContent value="footer">
              <AnimatedVisualPicker 
                options={designOptions} 
                category="footer" 
                onSelect={handleSelectDesign} 
              />
            </TabsContent>
            <TabsContent value="font">
              <AnimatedVisualPicker 
                options={designOptions} 
                category="font" 
                onSelect={handleSelectDesign} 
              />
            </TabsContent>
            <TabsContent value="animation">
              <AnimatedVisualPicker 
                options={designOptions} 
                category="animation" 
                onSelect={handleSelectDesign} 
              />
            </TabsContent>
            <TabsContent value="interaction">
              <AnimatedVisualPicker 
                options={designOptions} 
                category="interaction" 
                onSelect={handleSelectDesign} 
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right side - AI Assistant or Preview */}
        <div className={showPreview ? "lg:col-span-6" : "lg:col-span-4"}>
          {showPreview ? (
            <DesignPreview selectedDesigns={selectedDesigns} />
          ) : (
            <AIDesignAssistant 
              selectedDesigns={selectedDesigns}
              onSuggestionSelect={handleSelectDesign}
            />
          )}
        </div>
      </div>

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
        <motion.h2 
          className="text-2xl font-bold mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your Selections
        </motion.h2>
        
        <Accordion type="multiple" className="w-full">
          {categories.map(category => {
            const designs = designsByCategory[category] || [];
            if (designs.length === 0) return null;
            
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <AccordionItem value={category}>
                  <AccordionTrigger className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="mr-2">{categoryIcons[category]}</span>
                      <span className="font-medium capitalize">{category} Selections</span>
                      <span className="text-muted-foreground ml-2">({designs.length}/{selectionLimits[category]})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <motion.div 
                      className="grid gap-4 pt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1, staggerChildren: 0.1 }}
                    >
                      {designs.map((design) => (
                        <motion.div 
                          key={design.id} 
                          className="border rounded-lg p-3 flex items-center justify-between gap-4"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                        >
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
                        </motion.div>
                      ))}
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
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
    </motion.div>
  );
};

export default DesignPicker;
