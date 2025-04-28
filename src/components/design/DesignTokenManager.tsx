
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaintBucket, Type, ArrowsHorizontal, Plus, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { DesignSystemService, DesignToken } from '@/services/design-system/design-system-service';
import { supabase } from '@/integrations/supabase/client';

interface DesignTokenManagerProps {
  projectId: string;
}

export function DesignTokenManager({ projectId }: DesignTokenManagerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [tokens, setTokens] = useState<DesignToken[]>([]);
  const [activeCategory, setActiveCategory] = useState('color');
  const { toast } = useToast();

  useEffect(() => {
    if (projectId) {
      loadTokens();
    }
  }, [projectId]);

  const loadTokens = async () => {
    try {
      setIsLoading(true);
      const data = await DesignSystemService.getDesignTokens(projectId);
      setTokens(data);
    } catch (error) {
      console.error('Error loading design tokens:', error);
      toast({
        title: "Error",
        description: "Failed to load design tokens",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToken = async (token: Partial<DesignToken>) => {
    try {
      const { data, error } = await supabase
        .from('design_tokens')
        .insert([
          {
            project_id: projectId,
            name: token.name,
            category: token.category,
            value: token.value,
            description: token.description || ''
          }
        ])
        .select();
      
      if (error) throw error;
      
      setTokens([...tokens, data[0]]);
      
      toast({
        title: "Success",
        description: "Design token added successfully"
      });
    } catch (error) {
      console.error('Error adding design token:', error);
      toast({
        title: "Error",
        description: "Failed to add design token",
        variant: "destructive"
      });
    }
  };
  
  const filterTokensByCategory = (category: string) => {
    return tokens.filter(token => token.category === category);
  };

  const colorTokens = filterTokensByCategory('color');
  const typographyTokens = filterTokensByCategory('typography');
  const spacingTokens = filterTokensByCategory('spacing');

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <PaintBucket className="h-5 w-5 mr-2" />
          Design Token Manager
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="color">
              <PaintBucket className="h-4 w-4 mr-2" /> Colors
            </TabsTrigger>
            <TabsTrigger value="typography">
              <Type className="h-4 w-4 mr-2" /> Typography
            </TabsTrigger>
            <TabsTrigger value="spacing">
              <ArrowsHorizontal className="h-4 w-4 mr-2" /> Spacing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="color" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {colorTokens.map(token => (
                <div key={token.id} className="p-4 border rounded-md">
                  <div 
                    className="h-16 rounded-md mb-2" 
                    style={{ backgroundColor: token.value as string }}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{token.name}</span>
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <code className="text-xs">{token.value}</code>
                </div>
              ))}
              
              <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 border border-dashed">
                <Plus className="h-8 w-8 mb-2 text-muted-foreground" />
                <span className="text-sm">Add Color Token</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="typography" className="space-y-4 mt-4">
            <div className="space-y-4">
              {typographyTokens.map(token => (
                <div key={token.id} className="p-4 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{token.name}</span>
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="mb-2" style={{ 
                    fontFamily: (token.value as any)?.fontFamily,
                    fontSize: (token.value as any)?.fontSize,
                    fontWeight: (token.value as any)?.fontWeight,
                    lineHeight: (token.value as any)?.lineHeight
                  }}>
                    Typography Example
                  </div>
                  <div className="bg-muted p-2 rounded-md overflow-x-auto">
                    <code className="text-xs block">
                      {typeof token.value === 'object' 
                        ? JSON.stringify(token.value, null, 2) 
                        : token.value
                      }
                    </code>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full flex items-center justify-center py-6">
                <Plus className="h-4 w-4 mr-2" />
                <span>Add Typography Token</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="spacing" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {spacingTokens.map(token => (
                <div key={token.id} className="p-4 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{token.name}</span>
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="border border-primary bg-primary/10 rounded-md" style={{ 
                    height: typeof token.value === 'string' ? token.value : '16px'
                  }}></div>
                  <div className="mt-2">
                    <code className="text-xs">{token.value}</code>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 border border-dashed">
                <Plus className="h-8 w-8 mb-2 text-muted-foreground" />
                <span className="text-sm">Add Spacing Token</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
