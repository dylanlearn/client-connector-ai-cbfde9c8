
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseSuggestionText } from "./utils/suggestionParser";
import { ParsedSuggestion } from "./types";
import ColorPalette from "./ColorPalette";
import TypographyDisplay from "./TypographyDisplay";
import LayoutSuggestions from "./LayoutSuggestions";
import ComponentSuggestions from "./ComponentSuggestions";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/use-toast";

/**
 * Format AI suggestion content for better readability
 */
const formatSuggestionContent = (text: string): string => {
  if (!text) return "";
  
  // Replace markdown-style headers with styled HTML
  let formattedText = text;
  
  // Replace ### headers with bullet points
  formattedText = formattedText.replace(/###\s?/g, "• ");
  
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
  
  // Preserve bullet points
  formattedText = formattedText.replace(
    /^[-*]\s+(.+)$/gm,
    (_, content) => `<div class="flex"><span class="mr-2">•</span><span>${content}</span></div>`
  );
  
  // Convert double newlines to <br> tags for better spacing
  formattedText = formattedText.replace(/\n\n/g, '<br><br>');
  
  // Convert remaining single newlines to <br> tags
  formattedText = formattedText.replace(/\n/g, '<br>');
  
  return formattedText;
};

interface SuggestionResultProps {
  suggestions: string | null;
  prompt?: string;
}

const SuggestionResult: React.FC<SuggestionResultProps> = ({ suggestions, prompt }) => {
  const [parsedSuggestion, setParsedSuggestion] = useState<ParsedSuggestion | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isParsingComplete, setIsParsingComplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (suggestions) {
      try {
        const parsed = parseSuggestionText(suggestions);
        setParsedSuggestion(parsed);
        setParseError(null);
      } catch (error) {
        console.error("Error parsing suggestion:", error);
        setParseError("Unable to parse the AI suggestions. You can still view the raw text.");
      } finally {
        setIsParsingComplete(true);
      }
    } else {
      setParsedSuggestion(null);
      setParseError(null);
      setIsParsingComplete(false);
    }
  }, [suggestions]);

  // Save suggestion to database
  const saveSuggestionToDatabase = async () => {
    if (!user || !suggestions || !prompt) {
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('design_suggestions')
        .insert({
          user_id: user.id,
          prompt: prompt,
          result: suggestions,
          colors: parsedSuggestion?.colors || null,
          typography: parsedSuggestion?.typography || null,
          layouts: parsedSuggestion?.layouts || null,
          components: parsedSuggestion?.components || null
        });

      if (error) throw error;

      toast({
        title: "Suggestion saved",
        description: "Your design suggestion has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving suggestion:", error);
      toast({
        title: "Failed to save",
        description: "There was an error saving your design suggestion.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Save a component to the component library
  const saveComponentToLibrary = async (componentText: string) => {
    // This functionality is now handled in the ComponentSuggestions component
    return Promise.resolve();
  };

  if (!suggestions) {
    return null;
  }

  const hasColors = parsedSuggestion?.colors && parsedSuggestion.colors.length > 0;
  const hasTypography = parsedSuggestion?.typography && parsedSuggestion.typography.length > 0;
  const hasLayouts = parsedSuggestion?.layouts && parsedSuggestion.layouts.length > 0;
  const hasComponents = parsedSuggestion?.components && parsedSuggestion.components.length > 0;
  
  // Create dynamic tabs based on available content
  const availableTabs = [
    { id: "all", label: "All Suggestions", available: true },
    { id: "colors", label: "Colors", available: hasColors },
    { id: "typography", label: "Typography", available: hasTypography },
    { id: "layout", label: "Layout", available: hasLayouts },
    { id: "components", label: "Components", available: hasComponents }
  ].filter(tab => tab.available);

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
          {availableTabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          <Card className="p-4 whitespace-pre-wrap">
            <div dangerouslySetInnerHTML={{ __html: formatSuggestionContent(suggestions) }} />
          </Card>
          
          {parsedSuggestion && (
            <>
              {hasColors && (
                <ColorPalette colors={parsedSuggestion.colors} />
              )}
              
              {hasTypography && (
                <TypographyDisplay typography={parsedSuggestion.typography} />
              )}
              
              {hasLayouts && (
                <LayoutSuggestions layouts={parsedSuggestion.layouts} />
              )}
              
              {hasComponents && (
                <ComponentSuggestions 
                  components={parsedSuggestion.components}
                  onSaveToLibrary={saveComponentToLibrary}
                />
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="colors">
          {hasColors ? (
            <ColorPalette colors={parsedSuggestion!.colors} />
          ) : (
            <Card className="p-4 text-center text-muted-foreground">
              No specific color suggestions found.
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="typography">
          {hasTypography ? (
            <TypographyDisplay typography={parsedSuggestion!.typography} />
          ) : (
            <Card className="p-4 text-center text-muted-foreground">
              No specific typography suggestions found.
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="layout">
          {hasLayouts ? (
            <LayoutSuggestions layouts={parsedSuggestion!.layouts} />
          ) : (
            <Card className="p-4 text-center text-muted-foreground">
              No specific layout suggestions found.
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="components">
          {hasComponents ? (
            <ComponentSuggestions 
              components={parsedSuggestion!.components}
              onSaveToLibrary={saveComponentToLibrary}
            />
          ) : (
            <Card className="p-4 text-center text-muted-foreground">
              No specific component suggestions found.
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuggestionResult;
