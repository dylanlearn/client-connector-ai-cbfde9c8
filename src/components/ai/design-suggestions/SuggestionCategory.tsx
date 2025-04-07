
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SuggestionCategoryProps {
  title: string;
  suggestions: string[] | any[];
  type: "colors" | "typography" | "layout" | "components";
  onSave?: (componentText: string) => Promise<void>;
}

const SuggestionCategory = ({ title, suggestions, type, onSave }: SuggestionCategoryProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState<number | null>(null);
  const { toast } = useToast();
  
  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    
    toast({
      title: "Copied to clipboard",
      description: "The suggestion has been copied to clipboard",
    });
    
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };
  
  const handleSave = async (text: string, index: number) => {
    if (!onSave) return;
    
    setSaving(index);
    try {
      await onSave(text);
      toast({
        title: "Saved to library",
        description: "The component has been saved to your library",
      });
    } catch (error) {
      toast({
        title: "Failed to save",
        description: error.message || "An error occurred while saving",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };
  
  const renderSuggestion = (suggestion: any, index: number) => {
    const suggestionText = typeof suggestion === 'string' ? suggestion : JSON.stringify(suggestion, null, 2);
    
    return (
      <div key={index} className="relative p-4 border rounded-md bg-card">
        <pre className="whitespace-pre-wrap text-sm">{suggestionText}</pre>
        
        <div className="absolute top-2 right-2 flex gap-1">
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0" 
            onClick={() => handleCopy(suggestionText, index)}
          >
            {copiedIndex === index ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          
          {onSave && type === 'components' && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0"
              onClick={() => handleSave(suggestionText, index)}
              disabled={saving === index}
            >
              <Save className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => renderSuggestion(suggestion, index))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SuggestionCategory;
