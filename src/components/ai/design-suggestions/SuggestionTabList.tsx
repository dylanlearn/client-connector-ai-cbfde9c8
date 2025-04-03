
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParsedSuggestion } from "./types";

interface SuggestionTabListProps {
  parsedSuggestion: ParsedSuggestion | null;
}

const SuggestionTabList = ({ parsedSuggestion }: SuggestionTabListProps) => {
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
    <TabsList className="w-full justify-start mb-4">
      {availableTabs.map(tab => (
        <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
      ))}
    </TabsList>
  );
};

export default SuggestionTabList;
