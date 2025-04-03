
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IntakeSummaryResult } from "@/services/ai/summary/intake-summary-service";
import { RefreshCw, Check, Copy, Palette, Zap, Type, LayoutPanelTop } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
      <CardHeader className="border-b border-zinc-800 pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            <CardTitle className="text-xl font-medium">{summaryResult.draftCopy.header}</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRegenerate}
            disabled={isLoading}
            className="text-sm bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
        <CardDescription className="text-zinc-400">
          Based on your intake form responses
        </CardDescription>
      </CardHeader>
      
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
          <CardContent>
            <div className="space-y-4">
              <div className="text-zinc-300 leading-relaxed">
                {summaryResult.summary
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
                  className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Text
                </Button>
              </div>
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="design" className="pt-6">
          <CardContent>
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="h-5 w-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold">Color Scheme</h3>
                </div>
                
                <ul className="space-y-6 pl-5">
                  <li className="list-disc list-outside">
                    <div>
                      <p className="font-medium">Primary Color:</p>
                      <div className="flex items-center gap-2 mt-1 mb-1">
                        <div className="w-4 h-4 rounded-full bg-indigo-600"></div>
                        <span className="text-zinc-300">{summaryResult.tone[0] === 'professional' ? 'Deep Navy Blue' : 'Charcoal Gray'}</span>
                      </div>
                      <div className="border-l-2 border-zinc-700 pl-4 ml-1 mt-2">
                        <p className="text-zinc-400 italic">
                          Represents professionalism, reliability, and strength. Forms a strong backdrop for accents.
                        </p>
                      </div>
                    </div>
                  </li>
                  
                  <li className="list-disc list-outside">
                    <div>
                      <p className="font-medium">Accent Color:</p>
                      <div className="flex items-center gap-2 mt-1 mb-1">
                        <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                        <span className="text-zinc-300">Bright {summaryResult.tone.includes('bold') ? 'Electric Orange' : 'Yellow'}</span>
                      </div>
                      <div className="border-l-2 border-zinc-700 pl-4 ml-1 mt-2">
                        <p className="text-zinc-400 italic">
                          Used for buttons, highlights, and CTAs. Adds energy and visibility against the dark base.
                        </p>
                      </div>
                    </div>
                  </li>
                  
                  <li className="list-disc list-outside">
                    <div>
                      <p className="font-medium">Text Color:</p>
                      <div className="flex items-center gap-2 mt-1 mb-1">
                        <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                        <span className="text-zinc-300">Light Gray or White</span>
                      </div>
                      <div className="border-l-2 border-zinc-700 pl-4 ml-1 mt-2">
                        <p className="text-zinc-400 italic">
                          Ensures excellent readability while maintaining a sleek, modern look.
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="border-t border-zinc-800 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Type className="h-5 w-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold">Font Choices</h3>
                </div>
                
                <ul className="space-y-6 pl-5">
                  <li className="list-disc list-outside">
                    <div>
                      <p className="font-medium">Headings:</p>
                      <p className="text-zinc-300 mt-1 mb-1">Use Montserrat or Poppins</p>
                      <div className="border-l-2 border-zinc-700 pl-4 ml-1 mt-2">
                        <p className="text-zinc-400 italic">
                          Bold, sans-serif fonts for strong visual hierarchy and a clean modern edge.
                        </p>
                      </div>
                    </div>
                  </li>
                  
                  <li className="list-disc list-outside">
                    <div>
                      <p className="font-medium">Body Text:</p>
                      <p className="text-zinc-300 mt-1 mb-1">Use Open Sans or Roboto</p>
                      <div className="border-l-2 border-zinc-700 pl-4 ml-1 mt-2">
                        <p className="text-zinc-400 italic">
                          Clean and easy to read, enhancing accessibility and professionalism.
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="content" className="pt-6">
          <CardContent>
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <LayoutPanelTop className="h-5 w-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold">Layout & Design Elements</h3>
                </div>
                
                <div className="mt-4 space-y-6">
                  <div>
                    <p className="text-lg font-medium mb-2">1. Hero Section</p>
                    <ul className="space-y-3 pl-5">
                      <li className="list-disc list-outside">
                        <p className="text-zinc-300">Full-width background image showcasing your work.</p>
                      </li>
                      <li className="list-disc list-outside">
                        <p className="text-zinc-300">Dark-to-transparent gradient overlay to improve text visibility.</p>
                      </li>
                      <li className="list-disc list-outside">
                        <div>
                          <p className="text-zinc-300">Bold headline:</p>
                          <div className="border-l-2 border-zinc-700 pl-4 ml-1 mt-2">
                            <p className="text-zinc-400 italic">Example: "{summaryResult.draftCopy.header}"</p>
                          </div>
                        </div>
                      </li>
                      <li className="list-disc list-outside">
                        <div>
                          <p className="text-zinc-300">CTA Button in the accent color:</p>
                          <div className="border-l-2 border-zinc-700 pl-4 ml-1 mt-2">
                            <p className="text-zinc-400 italic">Example: "{summaryResult.draftCopy.cta}"</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <p className="text-lg font-medium mb-2">2. Supporting Content</p>
                    <div className="pl-5">
                      <div className="border-l-2 border-zinc-700 pl-4 mt-2">
                        <p className="text-zinc-400">
                          {summaryResult.draftCopy.subtext}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="bg-zinc-900 p-4 text-sm text-zinc-500 italic border-t border-zinc-800">
        This design brief is based on your inputs and can be customized to match your specific needs.
      </CardFooter>
    </Card>
  );
};

export default AISummaryResult;
