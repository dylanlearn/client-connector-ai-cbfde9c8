
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IntakeSummaryResult } from "@/services/ai/summary/intake-summary-service";
import { RefreshCw, Check, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
    <Card className="shadow-md border-purple-100">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 pb-4 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">AI Analysis Summary</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRegenerate}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? "Regenerating..." : "Regenerate"}
          </Button>
        </div>
        <CardDescription>
          AI-generated insights from the client's intake form responses
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full p-0 bg-transparent border-b">
          <TabsTrigger value="summary" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-500">
            Summary
          </TabsTrigger>
          <TabsTrigger value="highlights" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-500">
            Highlights
          </TabsTrigger>
          <TabsTrigger value="copy" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-500">
            Draft Copy
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="pt-4">
          <CardContent>
            <div className="space-y-4">
              <div className="text-gray-800 whitespace-pre-line">
                {summaryResult.summary}
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleCopy(summaryResult.summary, "Summary")}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Summary
                </Button>
              </div>
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="highlights" className="pt-4">
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Tone</h3>
                <div className="flex flex-wrap gap-2">
                  {summaryResult.tone.map((toneItem, index) => (
                    <Badge key={index} variant="secondary">
                      {toneItem}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Direction</h3>
                <p className="text-gray-800">{summaryResult.direction}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Priorities</h3>
                <ul className="list-disc pl-5 text-gray-800">
                  {summaryResult.priorities.map((priority, index) => (
                    <li key={index}>{priority}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="copy" className="pt-4">
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Header</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleCopy(summaryResult.draftCopy.header, "Header")}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <p className="text-xl font-bold text-gray-800">
                  {summaryResult.draftCopy.header}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Subtext</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleCopy(summaryResult.draftCopy.subtext, "Subtext")}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <p className="text-gray-800">
                  {summaryResult.draftCopy.subtext}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Call to Action</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleCopy(summaryResult.draftCopy.cta, "CTA")}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <div className="flex justify-center">
                  <Button className="px-6">
                    {summaryResult.draftCopy.cta}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="bg-gray-50 p-4 text-sm text-gray-500 italic">
        This AI-generated content is provided as a starting point. You can regenerate or edit it as needed.
      </CardFooter>
    </Card>
  );
};

export default AISummaryResult;
