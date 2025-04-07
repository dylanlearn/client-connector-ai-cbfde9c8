
import { TabsContent } from "@/components/ui/tabs";
import { ParsedSuggestion } from "./types";
import SuggestionCategory from "./SuggestionCategory";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SuggestionTabsProps {
  activeTab: string;
  parsedSuggestion: ParsedSuggestion | null;
  rawSuggestions: string;
  saveComponentToLibrary: (componentText: string) => Promise<void>;
}

const SuggestionTabs = ({ 
  activeTab, 
  parsedSuggestion, 
  rawSuggestions,
  saveComponentToLibrary 
}: SuggestionTabsProps) => {
  return (
    <>
      <TabsContent value="all">
        {parsedSuggestion ? (
          <div className="space-y-8">
            {parsedSuggestion.colors && parsedSuggestion.colors.length > 0 && (
              <SuggestionCategory 
                title="Color Palette" 
                suggestions={parsedSuggestion.colors} 
                type="colors"
                onSave={saveComponentToLibrary}
              />
            )}
            
            {parsedSuggestion.typography && parsedSuggestion.typography.length > 0 && (
              <SuggestionCategory 
                title="Typography" 
                suggestions={parsedSuggestion.typography} 
                type="typography"
                onSave={saveComponentToLibrary}
              />
            )}
            
            {parsedSuggestion.layouts && parsedSuggestion.layouts.length > 0 && (
              <SuggestionCategory 
                title="Layout Structure" 
                suggestions={parsedSuggestion.layouts} 
                type="layout"
                onSave={saveComponentToLibrary}
              />
            )}
            
            {parsedSuggestion.components && parsedSuggestion.components.length > 0 && (
              <SuggestionCategory 
                title="Components" 
                suggestions={parsedSuggestion.components} 
                type="components"
                onSave={saveComponentToLibrary}
              />
            )}
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No suggestion data available</AlertDescription>
          </Alert>
        )}
      </TabsContent>
      
      <TabsContent value="colors">
        {parsedSuggestion && parsedSuggestion.colors && parsedSuggestion.colors.length > 0 ? (
          <SuggestionCategory 
            title="Color Palette" 
            suggestions={parsedSuggestion.colors} 
            type="colors"
            onSave={saveComponentToLibrary}
          />
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No color suggestions available</AlertDescription>
          </Alert>
        )}
      </TabsContent>
      
      <TabsContent value="typography">
        {parsedSuggestion && parsedSuggestion.typography && parsedSuggestion.typography.length > 0 ? (
          <SuggestionCategory 
            title="Typography" 
            suggestions={parsedSuggestion.typography} 
            type="typography"
            onSave={saveComponentToLibrary}
          />
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No typography suggestions available</AlertDescription>
          </Alert>
        )}
      </TabsContent>
      
      <TabsContent value="layout">
        {parsedSuggestion && parsedSuggestion.layouts && parsedSuggestion.layouts.length > 0 ? (
          <SuggestionCategory 
            title="Layout Structure" 
            suggestions={parsedSuggestion.layouts} 
            type="layout"
            onSave={saveComponentToLibrary}
          />
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No layout suggestions available</AlertDescription>
          </Alert>
        )}
      </TabsContent>
      
      <TabsContent value="components">
        {parsedSuggestion && parsedSuggestion.components && parsedSuggestion.components.length > 0 ? (
          <SuggestionCategory 
            title="Components" 
            suggestions={parsedSuggestion.components} 
            type="components"
            onSave={saveComponentToLibrary}
          />
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No component suggestions available</AlertDescription>
          </Alert>
        )}
      </TabsContent>
      
      <TabsContent value="raw">
        <div className="p-4 bg-muted rounded-md">
          <pre className="whitespace-pre-wrap text-sm">{rawSuggestions}</pre>
        </div>
      </TabsContent>
    </>
  );
};

export default SuggestionTabs;
