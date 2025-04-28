
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface DesignTokenManagerProps {
  wireframeId: string;
}

type TokenCategory = 'color' | 'typography' | 'spacing' | 'sizing' | 'shadow' | 'motion' | 'border' | 'opacity' | 'z-index' | 'other';

interface DesignToken {
  id: string;
  name: string;
  category: TokenCategory;
  value: any;
  description?: string;
}

export const DesignTokenManager: React.FC<DesignTokenManagerProps> = ({ wireframeId }) => {
  const queryClient = useQueryClient();
  const [tokenName, setTokenName] = useState('');
  const [tokenCategory, setTokenCategory] = useState<TokenCategory>('color');
  const [tokenValue, setTokenValue] = useState('');
  const [tokenDescription, setTokenDescription] = useState('');

  // Fetch design tokens
  const { data: tokens, isLoading } = useQuery({
    queryKey: ['design-tokens', wireframeId],
    queryFn: async () => {
      // In a real app, you would fetch tokens associated with the wireframe's project
      const { data, error } = await supabase
        .from('design_tokens')
        .select('*')
        .eq('project_id', 'project-1') // Placeholder, would get from context
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  // Add new token
  const { mutate: addToken, isPending: isAddingToken } = useMutation({
    mutationFn: async () => {
      // Parse the token value based on category
      let parsedValue;
      try {
        parsedValue = tokenCategory === 'color' ? tokenValue : JSON.parse(tokenValue);
      } catch (e) {
        parsedValue = tokenValue;
      }

      const { data, error } = await supabase
        .from('design_tokens')
        .insert({
          project_id: 'project-1', // Placeholder
          name: tokenName,
          category: tokenCategory,
          value: parsedValue,
          description: tokenDescription
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['design-tokens', wireframeId] });
      toast.success("Design token created");
      // Reset form
      setTokenName('');
      setTokenValue('');
      setTokenDescription('');
    },
    onError: (error) => {
      toast.error("Failed to create design token", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  });

  // Delete token
  const { mutate: deleteToken } = useMutation({
    mutationFn: async (tokenId: string) => {
      const { error } = await supabase
        .from('design_tokens')
        .delete()
        .eq('id', tokenId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['design-tokens', wireframeId] });
      toast.success("Design token deleted");
    },
    onError: (error) => {
      toast.error("Failed to delete design token", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  });

  // Token preview component
  const TokenPreview = ({ token }: { token: DesignToken }) => {
    if (token.category === 'color') {
      return (
        <div className="flex items-center gap-2">
          <div 
            className="h-5 w-5 rounded-full border"
            style={{ backgroundColor: token.value }}
          />
          <span>{token.value}</span>
        </div>
      );
    }

    return <span className="text-sm">{JSON.stringify(token.value)}</span>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Design Token Integration</CardTitle>
        <CardDescription>
          Manage design tokens for colors, typography, spacing and more
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="browse">
          <TabsList className="mb-4">
            <TabsTrigger value="browse">Browse Tokens</TabsTrigger>
            <TabsTrigger value="add">Add Token</TabsTrigger>
            <TabsTrigger value="apply">Apply Tokens</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            {isLoading ? (
              <div className="flex items-center justify-center p-6">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="space-y-4">
                {tokens && tokens.length > 0 ? (
                  Object.entries(
                    tokens.reduce((acc: any, token: DesignToken) => {
                      if (!acc[token.category]) acc[token.category] = [];
                      acc[token.category].push(token);
                      return acc;
                    }, {})
                  ).map(([category, categoryTokens]: [string, any]) => (
                    <div key={category} className="space-y-2">
                      <h3 className="text-lg font-medium capitalize">{category}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {categoryTokens.map((token: DesignToken) => (
                          <div key={token.id} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex flex-col">
                              <div className="text-sm font-medium">{token.name}</div>
                              <TokenPreview token={token} />
                            </div>
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost"
                                onClick={() => deleteToken(token.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-6 text-gray-500">
                    No design tokens found
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="add">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="token-name">Token Name</Label>
                  <Input 
                    id="token-name"
                    placeholder="e.g. primary-color"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="token-category">Category</Label>
                  <Select 
                    value={tokenCategory} 
                    onValueChange={(value) => setTokenCategory(value as TokenCategory)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="color">Color</SelectItem>
                      <SelectItem value="typography">Typography</SelectItem>
                      <SelectItem value="spacing">Spacing</SelectItem>
                      <SelectItem value="sizing">Sizing</SelectItem>
                      <SelectItem value="shadow">Shadow</SelectItem>
                      <SelectItem value="motion">Motion</SelectItem>
                      <SelectItem value="border">Border</SelectItem>
                      <SelectItem value="opacity">Opacity</SelectItem>
                      <SelectItem value="z-index">Z-Index</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="token-value">Value</Label>
                <Input 
                  id="token-value"
                  placeholder={tokenCategory === 'color' ? '#3b82f6' : ''}
                  value={tokenValue}
                  onChange={(e) => setTokenValue(e.target.value)}
                />
                {tokenCategory !== 'color' && (
                  <p className="text-xs text-gray-500">
                    For complex values, enter a valid JSON string
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="token-description">Description (Optional)</Label>
                <Input 
                  id="token-description"
                  placeholder="Brief description of this token"
                  value={tokenDescription}
                  onChange={(e) => setTokenDescription(e.target.value)}
                />
              </div>

              <Button 
                onClick={() => addToken()} 
                disabled={isAddingToken || !tokenName || !tokenValue}
                className="w-full"
              >
                {isAddingToken && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isAddingToken ? "Creating..." : "Create Design Token"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="apply">
            <div className="text-center p-6 text-gray-500">
              <p>Select wireframe elements and apply design tokens to them</p>
              <Button className="mt-4" disabled>
                Apply to Selected Elements
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
