
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout, FileImage, Code, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { ComponentLibraryItem } from "./types";

interface ComponentSuggestionsProps {
  components: string[];
  onSaveToLibrary?: (component: string) => Promise<void>;
}

const ComponentSuggestions: React.FC<ComponentSuggestionsProps> = ({ 
  components,
  onSaveToLibrary
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
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

  // Handle saving a component to the component library
  const handleSaveComponent = async (componentText: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save components to your library.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { name, description } = parseComponentText(componentText);
      
      // Since we're not directly using the database, we'll create a mock save
      toast({
        title: "Component saved",
        description: `${name} has been saved (simulation mode).`,
      });
      
      // Call optional callback if provided
      if (onSaveToLibrary) {
        await onSaveToLibrary(componentText);
      }
    } catch (error) {
      console.error("Error saving component:", error);
      toast({
        title: "Failed to save component",
        description: "An unexpected error occurred while saving the component.",
        variant: "destructive",
      });
    }
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
                  <div className="flex-1">
                    <p className="font-medium">{name}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                  {user && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => handleSaveComponent(component)}
                    >
                      <Plus className="h-3 w-3" />
                      Save
                    </Button>
                  )}
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
