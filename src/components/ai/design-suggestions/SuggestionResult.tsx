
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseSuggestionText } from "./utils/suggestionParser";
import { ParsedSuggestion } from "./types";
import ColorPalette from "./ColorPalette";
import TypographyDisplay from "./TypographyDisplay";
import LayoutSuggestions from "./LayoutSuggestions";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formatSuggestionContent = (text: string) => {
  if (!text) return "";
  
  // Replace ### with bullet points
  let formattedText = text.replace(/###\s?/g, "• ");
  
  // Convert headers to bold with larger text
  formattedText = formattedText.replace(
    /^(#+)\s+(.+)$/gm, 
    (_, hashes, content) => {
      // Determine heading level (h1, h2, etc.)
      const level = hashes.length;
      const fontSize = level === 1 ? "text-xl font-bold" : "text-lg font-semibold";
      return `<div class="${fontSize} my-3">${content}</div>`;
    }
  );
  
  // Convert newlines to <br> tags
  formattedText = formattedText.replace(/\n\n/g, '<br><br>');
  
  return formattedText;
};

interface SuggestionResultProps {
  suggestions: string | null;
}

const SuggestionResult = ({ suggestions }: SuggestionResultProps) => {
  const [parsedSuggestion, setParsedSuggestion] = useState<ParsedSuggestion | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (suggestions) {
      try {
        const parsed = parseSuggestionText(suggestions);
        setParsedSuggestion(parsed);
        setParseError(null);
      } catch (error) {
        console.error("Error parsing suggestion:", error);
        setParseError("Unable to parse the AI suggestions. You can still view the raw text.");
      }
    } else {
      setParsedSuggestion(null);
      setParseError(null);
    }
  }, [suggestions]);

  if (!suggestions) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Design Suggestions</h3>
      
      {parseError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{parseError}</AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start mb-4">
          <TabsTrigger value="all">All Suggestions</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          <Card className="p-4 whitespace-pre-wrap">
            {parsedSuggestion ? (
              <div dangerouslySetInnerHTML={{ __html: formatSuggestionContent(suggestions) }} />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: formatSuggestionContent(suggestions) }} />
            )}
          </Card>
          
          {parsedSuggestion && (
            <>
              {parsedSuggestion.colors.length > 0 && (
                <ColorPalette colors={parsedSuggestion.colors} />
              )}
              
              {parsedSuggestion.typography.length > 0 && (
                <TypographyDisplay typography={parsedSuggestion.typography} />
              )}
              
              {parsedSuggestion.layouts.length > 0 && (
                <LayoutSuggestions layouts={parsedSuggestion.layouts} />
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="colors">
          {parsedSuggestion && parsedSuggestion.colors.length > 0 ? (
            <ColorPalette colors={parsedSuggestion.colors} />
          ) : (
            <Card className="p-4 text-center text-muted-foreground">
              No specific color suggestions found.
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="typography">
          {parsedSuggestion && parsedSuggestion.typography.length > 0 ? (
            <TypographyDisplay typography={parsedSuggestion.typography} />
          ) : (
            <Card className="p-4 text-center text-muted-foreground">
              No specific typography suggestions found.
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="layout">
          {parsedSuggestion && parsedSuggestion.layouts.length > 0 ? (
            <LayoutSuggestions layouts={parsedSuggestion.layouts} />
          ) : (
            <Card className="p-4 text-center text-muted-foreground">
              No specific layout suggestions found.
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuggestionResult;
