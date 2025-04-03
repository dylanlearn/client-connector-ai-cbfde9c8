
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
      
      // Save to component_library table
      const { error } = await supabase
        .from('component_library')
        .insert({
          name,
          description,
          component_type: 'design_suggestion',
          component_code: componentText,
          created_by: user.id,
          is_public: false,
          tags: ['ai_generated']
        });

      if (error) throw error;

      toast({
        title: "Component saved",
        description: `${name} has been saved to your component library.`,
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
