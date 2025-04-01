
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Layout, 
  LayoutGrid,
  Heading1, 
  Navigation
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import VisualPicker, { DesignOption } from "@/components/design/VisualPicker";
import RankedSelections from "@/components/design/RankedSelections";
import SelectionLimitDialog from "@/components/design/SelectionLimitDialog";
import SelectionProgress from "@/components/design/SelectionProgress";
import { useDesignSelection } from "@/hooks/use-design-selection";
import { designOptions } from "@/data/design-options";

const DesignPicker = () => {
  const [activeCategory, setActiveCategory] = useState<DesignOption["category"]>("hero");
  const navigate = useNavigate();
  const MAX_SELECTIONS = 4;

  const {
    selectedDesigns,
    setSelectedDesigns,
    selectionLimitReached,
    showLimitDialog,
    setShowLimitDialog,
    completedCategories,
    handleSelectDesign,
    confirmReplaceSelection,
    handleRemoveDesign
  } = useDesignSelection(MAX_SELECTIONS);

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

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <SelectionProgress 
        completedCategories={completedCategories} 
        maxSelections={MAX_SELECTIONS}
        selectionLimitReached={selectionLimitReached}
      />

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

      <RankedSelections 
        selectedDesigns={selectedDesigns}
        setSelectedDesigns={setSelectedDesigns}
        categoryIcons={categoryIcons}
        handleRemoveDesign={handleRemoveDesign}
      />

      <SelectionLimitDialog 
        open={showLimitDialog} 
        onOpenChange={setShowLimitDialog}
        onConfirm={confirmReplaceSelection}
        maxSelections={MAX_SELECTIONS}
      />
    </div>
  );
};

export default DesignPicker;
