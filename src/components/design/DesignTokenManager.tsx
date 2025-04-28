
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { PaintBucket, Type, ArrowsUpDown, Ruler } from 'lucide-react';
import { DesignSystemService, DesignToken } from '@/services/design-system/design-system-service';

interface DesignTokenManagerProps {
  projectId: string;
}

export function DesignTokenManager({ projectId }: DesignTokenManagerProps) {
  const [tokens, setTokens] = useState<DesignToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('color');
  
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
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'color':
        return <PaintBucket className="h-4 w-4" />;
      case 'typography':
        return <Type className="h-4 w-4" />;
      case 'spacing':
        return <ArrowsUpDown className="h-4 w-4" />;
      case 'sizing':
        return <Ruler className="h-4 w-4" />;
      default:
        return <PaintBucket className="h-4 w-4" />;
    }
  };
  
  const filteredTokens = tokens.filter(token => token.category === activeCategory);
  
  const renderTokenPreview = (token: DesignToken) => {
    if (token.category === 'color') {
      return (
        <div 
          className="w-10 h-10 rounded-md border"
          style={{ backgroundColor: token.value }}
        ></div>
      );
    } else if (token.category === 'typography') {
      return (
        <div className="text-sm">
          {typeof token.value === 'object' ? (
            <span style={{ 
              fontFamily: token.value.fontFamily, 
              fontSize: token.value.fontSize, 
              fontWeight: token.value.fontWeight 
            }}>
              Aa
            </span>
          ) : 'Invalid format'}
        </div>
      );
    } else if (token.category === 'spacing' || token.category === 'sizing') {
      return (
        <div className="text-sm">
          {typeof token.value === 'string' ? token.value : JSON.stringify(token.value)}
        </div>
      );
    }
    
    return <div className="text-sm">{JSON.stringify(token.value)}</div>;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Design Tokens</CardTitle>
        <CardDescription>
          Manage your design system tokens for colors, typography, spacing, and more
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="color" className="flex items-center">
              <PaintBucket className="h-4 w-4 mr-2" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center">
              <Type className="h-4 w-4 mr-2" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="spacing" className="flex items-center">
              <ArrowsUpDown className="h-4 w-4 mr-2" />
              Spacing
            </TabsTrigger>
            <TabsTrigger value="sizing" className="flex items-center">
              <Ruler className="h-4 w-4 mr-2" />
              Sizing
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredTokens.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredTokens.map(token => (
                  <div key={token.id} className="p-4 border rounded-md flex items-center">
                    <div className="mr-4 flex-shrink-0">
                      {renderTokenPreview(token)}
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium">{token.name}</div>
                      <div className="text-sm text-gray-500">
                        {token.description || 'No description'}
                      </div>
                    </div>
                    <Badge className="ml-2">{token.category}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No {activeCategory} tokens found
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
