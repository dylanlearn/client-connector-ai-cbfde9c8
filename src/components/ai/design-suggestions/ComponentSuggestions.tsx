
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout, FileImage, Code } from "lucide-react";

interface ComponentSuggestionsProps {
  components: string[];
}

const ComponentSuggestions = ({ components }: ComponentSuggestionsProps) => {
  if (!components || components.length === 0) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        No component suggestions available.
      </Card>
    );
  }

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
          {components.map((component, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-md">
                  <Layout className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    {component.includes(':') 
                      ? component.split(':', 2)[0].trim() 
                      : `Component ${index + 1}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {component.includes(':') 
                      ? component.split(':', 2)[1].trim() 
                      : component}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComponentSuggestions;
