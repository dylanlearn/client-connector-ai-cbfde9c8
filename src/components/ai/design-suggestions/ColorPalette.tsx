
import React from "react";
import { ParsedColor } from "./types";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface ColorPaletteProps {
  colors: ParsedColor[];
}

const ColorPalette = ({ colors }: ColorPaletteProps) => {
  const { toast } = useToast();
  
  if (!colors || colors.length === 0) {
    return null;
  }
  
  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    toast({
      title: "Color copied",
      description: `${hex} has been copied to your clipboard.`
    });
  };
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-2">Color Palette</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {colors.map((color, index) => (
          <div 
            key={index} 
            className="bg-white border rounded-md overflow-hidden shadow-sm"
          >
            <div 
              className="h-20 w-full" 
              style={{ backgroundColor: color.hex }}
            />
            <div className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-sm">{color.name}</h4>
                  <p className="text-sm text-muted-foreground">{color.hex}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => copyHex(color.hex)}
                >
                  <Copy size={16} />
                </Button>
              </div>
              {color.description && (
                <p className="mt-1 text-xs text-muted-foreground truncate" title={color.description}>
                  {color.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;
