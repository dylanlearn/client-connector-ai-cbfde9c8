
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout, FileImage, Code } from "lucide-react";

interface ComponentSuggestionsProps {
  components: string[];
}

const ComponentSuggestions: React.FC<ComponentSuggestionsProps> = ({ components }) => {
  if (!components || components.length === 0) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        No component suggestions available.
      </Card>
    );
  }

  // Helper function to extract component name and description
  const parseComponentText = (text: string): { name: string; description: string } => {
    if (text.includes(':')) {
      const [name, description] = text.split(':', 2).map(part => part.trim());
      return { name, description };
    }
    return { 
      name: `Component ${Math.floor(Math.random() * 1000)}`,
      description: text 
    };
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Code className="h-5 w-5 mr-2" />
          Suggested Components
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {components.map((component, index) => {
            const { name, description } = parseComponentText(component);
            return (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Layout className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{name}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComponentSuggestions;
