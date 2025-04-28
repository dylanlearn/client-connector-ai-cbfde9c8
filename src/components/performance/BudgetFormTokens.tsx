
import React, { useEffect, useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaintBucket } from "lucide-react";
import { DesignSystemService, DesignToken } from '@/services/design-system/design-system-service';
import { UseFormReturn } from 'react-hook-form';
import { BudgetFormData } from './BudgetForm';

interface BudgetFormTokensProps {
  projectId: string;
  form: UseFormReturn<BudgetFormData>;
}

export function BudgetFormTokens({ projectId, form }: BudgetFormTokensProps) {
  const [tokens, setTokens] = useState<DesignToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (projectId) {
      loadTokens();
    }
  }, [projectId]);
  
  const loadTokens = async () => {
    setIsLoading(true);
    try {
      const data = await DesignSystemService.getDesignTokens(projectId);
      setTokens(data);
    } catch (error) {
      console.error('Error fetching design tokens:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const colorTokens = tokens.filter(t => t.category === 'color');
  
  if (colorTokens.length === 0) {
    return null;
  }
  
  return (
    <FormField
      control={form.control}
      name="color_token"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Design Token (Optional)</FormLabel>
          <FormControl>
            <Select
              disabled={isLoading}
              onValueChange={field.onChange}
              value={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select color token" />
              </SelectTrigger>
              <SelectContent>
                {colorTokens.map(token => (
                  <SelectItem key={token.id} value={token.id}>
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ 
                          backgroundColor: typeof token.value === 'string' ? token.value : undefined
                        }}
                      />
                      {token.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
