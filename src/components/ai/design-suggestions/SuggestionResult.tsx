
import { FC, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Palette, Type, Layout, BookOpen, FileImage } from "lucide-react";
import { parseSuggestions } from "./utils/suggestionParser";
import { ParsedSuggestion } from "./types";
import ColorPalette from "./ColorPalette";
import TypographyDisplay from "./TypographyDisplay";
import LayoutSuggestions from "./LayoutSuggestions";
import InspirationImages from "./InspirationImages";

interface SuggestionResultProps {
  suggestions: string | null;
}

const SuggestionResult: FC<SuggestionResultProps> = ({ suggestions }) => {
  const [parsedSuggestions, setParsedSuggestions] = useState<ParsedSuggestion | null>(null);

  useEffect(() => {
    if (suggestions) {
      setParsedSuggestions(parseSuggestions(suggestions));
    } else {
      setParsedSuggestions(null);
    }
  }, [suggestions]);

  if (!suggestions || !parsedSuggestions) return null;

  return (
    <div className="mt-6 space-y-6">
      <h3 className="text-xl font-medium">Design Suggestions</h3>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">All</span>
          </TabsTrigger>
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Colors</span>
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            <span className="hidden sm:inline">Typography</span>
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            <span className="hidden sm:inline">Layout</span>
          </TabsTrigger>
          <TabsTrigger value="inspiration" className="flex items-center gap-2">
            <FileImage className="h-4 w-4" />
            <span className="hidden sm:inline">Inspiration</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <ColorPalette colors={parsedSuggestions.colors} />
              <TypographyDisplay typography={parsedSuggestions.typography} />
              <LayoutSuggestions layouts={parsedSuggestions.layouts} />
              <InspirationImages components={parsedSuggestions.components} />
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Original AI Suggestions</h3>
                <div className="bg-muted p-4 rounded-md whitespace-pre-line">
                  {parsedSuggestions.originalText}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="colors">
          <Card>
            <CardContent className="pt-6">
              <ColorPalette colors={parsedSuggestions.colors} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="typography">
          <Card>
            <CardContent className="pt-6">
              <TypographyDisplay typography={parsedSuggestions.typography} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="layout">
          <Card>
            <CardContent className="pt-6">
              <LayoutSuggestions layouts={parsedSuggestions.layouts} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inspiration">
          <Card>
            <CardContent className="pt-6">
              <InspirationImages components={parsedSuggestions.components} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuggestionResult;
