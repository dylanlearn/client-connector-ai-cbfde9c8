
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Wand2, 
  Book, 
  Brain,
  Eye, 
  EyeOff,
  Search,
  Hexagon,
  Plus,
  Settings,
  LayoutGrid
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Toggle } from '@/components/ui/toggle';
import { DesignIntelligencePanel } from '../intelligence';
import { WireframeData } from '@/services/ai/wireframe/wireframe-types'; 

interface WireframeControlsProps {
  projectId?: string;
  onWireframeCreated?: (result: any) => void;
  generateWireframe?: (params: any) => Promise<any>;
  isGenerating?: boolean;
  wireframe?: WireframeData | null;
}

export default function WireframeControls({
  projectId,
  onWireframeCreated,
  generateWireframe,
  isGenerating = false,
  wireframe
}: WireframeControlsProps) {
  const [description, setDescription] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAIDesignPanel, setShowAIDesignPanel] = useState(false);
  
  const handleGenerateClick = async () => {
    if (generateWireframe && description) {
      await generateWireframe({
        description,
        projectId
      });
    }
  };
  
  const handleTemplateSelect = async (templateId: string) => {
    if (generateWireframe) {
      await generateWireframe({
        templateId,
        projectId
      });
    }
    setShowTemplates(false);
  };
  
  const handleWireframeUpdate = (updatedWireframe: WireframeData) => {
    if (onWireframeCreated) {
      onWireframeCreated({
        success: true,
        wireframe: updatedWireframe
      });
    }
  };
  
  return (
    <div className="wireframe-controls space-y-4">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <Input
            placeholder="Describe your wireframe (e.g., landing page for tech startup)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full"
            disabled={isGenerating}
          />
        </div>
        <Button 
          onClick={handleGenerateClick} 
          disabled={isGenerating || !description}
          className="whitespace-nowrap"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate
            </>
          )}
        </Button>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Template Gallery</SheetTitle>
              <SheetDescription>
                Choose from our collection of pre-designed wireframe templates
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {['landing-page', 'dashboard', 'e-commerce', 'portfolio', 'blog', 'saas'].map(template => (
                <div 
                  key={template}
                  className="border rounded-lg p-2 cursor-pointer hover:border-primary"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="bg-muted aspect-video rounded-md mb-2"></div>
                  <p className="text-sm font-medium capitalize">{template.replace('-', ' ')}</p>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {wireframe && (
        <div className="flex items-center justify-between border-t border-b py-2 px-1">
          <div className="flex items-center gap-2">
            <Toggle
              aria-label="Toggle AI Design Intelligence"
              pressed={showAIDesignPanel}
              onPressedChange={setShowAIDesignPanel}
            >
              <Brain className="h-4 w-4 mr-1" />
              <span className="text-xs">Design Intelligence</span>
            </Toggle>
            
            <Toggle
              aria-label="Toggle Templates"
              pressed={showTemplates}
              onPressedChange={setShowTemplates}
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              <span className="text-xs">Templates</span>
            </Toggle>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-xs">
              <Plus className="h-3 w-3 mr-1" />
              Add Section
            </Button>
            
            <Button variant="ghost" size="sm" className="text-xs">
              <Settings className="h-3 w-3 mr-1" />
              Settings
            </Button>
          </div>
        </div>
      )}
      
      {wireframe && showAIDesignPanel && (
        <div className="mt-4">
          <DesignIntelligencePanel 
            wireframe={wireframe} 
            onUpdateWireframe={handleWireframeUpdate} 
            onClose={() => setShowAIDesignPanel(false)}
          />
        </div>
      )}
    </div>
  );
}
