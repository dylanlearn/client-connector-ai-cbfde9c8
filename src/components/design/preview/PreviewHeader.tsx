
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Layout, Sparkles, Maximize2, Minimize2 } from "lucide-react";

interface PreviewHeaderProps {
  activeTab: "layout" | "animations";
  setActiveTab: (tab: "layout" | "animations") => void;
  activeView: "mobile" | "desktop";
  setActiveView: (view: "mobile" | "desktop") => void;
  isFullscreen: boolean;
  setIsFullscreen: (isFullscreen: boolean) => void;
}

const PreviewHeader = ({
  activeTab,
  setActiveTab,
  activeView,
  setActiveView,
  isFullscreen,
  setIsFullscreen
}: PreviewHeaderProps) => {
  return (
    <div className="flex items-center gap-2">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "layout" | "animations")}>
        <TabsList className="grid w-[180px] grid-cols-2">
          <TabsTrigger value="layout" className="flex items-center gap-1">
            <Layout className="h-4 w-4" />
            <span>Layout</span>
          </TabsTrigger>
          <TabsTrigger value="animations" className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            <span>Effects</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      {activeTab === "layout" && (
        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as "mobile" | "desktop")}>
          <TabsList className="grid w-[180px] grid-cols-2">
            <TabsTrigger value="desktop">Desktop</TabsTrigger>
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => setIsFullscreen(!isFullscreen)}
      >
        {isFullscreen ? (
          <Minimize2 className="h-4 w-4" />
        ) : (
          <Maximize2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default PreviewHeader;
