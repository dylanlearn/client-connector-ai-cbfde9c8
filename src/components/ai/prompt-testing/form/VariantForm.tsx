
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Trash } from "lucide-react";

interface VariantFormProps {
  variant: {
    name: string;
    promptText: string;
    systemPrompt: string;
    isControl: boolean;
    weight: number;
  };
  index: number;
  onUpdateVariant: (index: number, field: string, value: any) => void;
  onRemoveVariant: (index: number) => void;
  totalVariants: number;
}

export const VariantForm = ({ 
  variant, 
  index, 
  onUpdateVariant, 
  onRemoveVariant, 
  totalVariants 
}: VariantFormProps) => {
  return (
    <Card key={index} className="border-2 border-dashed">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Input 
              value={variant.name}
              onChange={(e) => onUpdateVariant(index, 'name', e.target.value)}
              className="max-w-[200px] font-semibold"
            />
            {variant.isControl && (
              <Badge className="ml-2" variant="outline">Control</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor={`is-control-${index}`} className="text-xs">Control</Label>
              <Switch 
                id={`is-control-${index}`}
                checked={variant.isControl}
                onCheckedChange={(checked) => {
                  if (checked) {
                    // Reset all other variants to non-control
                    for (let i = 0; i < totalVariants; i++) {
                      if (i !== index) {
                        onUpdateVariant(i, 'isControl', false);
                      }
                    }
                    onUpdateVariant(index, 'isControl', true);
                  } else {
                    onUpdateVariant(index, 'isControl', false);
                  }
                }}
                disabled={variant.isControl && totalVariants > 1}
              />
            </div>
            <Button 
              variant="destructive" 
              size="icon" 
              onClick={() => onRemoveVariant(index)}
              disabled={totalVariants <= 2}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`prompt-text-${index}`}>Prompt Text</Label>
            <Textarea 
              id={`prompt-text-${index}`}
              value={variant.promptText}
              onChange={(e) => onUpdateVariant(index, 'promptText', e.target.value)}
              placeholder="Enter the prompt text for this variant"
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Use &#123;&#123;type&#125;&#125;, &#123;&#123;tone&#125;&#125;, &#123;&#123;context&#125;&#125;, &#123;&#123;keywords&#125;&#125;, and &#123;&#123;maxLength&#125;&#125; as placeholders.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`system-prompt-${index}`}>System Prompt (Optional)</Label>
            <Textarea 
              id={`system-prompt-${index}`}
              value={variant.systemPrompt}
              onChange={(e) => onUpdateVariant(index, 'systemPrompt', e.target.value)}
              placeholder="Enter the system prompt for this variant"
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`weight-${index}`}>Weight: {variant.weight}</Label>
            <input
              id={`weight-${index}`}
              type="range"
              min="1"
              max="10"
              value={variant.weight}
              onChange={(e) => onUpdateVariant(index, 'weight', parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Higher weights increase the frequency this variant is tested.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
