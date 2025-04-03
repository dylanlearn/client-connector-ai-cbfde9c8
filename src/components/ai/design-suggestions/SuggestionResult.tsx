
import { useState, useEffect } from "react";
import { Tabs } from "@/components/ui/tabs";
import { parseSuggestionText } from "./utils/suggestionParser";
import { ParsedSuggestion } from "./types";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import SuggestionTabList from "./SuggestionTabList";
import SuggestionTabs from "./SuggestionTabs";

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

  // Save suggestion to database (simulated for now)
  const saveSuggestionToDatabase = async () => {
    if (!user || !suggestions || !prompt) {
      return;
    }

    setIsSaving(true);
    try {
      // Simulate successful saving by showing toast success
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
        <SuggestionTabList parsedSuggestion={parsedSuggestion} />
        
        <SuggestionTabs 
          activeTab={activeTab}
          parsedSuggestion={parsedSuggestion}
          rawSuggestions={suggestions}
          saveComponentToLibrary={saveComponentToLibrary}
        />
      </Tabs>
    </div>
  );
};

export default SuggestionResult;
