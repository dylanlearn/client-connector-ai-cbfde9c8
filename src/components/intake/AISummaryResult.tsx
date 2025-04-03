
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
          <CardTitle className="text-xl">Project Analysis</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRegenerate}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
        <CardDescription>
          Insights from your intake form responses
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full p-0 bg-transparent border-b">
          <TabsTrigger value="summary" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-500">
            Summary
          </TabsTrigger>
          <TabsTrigger value="highlights" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-500">
            Key Insights
          </TabsTrigger>
          <TabsTrigger value="copy" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-500">
            Content Ideas
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="pt-4">
          <CardContent>
            <div className="space-y-4">
              <div className="text-gray-800 leading-relaxed">
                {summaryResult.summary
                  .replace(/#{1,3}\s?([^#\n]+)/g, "$1") // Remove markdown headers
                  .split('\n\n')
                  .filter(paragraph => paragraph.trim() !== '')
                  .map((paragraph, i) => (
                    <p key={i} className="mb-4">{paragraph}</p>
                  ))}
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleCopy(summaryResult.summary, "Summary")}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Text
                </Button>
              </div>
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="highlights" className="pt-4">
          <CardContent>
            <div className="space-y-8">
              <div>
                <h3 className="text-base font-medium text-gray-700 mb-3">Tone & Voice</h3>
                <div className="flex flex-wrap gap-2">
                  {summaryResult.tone.map((toneItem, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1 capitalize">
                      {toneItem}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-medium text-gray-700 mb-3">Creative Direction</h3>
                <p className="text-gray-800 leading-relaxed bg-slate-50 p-3 rounded-md border border-slate-100">
                  {summaryResult.direction}
                </p>
              </div>
              
              <div>
                <h3 className="text-base font-medium text-gray-700 mb-3">Project Priorities</h3>
                <div className="space-y-2">
                  {summaryResult.priorities.map((priority, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-50">
                      <div className="flex-shrink-0 bg-purple-100 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center">
                        {index + 1}
                      </div>
                      <p className="text-gray-800">{priority}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="copy" className="pt-4">
          <CardContent>
            <div className="space-y-8">
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-100">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-base font-medium text-gray-700">Headline</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleCopy(summaryResult.draftCopy.header, "Headline")}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    Copy
                  </Button>
                </div>
                <p className="text-2xl font-bold text-gray-800 leading-tight">
                  {summaryResult.draftCopy.header}
                </p>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-100">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-base font-medium text-gray-700">Supporting Text</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleCopy(summaryResult.draftCopy.subtext, "Supporting Text")}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    Copy
                  </Button>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {summaryResult.draftCopy.subtext}
                </p>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-6 border border-slate-100">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-base font-medium text-gray-700">Call to Action</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleCopy(summaryResult.draftCopy.cta, "CTA")}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    Copy
                  </Button>
                </div>
                <div className="flex justify-center mt-4">
                  <Button className="px-8 py-2.5 shadow-sm">
                    {summaryResult.draftCopy.cta}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="bg-gray-50 p-4 text-sm text-gray-500 italic">
        This content is provided as a starting point for your project. Feel free to adapt it to your needs.
      </CardFooter>
    </Card>
  );
};

export default AISummaryResult;
