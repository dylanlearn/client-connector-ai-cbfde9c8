
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { VariantForm } from "./VariantForm";

interface VariantsListProps {
  variants: Array<{
    name: string;
    promptText: string;
    systemPrompt: string;
    isControl: boolean;
    weight: number;
  }>;
  onAddVariant: () => void;
  onUpdateVariant: (index: number, field: string, value: any) => void;
  onRemoveVariant: (index: number) => void;
}

export const VariantsList = ({
  variants,
  onAddVariant,
  onUpdateVariant,
  onRemoveVariant
}: VariantsListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Prompt Variants</h3>
        <Button 
          onClick={onAddVariant} 
          variant="outline" 
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Variant
        </Button>
      </div>
      
      {variants.map((variant, index) => (
        <VariantForm 
          key={index}
          variant={variant}
          index={index}
          onUpdateVariant={onUpdateVariant}
          onRemoveVariant={onRemoveVariant}
          totalVariants={variants.length}
        />
      ))}
    </div>
  );
};
