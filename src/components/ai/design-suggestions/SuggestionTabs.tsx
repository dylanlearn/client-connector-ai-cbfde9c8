
import { TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ParsedSuggestion } from "./types";
import ColorPalette from "./ColorPalette";
import TypographyDisplay from "./TypographyDisplay";
import LayoutSuggestions from "./LayoutSuggestions";
import ComponentSuggestions from "./ComponentSuggestions";
import SuggestionRawText from "./SuggestionRawText";

interface SuggestionTabsProps {
  activeTab: string;
  parsedSuggestion: ParsedSuggestion | null;
  rawSuggestions: string;
  saveComponentToLibrary: (component: string) => Promise<void>;
}

const SuggestionTabs = ({
  activeTab,
  parsedSuggestion,
  rawSuggestions,
  saveComponentToLibrary
}: SuggestionTabsProps) => {
  const hasColors = parsedSuggestion?.colors && parsedSuggestion.colors.length > 0;
  const hasTypography = parsedSuggestion?.typography && parsedSuggestion.typography.length > 0;
  const hasLayouts = parsedSuggestion?.layouts && parsedSuggestion.layouts.length > 0;
  const hasComponents = parsedSuggestion?.components && parsedSuggestion.components.length > 0;

  return (
    <>
      <TabsContent value="all" className="space-y-6">
        <SuggestionRawText text={rawSuggestions} />
        
        {parsedSuggestion && (
          <>
            {hasColors && <ColorPalette colors={parsedSuggestion.colors} />}
            {hasTypography && <TypographyDisplay typography={parsedSuggestion.typography} />}
            {hasLayouts && <LayoutSuggestions layouts={parsedSuggestion.layouts} />}
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
    </>
  );
};

export default SuggestionTabs;
