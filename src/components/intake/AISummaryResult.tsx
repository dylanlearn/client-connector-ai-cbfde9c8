
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IntakeSummaryResult } from "@/services/ai/summary";
import { useToast } from "@/hooks/use-toast";

// Import the tab content components
import SummaryTab from "./summary-tabs/SummaryTab";
import DesignTab from "./summary-tabs/DesignTab";
import ContentTab from "./summary-tabs/ContentTab";

// Import the header and footer components
import SummaryHeader from "./summary-parts/SummaryHeader";
import SummaryFooter from "./summary-parts/SummaryFooter";

interface AISummaryResultProps {
  summaryResult: IntakeSummaryResult;
  isLoading?: boolean;
  onRegenerate?: () => void;
}

const AISummaryResult = ({ summaryResult, isLoading = false, onRegenerate }: AISummaryResultProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("summary");
  
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${label} has been copied to your clipboard.`,
    });
  };

  return (
    <Card className="shadow-md border-none bg-[#121212] text-white">
      <SummaryHeader 
        title={summaryResult.draftCopy.header} 
        isLoading={isLoading} 
        onRegenerate={onRegenerate || (() => {})} 
      />
      
      <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full p-0 bg-[#121212] border-b border-zinc-800 rounded-none">
          <TabsTrigger 
            value="summary" 
            className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-yellow-400 text-zinc-400 data-[state=active]:text-white"
          >
            Summary
          </TabsTrigger>
          <TabsTrigger 
            value="design" 
            className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-yellow-400 text-zinc-400 data-[state=active]:text-white"
          >
            Design Brief
          </TabsTrigger>
          <TabsTrigger 
            value="content" 
            className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-yellow-400 text-zinc-400 data-[state=active]:text-white"
          >
            Content
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="pt-6">
          <SummaryTab 
            summaryText={summaryResult.summary}
            onCopy={handleCopy}
          />
        </TabsContent>
        
        <TabsContent value="design" className="pt-6">
          <DesignTab tone={summaryResult.tone} />
        </TabsContent>
        
        <TabsContent value="content" className="pt-6">
          <ContentTab draftCopy={summaryResult.draftCopy} />
        </TabsContent>
      </Tabs>
      
      <SummaryFooter />
    </Card>
  );
};

export default AISummaryResult;
